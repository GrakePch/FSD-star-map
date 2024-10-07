import DB from "./Database.js";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./Controls.js";
import { euclideanDist, formatTime, getNumDaysSinceAnchor, modulo } from "../utils.js";
import UI from "./UI.js";
import { icon } from "../icons.js";
import Location from "./Location.js";

const omScalar = Math.sqrt(2);
const omCoordinates = [
  { x: 0, y: +omScalar, z: 0 },
  { x: 0, y: -omScalar, z: 0 },
  { x: 0, y: 0, z: +omScalar },
  { x: 0, y: 0, z: -omScalar },
  { x: -omScalar, y: 0, z: 0 },
  { x: +omScalar, y: 0, z: 0 },
];

export default class CelestialBody {
  constructor(
    name,
    type,
    ordinal,
    parentBody,
    parentStar,
    coordinates,
    rotationQuanternion,
    bodyRadius,
    rotationRate,
    rotationCorrection,
    orbitAngle,
    orbitalRadius,
    ringRadiusInner,
    ringRadiusOuter,
    themeColor, themeImage
  ) {
    this.name = name;
    this.type = type;
    this.ordinal = ordinal;
    this.parentBody = parentBody;
    this.parentStar = parentStar;
    this.coordinates = coordinates;
    this.rotationQuanternion = rotationQuanternion;
    this.bodyRadius = bodyRadius;
    this.lengthOfDay = rotationRate || 0; /* Hours per cycle */
    this.rotationCorrection = rotationCorrection || 0;
    this.orbitAngle = orbitAngle;
    this.orbitalRadius = orbitalRadius;
    this.ringRadiusInner = ringRadiusInner;
    this.ringRadiusOuter = ringRadiusOuter;
    this.themeColor = themeColor;
    this.themeImage = themeImage;

    this.lengthOfDayInEarthDay = this.lengthOfDay / 24; /* Real-Earth day per cycle */
    this.angularRotationRate = 6 / this.lengthOfDay;

    this.childBodies = Array();
    this.locations = Array();

    this.orbitalInclination = THREE.MathUtils.radToDeg(
      Math.atan(
        this.coordinates.y /
          euclideanDist({
            x: this.coordinates.x,
            y: 0,
            z: this.coordinates.z,
          })
      )
    );

    // 将当前星球对象添加到 UI 类的 celestialBodies 数组中
    UI.addCelestialBody(this);

    DB.bodies.push(this);
  }

  createMesh() {
    this.meshGroup = new THREE.Group();

    this.meshBody = new THREE.Object3D();
    this.meshBody.position.set(...this.getPosition());
    this.meshGroup.attach(this.meshBody);

    if (this.type === "Star") {
      this.#createMeshSphere(0xffffaa, 0xffffaa);
      const light = new THREE.PointLight(0xffffff, 5, 0, 0);
      this.lightSource = light;
      this.meshBody.add(light);
    }
    if (this.type === "Planet") {
      this.#createMeshSphere(0xffffff);
      const color = this.themeColor
        ? `rgb(${this.themeColor.r}, ${this.themeColor.g}, ${this.themeColor.b})`
        : 0xffffff;
      this.#createMeshOrbit([0, 0, 0], color);
      this.#createOMs();
    }
    if (this.type === "Moon") {
      this.#createMeshSphere(0x404040);
      this.#createMeshOrbit(this.parentBody.getPosition(), 0x404040);
      this.meshGroup.attach(this.meshOrbit);
      this.#createOMs();
    }
    if (this.type === "Jump Point") {
      this.#createMeshOrbit([0, 0, 0], 0x404040);
      this.meshGroup.attach(this.meshOrbit);
    }

    this.#loadMaps(false);

    this.#createMeshRing();

    this.#createLabel();

    this.#createElevationLine();

    for (const location of this.locations) {
      location.createLabel();
    }

    if (this.parentBody) {
      this.parentBody.meshGroup.attach(this.meshGroup);
    }
  }

  createChildrenMesh() {
    for (const childBody of this.childBodies) {
      childBody.createMesh();
      childBody.createChildrenMesh();
    }
  }

  addToScene(scene) {
    if (this.meshGroup) {
      scene.add(this.meshGroup);
    }
  }

  getPosition() {
    return Array.from(Object.values(this.coordinates));
  }

  #createMeshSphere(color, emissive) {
    const geometry = new THREE.SphereGeometry(this.bodyRadius, 100, 50);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: emissive ? emissive : null,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(...this.getPosition());

    this.meshBody = sphere;
    this.meshGroup.attach(this.meshBody);
  }

  #createMeshOrbit(position, color) {
    const geoCircle = new THREE.CircleGeometry(this.orbitalRadius, 2000);
    const itemSize = 3;
    geoCircle.setAttribute(
      "position",
      new THREE.BufferAttribute(
        geoCircle.attributes.position.array.slice(
          itemSize,
          geoCircle.attributes.position.array.length - itemSize
        ),
        itemSize
      )
    );
    geoCircle.index = null;
    const matCircle = new THREE.LineBasicMaterial({ color: color });
    const meshOrbit = new THREE.LineLoop(geoCircle, matCircle);
    meshOrbit.rotateX(Math.PI / 2);
    meshOrbit.position.set(...position);

    if (this.orbitalInclination != 0) {
      let rotAxis = new THREE.Vector3(
        this.coordinates.x,
        this.coordinates.y,
        this.coordinates.z
      );
      rotAxis.cross(new THREE.Vector3(0, this.coordinates.y, 0)).normalize();
      meshOrbit.rotateOnWorldAxis(
        rotAxis,
        (this.coordinates.y > 0 ? 1 : -1) *
          THREE.MathUtils.degToRad(this.orbitalInclination)
      );
    }

    this.meshOrbit = meshOrbit;
    this.meshGroup.attach(this.meshOrbit);
  }

  #createMeshRing() {
    if (!(this.ringRadiusInner && this.ringRadiusOuter)) return;
    let tex = new THREE.TextureLoader().load(
      `./public/textures/rings/asteroid_ring_yela_diff.png`
    );
    const geometry = new THREE.RingGeometry(
      this.ringRadiusInner,
      this.ringRadiusOuter,
      100
    );
    var pos = geometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      geometry.attributes.uv.setXY(
        i,
        1,
        v3.length() < (this.ringRadiusInner + this.ringRadiusOuter) / 2 ? 0 : 1
      );
    }

    const material = new THREE.MeshStandardMaterial({
      map: tex,
      side: THREE.DoubleSide,
      transparent: true,
      emissive: 0x8cc2ff,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(Math.PI / 2);

    this.meshRing = mesh;
    this.meshBody.add(mesh);
  }

  #createLabel() {
    const element = document.createElement("div");
    element.textContent = this.name;
    element.className = "label";
    element.addEventListener("pointerdown", this.getZoomInTheBody());
    const labelObj = new CSS2DObject(element);
    labelObj.position.set(0, this.bodyRadius * 1.5, 0);
    labelObj.center.set(0.5, 1);

    this.label = labelObj;
    this.meshBody.add(this.label);
  }

  #createElevationLine() {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -this.coordinates.y, 0),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x222222 });
    const elevationLine = new THREE.Line(geometry, material);

    this.meshBody.add(elevationLine);
  }

  #createOMs() {
    for (let i = 0; i < 6; ++i) {
      let location = new Location(
        `OM-${i + 1}`, "Orbital marker", this, this.parentStar, 
        {
          x: omCoordinates[i].x * this.bodyRadius, 
          y: omCoordinates[i].y * this.bodyRadius, 
          z: omCoordinates[i].z * this.bodyRadius
        }, 
        0, 1, null, null, null
      )
      this.locations.push(location)
    }
  }

  updateMapsRecur(loadHD) {
    this.#loadMaps(loadHD);
    for (const body of this.childBodies) {
      body.updateMapsRecur(loadHD);
    }
  }

  #loadMaps(loadHD) {
    if (!["Planet", "Moon"].includes(this.type)) return;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      `./public/textures/${
        loadHD ? "bodies-hd" : "bodies"
      }/${this.name.toLowerCase()}.webp`,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        this.meshBody.material.map = t;
        this.meshBody.material.color.set(0xffffff);
        this.meshBody.material.needsUpdate = true;
      },
      undefined,
      (err) => console.error(err)
    );

    textureLoader.load(
      `./public/textures/bodies-reflection/${this.name.toLowerCase()}.webp`,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        this.meshBody.material.roughnessMap = t;
        this.meshBody.material.needsUpdate = true;
      },
      undefined,
      (err) => undefined
    );
  }

  createNavDOMAt(element, layer) {
    var wrapper = document.createElement("div");

    if (layer === 1 && this.childBodies.length > 0) {
      wrapper.innerHTML = `<div class="indent-1 ${this.type
        .split(" ")
        .join(
          "_"
        )}"><button><div class="thumbnail" style="background-image: url('public/thumbnails/${
        this.name
      }.png')"></div>
        <div>
          <p>${this.name}</p>
          <p class="sub">${this.type}</p>
        </div>
      </button>
      <button class="accordion" onclick></button>
      </div>`;
      var el = wrapper.firstChild;
      element.insertAdjacentElement("beforeend", el);

      const elButton = el.firstChild;
      elButton.addEventListener("click", this.getZoomInTheBody());
      this.DOMButton = elButton;

      const elAccordion = elButton.nextElementSibling;
      elAccordion.addEventListener("click", function () {
        this.classList.toggle("on");
        var childGroup = this.parentElement.nextElementSibling;
        if (this.classList.contains("on")) {
          childGroup.style.maxHeight = childGroup.scrollHeight + "px";
        } else {
          childGroup.style.maxHeight = 0;
        }
      });

      wrapper.innerHTML = `<div class="group"></div>`;
      var el = wrapper.firstChild;
      element.insertAdjacentElement("beforeend", el);
      element = el;
    } else {
      wrapper.innerHTML = `<div class="indent-${layer} ${this.type
        .split(" ")
        .join(
          "_"
        )}"><button><div class="thumbnail" style="background-image: url('public/thumbnails/${
        this.name
      }.png')"></div>
          <div>
            <p>${this.name}</p>
            <p class="sub">${this.type}</p>
          </div>
        </button>
      </div>`;
      var el = wrapper.firstChild;
      element.insertAdjacentElement("beforeend", el);

      const elButton = el.firstChild;
      elButton.addEventListener("click", this.getZoomInTheBody());
      this.DOMButton = elButton;
    }

    if (this.type === "Star" || this.type === "Jump Point") {
      this.DOMButton.firstChild.insertAdjacentElement(
        "beforeend",
        icon(this.type.split(" ").join("_"))
      );
    }

    if (this.type === "Lagrange Point") {
      this.DOMButton.firstChild.insertAdjacentElement(
        "beforeend",
        icon("rhombus")
      );
    }

    for (const childBody of this.childBodies) {
      childBody.createNavDOMAt(element, layer + 1);
    }
  }

  getZoomInTheBody() {
    return () => {
      // Update the selected DOMButton
      UI.updateControlTarget(this);
      UI.controlTargetDOMButton?.classList.remove("targeting");
      UI.controlTargetDOMButton = this.DOMButton;
      UI.controlTargetDOMButton.classList.add("targeting");

      let targetPosition;
      const starDistance = 70000000; // Fixed target distance for stars
      const minDistanceThreshold = 10; // Distance threshold, unit: adjust according to the scene (e.g., 1000)

      // Get the current position of the camera
      const cameraPosition = Ctrls.camera.position.clone();

      if (this.type === "Star") {
        // If it's a star, move directly to the fixed position
        targetPosition = new THREE.Vector3(0, starDistance, 0);
      } else {
        // Get the center position of the celestial body
        const objectPosition = this.meshBody.position.clone();

        // Calculate the required distance for the celestial body, Math.max(this.bodyRadius, 600) * 3
        const dynamicDistance = Math.max(this.bodyRadius, 300) * 3;

        // Calculate the direction vector from the camera to the center of the celestial body
        const directionToCamera = cameraPosition
          .clone()
          .sub(objectPosition)
          .normalize();

        // Calculate the target position: a point at a distance of dynamicDistance in the current direction
        targetPosition = objectPosition
          .clone()
          .add(directionToCamera.multiplyScalar(dynamicDistance));

        // Calculate the direction vector from the celestial body to the sun
        const sunPosition = new THREE.Vector3(0, 0, 0); // Assuming the sun is at the origin
        const directionToSun = sunPosition
          .clone()
          .sub(objectPosition)
          .normalize();

        // Apply a small offset towards the sun direction
        const sunOffset = directionToSun.multiplyScalar(100); // Adjust the offset as needed
        targetPosition.add(sunOffset);
      }

      const currentPosition = Ctrls.camera.position.clone(); // Current camera position
      const currentTarget = Ctrls.controls.target.clone(); // Current camera target position
      const targetObjectPosition = this.meshBody.position.clone(); // Center position of the target celestial body

      // Calculate the distance from the current camera position to the target position
      const distanceToTarget = currentPosition.distanceTo(targetPosition);

      // If the distance between the camera and the target is less than the threshold, teleport directly
      if (distanceToTarget < minDistanceThreshold) {
        Ctrls.camera.position.copy(targetPosition);
        Ctrls.controls.target.copy(targetObjectPosition);

        // Ensure the camera is aimed at the target position
        Ctrls.camera.lookAt(this.meshBody.position);
        return; // Interrupt the animation
      }

      const duration = 2000; // Animation duration
      const startTime = performance.now();
      let isAnimating = true; // Animation state flag

      // Easing function
      const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

      // Mouse event listener to stop animation
      const stopAnimation = () => {
        isAnimating = false;
      };

      // Animation function
      const animate = (time) => {
        if (!isAnimating) {
          window.removeEventListener("mousedown", stopAnimation);
          return;
        }

        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1); // Interpolation factor [0,1]

        // Use the easing function to calculate the transition of the camera position
        const easedPositionT = easeOutQuint(t);
        const newPosition = currentPosition
          .clone()
          .lerp(targetPosition, easedPositionT);
        Ctrls.camera.position.copy(newPosition);

        // Dynamically calculate the camera's rotation to ensure it is always aimed at the target position
        const targetQuaternion = new THREE.Quaternion();
        const lookAtMatrix = new THREE.Matrix4().lookAt(
          Ctrls.camera.position,
          this.meshBody.position,
          Ctrls.camera.up
        );
        targetQuaternion.setFromRotationMatrix(lookAtMatrix);

        // Perform rotation interpolation (SLERP)
        Ctrls.camera.quaternion.slerp(targetQuaternion, t);

        // Interpolate the controller's target position
        const newTarget = currentTarget
          .clone()
          .lerp(targetObjectPosition, easedPositionT);
        Ctrls.controls.target.copy(newTarget);

        // Check the distance between the camera and the target each frame, if close enough, interrupt the animation and teleport
        const currentDistance =
          Ctrls.camera.position.distanceTo(targetPosition);
        if (currentDistance < minDistanceThreshold) {
          Ctrls.camera.position.copy(targetPosition);
          Ctrls.controls.target.copy(targetObjectPosition);
          // Ensure the camera is aimed at the target position
          Ctrls.camera.lookAt(this.meshBody.position);
          window.removeEventListener("mousedown", stopAnimation);
          return; // Interrupt the animation
        }

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          // At the end of the animation, ensure the camera is precisely aimed at the target position
          Ctrls.camera.position.copy(targetPosition);
          Ctrls.controls.target.copy(targetObjectPosition);

          // Force the camera to aim at the center of the celestial body to ensure the final position is correct
          Ctrls.controls.target.copy(this.meshBody.position);
          window.removeEventListener("mousedown", stopAnimation);
        }
      };

      // Start animation and add mouse event listener after 0.1 seconds
      setTimeout(() => {
        if (isAnimating) {
          window.addEventListener("mousedown", stopAnimation);
        }
      }, 100);

      requestAnimationFrame(animate);
    };
  }

   showCoordinatesOnHover() {
    const coordinatesDiv = document.getElementById("coordinates");

    // Save mouse position
    const mouse = new THREE.Vector2();

    // Update mouse position
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const updateCoordinates = () => {
        // Create raycaster
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, Ctrls.camera);

        // Get the currently focused celestial body
        const focusedBody = UI.getControlTarget();

        if (focusedBody && focusedBody.meshBody) {
            const intersects = raycaster.intersectObject(focusedBody.meshBody);
            if (intersects.length > 0) {
                const intersect = intersects[0];
                const point = intersect.point.clone(); // World coordinates of the mouse click

                // Convert world coordinates to the celestial body's local coordinates
                const localPoint = focusedBody.meshBody.worldToLocal(point.clone());

                // Calculate latitude and longitude
                const radius = focusedBody.bodyRadius;
                const phi = Math.acos(localPoint.y / radius); // Polar angle
                let theta = Math.atan2(localPoint.z, localPoint.x); // Azimuthal angle
                theta = -theta; // Reverse theta to match the planet's rotation
                const latitude = (phi * 180) / Math.PI - 90; // Latitude
                let longitude = (theta * 180) / Math.PI; // Longitude
                longitude = longitude - 180; // 保持偏移修正

                // Normalize longitude to be within -180 to 180 degrees
                if (longitude < -180) {
                    longitude += 360;
                } else if (longitude > 180) {
                    longitude -= 360;
                }

                // Get time until sunrise or sunset, passing absolute coordinates
                const [sunEvent, localTime] = focusedBody.getTimeUntilSunriseOrSunset(point);

                const latitudeStr = (latitude>= 0 ? "+" : "−") + Math.abs(latitude.toFixed(0));
                const longitudeStr = (longitude>= 0 ? "+" : "−") + Math.abs(longitude.toFixed(0));

                // Display latitude, longitude, and surface time information
                const info = `Lat.${latitudeStr}°, Long.${longitudeStr}°<br/>${localTime}<br/>${sunEvent}`;
                coordinatesDiv.innerHTML = info;
                coordinatesDiv.style.display = "block";
                coordinatesDiv.classList.add("cursor-info");
                coordinatesDiv.style.left = `${((mouse.x + 1) * window.innerWidth) / 2 + 10}px`;
                coordinatesDiv.style.top = `${((-mouse.y + 1) * window.innerHeight) / 2 + 10}px`;

                return;
            }
        }

        // If no celestial body is focused or no intersection, hide the coordinates information
        coordinatesDiv.style.display = "none";
    };

    // Add update to the animation loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Update coordinates display
        updateCoordinates();
    };

    animate(); // Start the animation loop
}


getTimeUntilSunriseOrSunset(mousePosition) {
  if (this.lengthOfDayInEarthDay === 0) {
      return ["", "00:00:00"];
  }

  // Ensure the rotation state is up-to-date
  this.updateRotationRecur();

  // Calculate the planet's angular speed (radians per second)
  const angularSpeed = (2 * Math.PI) / (this.lengthOfDay * 3600);

  if (angularSpeed === 0) {
      return ["", "00:00:00"];
  }

  // Get the direction vector of the star in the planet's local coordinate system
  const sunDirectionWorld = this.parentStar.meshBody.getWorldPosition(new THREE.Vector3())
      .sub(this.meshBody.getWorldPosition(new THREE.Vector3()))
      .normalize();
  const sunDirectionLocal = sunDirectionWorld.applyQuaternion(this.meshBody.quaternion.clone().invert());

  // Calculate the longitude and latitude of the subsolar point
  const subsolarLongitude = Math.atan2(sunDirectionLocal.z, sunDirectionLocal.x);
  const subsolarLatitude = Math.asin(sunDirectionLocal.y);

  // Convert the mouse click world coordinates to the planet's local coordinates
  const localPoint = this.meshBody.worldToLocal(mousePosition.clone()).normalize();

  // Calculate the longitude and latitude of the given point
  const longitude = Math.atan2(localPoint.z, localPoint.x);
  const latitude = Math.asin(localPoint.y);

  // Adjust the hour angle calculation, reverse the hour angle to correct the sunrise and sunset positions
  let hourAngle = subsolarLongitude - longitude;

  // Normalize to [-π, π]
  if (hourAngle > Math.PI) {
    hourAngle = (hourAngle % (2 * Math.PI)) - 2 * Math.PI;
  } else if (hourAngle < -Math.PI) {
    hourAngle = (hourAngle % (2 * Math.PI)) + 2 * Math.PI;
  }

  // Calculate the cosine of the zenith angle
  const cosZenithAngle = Math.sin(subsolarLatitude) * Math.sin(latitude) + Math.cos(subsolarLatitude) * Math.cos(latitude) * Math.cos(hourAngle);

  // Determine if the point is in daylight
  const isInSunlight = cosZenithAngle > 0;

  // Calculate the hour angle of sunrise/sunset
  const cosH0 = -Math.tan(subsolarLatitude) * Math.tan(latitude);

  let H0;
  if (cosH0 >= 1) {
    // The sun is always below the horizon, never rises
    return ["Polar night", "--:--:--"]; //TODO: local time is still applicable!
  } else if (cosH0 <= -1) {
    // The sun is always above the horizon, never sets
    return ["Polar day", "--:--:--"];
  } else {
    H0 = Math.acos(cosH0);
  }

  let eventType;
  let angleUntilEvent;

  if (isInSunlight) {
    // Currently in daylight, calculate the time until sunset
    eventType = "Sunset T − ";
    angleUntilEvent = hourAngle - H0;
  } else {
    // Currently at night, calculate the time until sunrise
    eventType = "Sunrise T − ";
    angleUntilEvent = hourAngle + H0;
  }

  // Normalize angleUntilEvent to [-π, π]
  angleUntilEvent = ((angleUntilEvent + Math.PI) % (2 * Math.PI)) - Math.PI;

  // Calculate the time until the event
  let timeUntilEvent = -angleUntilEvent / angularSpeed / 3600; // Since the angle decreases, time increases, so take the negative value

  // If the time is negative, add a full rotation period
  if (timeUntilEvent < 0) {
    timeUntilEvent += this.lengthOfDay;
  }

  let offSetHourToNoon = (hourAngle / (Math.PI * 2)) * this.lengthOfDay;
  let offSetHourToNoonStr = offSetHourToNoon >= 0 ? "+ " + formatTime(offSetHourToNoon) : "− " + formatTime(-offSetHourToNoon);

  // Return the event type, time until the event, and local time
  return [`${eventType}${formatTime(timeUntilEvent)}`, `Noon T ${offSetHourToNoonStr}`];
}

  showLabel(show) {
    const labelEle = this.label.element;
    if (show) labelEle.classList.remove("hide");
    else labelEle.classList.add("hide");
  }

  updateLabel() {
    if (
      Ctrls.controls.getDistance() >
      (UI.controlTarget ? UI.controlTarget.bodyRadius * 5 : 0)
    ) {
      if (this.parentBody && UI.controlTarget !== this) {
        const labelEle = this.label.element;
        const labelRect = labelEle.getBoundingClientRect();
        const labelCenter2D = [
          labelRect.x + 0.5 * labelRect.width,
          labelRect.y + 0.5 * labelRect.height,
        ];

        const labelParentEle = this.parentBody.label.element;
        const labelParentRect = labelParentEle.getBoundingClientRect();
        const labelParentCenter2D = [
          labelParentRect.x + 0.5 * labelParentRect.width,
          labelParentRect.y + 0.5 * labelParentRect.height,
        ];

        const thresholdDistX = (labelParentRect.width + labelRect.width) / 2;
        const thresholdDistY = (labelParentRect.height + labelRect.height) / 2;

        if (
          Math.abs(labelCenter2D[0] - labelParentCenter2D[0]) <
            thresholdDistX &&
          Math.abs(labelCenter2D[1] - labelParentCenter2D[1]) < thresholdDistY
        ) {
          this.showLabel(false);
        } else {
          this.showLabel(true);
        }
      } else {
        this.showLabel(true);
      }
    } else {
      this.showLabel(false);
    }

    for (const childBody of this.childBodies) {
      childBody.updateLabel();
    }
  }

  showLocations(show) {
    for (const location of this.locations) {
      location.showLabel(show);
    }
  }

  showLocationsOrbit(show) {
    for (const location of this.locations) {
      location.showOrbit(show);
    }
  }
  
  showLocationsElevationLine(show) {
    for (const location of this.locations) {
      location.showElevationLine(show);
    }
  }

  updateLocationVisibility() {
    if (Ctrls.controls.getDistance() < Math.max(this.bodyRadius * 5, 1000)) {
      for (const location of this.locations) {
        location.showLabel(location.checkIfAtFrontOfSphere());
      }
      this.showLocationsOrbit(true);
      this.showLocationsElevationLine(true);
    } else {
      this.showLocations(false);
      this.showLocationsOrbit(false);
      this.showLocationsElevationLine(false);
    }
  }

  getCurrentCycle() {
    if (this.lengthOfDayInEarthDay === 0) {
      return 0;
    } else {
      return getNumDaysSinceAnchor() / this.lengthOfDayInEarthDay;
    }
  }

  getRotationDeg() {
    const cycle = this.getCurrentCycle();
    const rotDeg = modulo(cycle, 1) * 360;
    const correctedRotDeg = 360 - rotDeg - this.rotationCorrection;
    const result = modulo(90 - correctedRotDeg, 360);
    return result;
  }

  updateRotationByTime() {
    this.meshBody.rotation.y = THREE.MathUtils.degToRad(this.getRotationDeg());
  }

  updateRotationRecur() {
    this.updateRotationByTime();
    for (const body of this.childBodies) {
      body.updateRotationRecur();
    }
  }
}
