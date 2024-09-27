import DB from "./Database.js";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./Controls.js";
import { euclideanDist } from "../utils.js";

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

    if (this.type === "Star") {
      this.meshBody = this.#createMeshSphere(this.getPosition(), this.bodyRadius, 0xffffaa, 0xffffaa);
      this.meshGroup.attach(this.meshBody);

      const light = new THREE.PointLight(0xffffff, 5, 0, 0);
      this.meshBody.add(light);
    } else if (this.type === "Planet") {
      const color = `rgb(${this.themeColor.r}, ${this.themeColor.g}, ${this.themeColor.b})`;

      this.#loadMaps();

      this.meshBody = this.#createMeshSphere(this.getPosition(), this.bodyRadius, color);
      this.meshGroup.attach(this.meshBody);

      this.meshOrbit = this.#createMeshOrbit([0, 0, 0], this.orbitalRadius, color);
      this.meshGroup.attach(this.meshOrbit);
    } else if (this.type === "Moon") {
      this.meshBody = this.#createMeshSphere(this.getPosition(), this.bodyRadius, 0x222222);
      this.meshGroup.attach(this.meshBody);

      this.#loadMaps();

      this.meshOrbit = this.#createMeshOrbit(this.parentBody.getPosition(), this.orbitalRadius, 0x222222);
      this.meshGroup.attach(this.meshOrbit);
    } else if (this.type === "Jump Point") {
      this.meshBody = new THREE.Object3D();
      this.meshBody.position.set(...this.getPosition());
      this.meshGroup.attach(this.meshBody);

      this.meshOrbit = this.#createMeshOrbit([0, 0, 0], this.orbitalRadius, 0x404040);
      this.meshGroup.attach(this.meshOrbit);
    } else {
      this.meshBody = new THREE.Object3D();
      this.meshBody.position.set(...this.getPosition());
      this.meshGroup.attach(this.meshBody);
    }

    this.label = this.#createLabel();
    this.meshBody.add(this.label);

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
    
    if (this.orbitalInclination != 0) {
      let rotAxis = new THREE.Vector3(this.coordinates.x, this.coordinates.y, this.coordinates.z);
      rotAxis.cross(new THREE.Vector3(0, this.coordinates.y, 0)).normalize();
      meshOrbit.rotateOnWorldAxis(rotAxis, (this.coordinates.y > 0 ? 1 : -1) * THREE.MathUtils.degToRad(this.orbitalInclination));
    }

    return meshOrbit;
  }

  #createLabel() {
    const element = document.createElement("div");
    element.textContent = this.name;
    element.className = "label";
    element.addEventListener("pointerdown", () => {
      Ctrls.controls.target = this.meshBody.position.clone();
    });
    const labelObj = new CSS2DObject(element);
    labelObj.position.set(0, this.bodyRadius * 1.5, 0);
    labelObj.center.set(0.5, 1);
    return labelObj;
  }

  #createElevationLine() {
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -this.coordinates.y, 0)];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0x222222 });
    const elevationLine = new THREE.Line(geometry, material);
    this.meshBody.add(elevationLine);
  }

  #loadMaps() {
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
}
