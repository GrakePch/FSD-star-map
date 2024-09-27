import DB from "./Database.js";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./Controls.js";

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

    DB.bodies.push(this);
  }

  createMesh() {
    this.meshGroup = new THREE.Group();

    if (this.type === "Star") {
      this.meshBody = this.#createMeshSphere(this.getPosition(), this.bodyRadius, 0xffffaa, 0xffffaa);
      this.meshGroup.add(this.meshBody);

      const light = new THREE.PointLight(0xffffff, 5, 0, 0);
      this.meshBody.add(light);
    }
    if (this.type === "Planet") {
      const color = `rgb(${this.themeColor.r}, ${this.themeColor.g}, ${this.themeColor.b})`;
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

      this.meshBody = this.#createMeshSphere(this.getPosition(), this.bodyRadius, color);
      this.meshGroup.add(this.meshBody);

      this.meshOrbit = this.#createMeshOrbit([0, 0, 0], this.orbitalRadius, color);
      this.meshGroup.add(this.meshOrbit);

      const element = document.createElement("div");
      element.textContent = this.name;
      element.className = "label";
      element.addEventListener("pointerdown", () => {
        console.log(this.name);
        console.log(Ctrls.controls.target = this.meshBody.position)
      });
      this.label = new CSS2DObject(element);
      this.label.position.set(0, this.bodyRadius * 1.5, 0);
      this.label.center.set(0.5, 1);
      this.meshBody.add(this.label);
    }
    if (this.type === "Moon") {
      this.meshBody = this.#createMeshSphere(this.getPosition(), this.bodyRadius, 0x222222);
      this.meshGroup.add(this.meshBody);

      this.meshOrbit = this.#createMeshOrbit(this.parentBody.getPosition(), this.orbitalRadius, 0x222222);
      this.meshGroup.add(this.meshOrbit);
    }

    if (this.parentBody) {
      this.parentBody.meshGroup.add(this.meshGroup);
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

  #createMeshSphere(position, radius, color, emissive) {
    const geometry = new THREE.SphereGeometry(radius, 32, 16);
    const material = new THREE.MeshStandardMaterial({ color: color, emissive: emissive ? emissive : null });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(...position);
    return sphere;
  }

  #createMeshOrbit(position, radius, color) {
    const geoCircle = new THREE.CircleGeometry(radius, 2000);
    const itemSize = 3;
    geoCircle.setAttribute("position", new THREE.BufferAttribute(geoCircle.attributes.position.array.slice(itemSize, geoCircle.attributes.position.array.length - itemSize), itemSize));
    geoCircle.index = null;
    const matCircle = new THREE.LineBasicMaterial({ color: color });
    const meshOrbit = new THREE.LineLoop(geoCircle, matCircle);
    meshOrbit.rotateX(Math.PI / 2);
    meshOrbit.position.set(...position);
    return meshOrbit;
  }
}
