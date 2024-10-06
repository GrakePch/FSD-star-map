import DB from "./Database.js";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./Controls.js";
import { euclideanDist, getNumDaysSinceAnchor, modulo } from "../utils.js";
import UI from "./UI.js";
import { icon } from "../icons.js";

export default class CelestialBody {
  constructor(name, type, ordinal, parentBody, parentStar, coordinates, rotationQuanternion, bodyRadius, rotationRate, rotationCorrection, orbitAngle, orbitalRadius, ringRadiusInner, ringRadiusOuter, themeColor) {
    this.name = name;
    this.type = type;
    this.ordinal = ordinal;
    this.parentBody = parentBody;
    this.parentStar = parentStar;
    this.coordinates = coordinates;
    this.rotationQuanternion = rotationQuanternion;
    this.bodyRadius = bodyRadius;
    this.rotationRate = rotationRate || 0;
    this.rotationCorrection = rotationCorrection || 0;
    this.orbitAngle = orbitAngle;
    this.orbitalRadius = orbitalRadius;
    this.ringRadiusInner = ringRadiusInner;
    this.ringRadiusOuter = ringRadiusOuter;
    this.themeColor = themeColor;

    this.lengthOfDay = (3600 * this.rotationRate) / 86400;
    this.angularRotationRate = 6 / this.rotationRate;

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
      this.meshBody.add(light);
    }
    if (this.type === "Planet") {
      this.#loadMaps();
      this.#createMeshSphere(0xffffff);
      const color = this.themeColor ? `rgb(${this.themeColor.r}, ${this.themeColor.g}, ${this.themeColor.b})` : 0xffffff;
      this.#createMeshOrbit([0, 0, 0], color);
    }
    if (this.type === "Moon") {
      this.#createMeshSphere(0x404040);
      this.#loadMaps();
      this.#createMeshOrbit(this.parentBody.getPosition(), 0x404040);
      this.meshGroup.attach(this.meshOrbit);
    }
    if (this.type === "Jump Point") {
      this.#createMeshOrbit([0, 0, 0], 0x404040);
      this.meshGroup.attach(this.meshOrbit);
    }

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
    const material = new THREE.MeshStandardMaterial({ color: color, emissive: emissive ? emissive : null });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(...this.getPosition());

    this.meshBody = sphere;
    this.meshGroup.attach(this.meshBody);
  }

  #createMeshOrbit(position, color) {
    const geoCircle = new THREE.CircleGeometry(this.orbitalRadius, 2000);
    const itemSize = 3;
    geoCircle.setAttribute("position", new THREE.BufferAttribute(geoCircle.attributes.position.array.slice(itemSize, geoCircle.attributes.position.array.length - itemSize), itemSize));
    geoCircle.index = null;
    const matCircle = new THREE.LineBasicMaterial({ color: color });
    const meshOrbit = new THREE.LineLoop(geoCircle, matCircle);
    meshOrbit.rotateX(Math.PI / 2);
    meshOrbit.position.set(...position);

    if (this.orbitalInclination != 0) {
      let rotAxis = new THREE.Vector3(this.coordinates.x, this.coordinates.y, this.coordinates.z);
      rotAxis.cross(new THREE.Vector3(0, this.coordinates.y, 0)).normalize();
      meshOrbit.rotateOnWorldAxis(rotAxis, (this.coordinates.y > 0 ? 1 : -1) * THREE.MathUtils.degToRad(this.orbitalInclination));
    }

    this.meshOrbit = meshOrbit;
    this.meshGroup.attach(this.meshOrbit);
  }

  #createMeshRing() {
    if (!(this.ringRadiusInner && this.ringRadiusOuter)) return;
    let tex = new THREE.TextureLoader().load(`./public/textures/rings/asteroid_ring_yela_diff.png`);
    const geometry = new THREE.RingGeometry(this.ringRadiusInner, this.ringRadiusOuter, 100);
    var pos = geometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      geometry.attributes.uv.setXY(i, 1, v3.length() < (this.ringRadiusInner + this.ringRadiusOuter) / 2 ? 0 : 1);
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
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -this.coordinates.y, 0)];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x222222 });
    const elevationLine = new THREE.Line(geometry, material);

    this.meshBody.add(elevationLine);
  }

  #loadMaps() {
    const loadHD = false;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      `./public/textures/${loadHD ? "bodies-hd" : "bodies"}/${this.name.toLowerCase()}.webp`,
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
      wrapper.innerHTML = `<div class="indent-1 ${this.type.split(" ").join("_")}"><button><div class="thumbnail" style="background-image: url('public/thumbnails/${this.name}.png')"></div>
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
      wrapper.innerHTML = `<div class="indent-${layer} ${this.type.split(" ").join("_")}"><button><div class="thumbnail" style="background-image: url('public/thumbnails/${this.name}.png')"></div>
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
      this.DOMButton.firstChild.insertAdjacentElement("beforeend", icon(this.type.split(" ").join("_")));
    }

    if (this.type === "Lagrange Point") {
      this.DOMButton.firstChild.insertAdjacentElement("beforeend", icon("rhombus"));
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
        const directionToCamera = cameraPosition.clone().sub(objectPosition).normalize();

        // Calculate the target position: a point at a distance of dynamicDistance in the current direction
        targetPosition = objectPosition.clone().add(directionToCamera.multiplyScalar(dynamicDistance));

        // Calculate the direction vector from the celestial body to the sun
        const sunPosition = new THREE.Vector3(0, 0, 0); // Assuming the sun is at the origin
        const directionToSun = sunPosition.clone().sub(objectPosition).normalize();

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
        const newPosition = currentPosition.clone().lerp(targetPosition, easedPositionT);
        Ctrls.camera.position.copy(newPosition);

        // Dynamically calculate the camera's rotation to ensure it is always aimed at the target position
        const targetQuaternion = new THREE.Quaternion();
        const lookAtMatrix = new THREE.Matrix4().lookAt(Ctrls.camera.position, this.meshBody.position, Ctrls.camera.up);
        targetQuaternion.setFromRotationMatrix(lookAtMatrix);

        // Perform rotation interpolation (SLERP)
        Ctrls.camera.quaternion.slerp(targetQuaternion, t);

        // Interpolate the controller's target position
        const newTarget = currentTarget.clone().lerp(targetObjectPosition, easedPositionT);
        Ctrls.controls.target.copy(newTarget);

        // Check the distance between the camera and the target each frame, if close enough, interrupt the animation and teleport
        const currentDistance = Ctrls.camera.position.distanceTo(targetPosition);
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

    const onMouseMove = (event) => {
      // 获取鼠标位置
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // 创建射线
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, Ctrls.camera);

      // 获取当前聚焦的星球
      const focusedBody = UI.getControlTarget();

      if (focusedBody && focusedBody.meshBody) {
        const intersects = raycaster.intersectObject(focusedBody.meshBody);
        if (intersects.length > 0) {
          const intersect = intersects[0];
          const point = intersect.point;

          // 使用星球的原点计算相对于星球中心的坐标
          const relativePoint = point.clone().sub(focusedBody.meshBody.position);

          // 计算经纬度
          const radius = focusedBody.bodyRadius;
          const phi = Math.acos(relativePoint.y / radius);
          const theta = Math.atan2(relativePoint.z, relativePoint.x);

          const latitude = (phi * 180) / Math.PI - 90;
<<<<<<< HEAD
          let longitude = (theta * 180) / Math.PI + 200; // 移动60度
  
          // 归一化经度到-180到180度之间
          longitude = ((longitude + 180) % 360 + 360) % 360 - 180;
  
=======
          const longitude = (theta * 180) / Math.PI;

>>>>>>> 4703418b664d5b9b1b9bb20190a0e59bd39a839a
          // 显示经纬度信息
          const info = `纬度: ${latitude.toFixed(2)}°, 经度: ${longitude.toFixed(2)}°`;
          coordinatesDiv.innerHTML = info;
          coordinatesDiv.style.display = "block";
          coordinatesDiv.style.left = `${event.clientX + 10}px`;
          coordinatesDiv.style.top = `${event.clientY + 10}px`;

          return;
        }
      }

      coordinatesDiv.style.display = "none";
    };

    // 添加鼠标移动事件侦听器
<<<<<<< HEAD
    window.addEventListener('mousemove', onMouseMove);
}
  
getTimeUntilSunriseOrSunset(mousePosition) {
    if (this.lengthOfDay === 0) {
        return "00:00:00";
    }

    // 确保自转状态是最新的
    this.updateRotationRecur();

    // 1. 获取鼠标的绝对位置 (已知为绝对坐标)
    const pointPosition = mousePosition.clone();  // 这里 mousePosition 是鼠标点击的世界坐标

    // 2. 获取星球的绝对位置（星球中心）
    const planetPosition = this.meshBody.position.clone();  // 星球的中心位置

    // 3. 获取恒星的绝对位置
    const starPosition = this.parentStar.meshBody.position.clone();  // 恒星的绝对位置

    // 4. 计算恒星到星球中心的向量（光照方向）
    const directionToStar = starPosition.sub(planetPosition).normalize();  // 光照方向向量

    // 5. 计算鼠标点到星球中心的向量
    const directionToPoint = pointPosition.sub(planetPosition).normalize();  // 鼠标点方向向量

    // 6. 计算恒星光照方向与鼠标点的夹角 (点积计算cos夹角)
    const cosAngle = directionToStar.dot(directionToPoint);  // 点积用于计算夹角的cos值

    // 判断当前点是否在光照面
    const isInSunlight = cosAngle > 0;  // 当cos夹角大于0，表示当前点在光照面上

    let secondsUntilEvent;
    let eventType;

    // 7. 如果当前点在光照面，计算到日落的时间
    if (isInSunlight) {
        eventType = "即将日落";

        // 计算离开光照面的时间（即日落）
        const angleToSunset = Math.acos(cosAngle);  // 从光照面离开的角度
        secondsUntilEvent = (angleToSunset / (2 * Math.PI)) * this.lengthOfDay * 3600;

    } else {
        // 否则当前点在阴影面，计算到日出的时间
        eventType = "即将日出";

        // 计算进入光照面的时间（即日出）
        const angleToSunrise = Math.acos(-cosAngle);  // 从阴影进入光照面的角度
        secondsUntilEvent = (angleToSunrise / (2 * Math.PI)) * this.lengthOfDay * 3600;
    }

    // 8. 将时间转换为小时、分钟、秒格式
    const hours = Math.floor(secondsUntilEvent / 3600);
    const minutes = Math.floor((secondsUntilEvent % 3600) / 60);
    const seconds = Math.floor(secondsUntilEvent % 60);

    const pad = (num) => String(num).padStart(2, '0');

    // 9. 返回带有事件类型和时间的字符串
    return `${eventType}: ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
>>>>>>> 4703418b664d5b9b1b9bb20190a0e59bd39a839a

  showLabel(show) {
    const labelEle = this.label.element;
    if (show) labelEle.classList.remove("hide");
    else labelEle.classList.add("hide");
  }

  updateLabel() {
    if (Ctrls.controls.getDistance() > (UI.controlTarget ? UI.controlTarget.bodyRadius * 5 : 0)) {
      if (this.parentBody && UI.controlTarget !== this) {
        const labelEle = this.label.element;
        const labelRect = labelEle.getBoundingClientRect();
        const labelCenter2D = [labelRect.x + 0.5 * labelRect.width, labelRect.y + 0.5 * labelRect.height];

        const labelParentEle = this.parentBody.label.element;
        const labelParentRect = labelParentEle.getBoundingClientRect();
        const labelParentCenter2D = [labelParentRect.x + 0.5 * labelParentRect.width, labelParentRect.y + 0.5 * labelParentRect.height];

        const thresholdDistX = (labelParentRect.width + labelRect.width) / 2;
        const thresholdDistY = (labelParentRect.height + labelRect.height) / 2;

        if (Math.abs(labelCenter2D[0] - labelParentCenter2D[0]) < thresholdDistX && Math.abs(labelCenter2D[1] - labelParentCenter2D[1]) < thresholdDistY) {
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

  updateLocationVisibility() {
    if (Ctrls.controls.getDistance() < Math.max(this.bodyRadius * 5, 1000)) {
      for (const location of this.locations) {
        location.showLabel(location.checkIfAtFrontOfSphere());
      }
      this.showLocationsOrbit(true);
    } else {
      this.showLocations(false);
      this.showLocationsOrbit(false);
    }
  }

  getCurrentCycle() {
    if (this.lengthOfDay === 0) {
      return 0;
    } else {
      return getNumDaysSinceAnchor() / this.lengthOfDay;
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
