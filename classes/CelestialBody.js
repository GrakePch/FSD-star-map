import DB from "./Database.js";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./Controls.js";
import { euclideanDist } from "../utils.js";
import UI from "./UI.js";

export default class CelestialBody {
  constructor(name, type, ordinal, parentBody, parentStar, coordinates, rotationQuanternion, bodyRadius, rotationRate, rotationCorrection, orbitAngle, orbitalRadius, themeColor) {
    this.name = name;
    this.type = type;
    this.ordinal = ordinal;
    this.parentBody = parentBody;
    this.parentStar = parentStar;
    this.coordinates = coordinates;
    this.rotationQuanternion = rotationQuanternion;
    this.bodyRadius = bodyRadius;
    this.rotationRate = rotationRate;
    this.rotationCorrection = rotationCorrection;
    this.orbitAngle = orbitAngle;
    this.orbitalRadius = orbitalRadius;
    this.themeColor = themeColor;

    this.lengthOfDay = (3600 * this.rotationRate) / 86400;
    this.angularRotationRate = 6 / this.rotationRate;

    this.childBodies = Array();

    //TODO: consider parent as [0, 0, 0], which is a temporary
    // console.log(this.name)
    // console.log(this.coordinates.y)
    // console.log(euclideanDist({
    //   x: this.coordinates.x,
    //   y: this.coordinates.y,
    //   z: this.coordinates.z,
    // }))
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

    this.#createLabel();

    this.#createElevationLine();

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
    return;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      `./public/textures/bodies-hd/${this.name.toLowerCase()}.webp`,
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
      wrapper.innerHTML = `<div class="indent-1"><button>${this.name}</button><button class="accordion" onclick></button></div>`;
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
      wrapper.innerHTML = `<div class="indent-${layer}"><button>${this.name}</button></div>`;
      var el = wrapper.firstChild;
      element.insertAdjacentElement("beforeend", el);

      const elButton = el.firstChild;
      elButton.addEventListener("click", this.getZoomInTheBody());
      this.DOMButton = elButton;
    }

    for (const childBody of this.childBodies) {
      childBody.createNavDOMAt(element, layer + 1);
    }
  }

  getZoomInTheBody() {
    return () => {
      UI.updateControlTarget(this);
      UI.controlTargetDOMButton?.classList.remove("targeting");
      UI.controlTargetDOMButton = this.DOMButton;
      UI.controlTargetDOMButton.classList.add("targeting");

      if (this.type === "Star") {
        Ctrls.camera.position.set(0, 70000000, 0);
      } else {
        const camPos = new THREE.Vector3(...this.getPosition());
        const direction = camPos
          .clone()
          .normalize()
          .multiplyScalar(Math.max(this.bodyRadius, 600) * 3);
        camPos.sub(direction);
        Ctrls.camera.position.set(...camPos);
      }
      Ctrls.controls.target.set(...this.meshBody.position);

      Ctrls.controls.minDistance = Math.max(this.bodyRadius, 100) * 1.1;
    };
  }

  updateLabel() {
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
        labelEle.classList.add("hide");
      } else {
        labelEle.classList.remove("hide");
      }
    } else {
      const labelEle = this.label.element;
      labelEle.classList.remove("hide");
    }

    for (const childBody of this.childBodies) {
      childBody.updateLabel();
    }
  }
}
