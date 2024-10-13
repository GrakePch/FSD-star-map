import DB from "./Database.js";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./Controls.js";
import { icon } from "../icons.js";
import { cartesianToLatLong, euclideanDist } from "../utils.js";
import UI from "./UI.js";

export default class Location {
  constructor(name, type, parentBody, parentStar, coordinatesRel, isPrivate, isQuantum, affiliation, themeImage, wikiLink) {
    this.name = name;
    this.type = type;
    this.parentBody = parentBody;
    this.parentStar = parentStar;
    this.coordinatesRel = coordinatesRel;
    this.isPrivate = isNaN(isPrivate) ? 0 : isPrivate;
    this.isQuantum = isNaN(isQuantum) ? 1 : isQuantum;
    this.affiliation = affiliation;
    this.themeImage = themeImage;
    this.wikiLink = wikiLink;

    const latLong = cartesianToLatLong(this.coordinatesRel.x, this.coordinatesRel.y, this.coordinatesRel.z)
    this.latitude = latLong.lat;
    this.longitude = latLong.long;
    this.distanceToParentCenter = null;
    this.altitude = null;
    this.isInOrbit = null;

    this.DOMLabelContainer = null;
    this.label = null;
    this.meshOrbit = null;
    this.meshElevationLine = null;

    DB.locations.push(this);
  }

  createLabel() {
    this.distanceToParentCenter = euclideanDist(this.coordinatesRel);
    this.altitude = this.distanceToParentCenter - this.parentBody.bodyRadius;
    this.isInOrbit = this.altitude > 100;

    const container = document.createElement("div");
    container.className = "label-location hide " + this.type.toLowerCase().split(" ").join("_");
    const labelEle = document.createElement("div");
    container.insertAdjacentElement("beforeend", labelEle);
    labelEle.className = "label";
    labelEle.textContent = this.name;
    this.DOMLabelContainer = container;
    container.addEventListener("pointerdown", this.getFuncUpdateLocationTarget());
    const markerEle = document.createElement("div");
    markerEle.className = "icon";
    container.insertAdjacentElement("beforeend", markerEle);

    if (this.type !== "Orbital marker") {
      container.classList.add(labelAppearances[this.type]?.size === "L" ? "large" : "medium");
    } else {
      container.classList.add("small")
    }
    let iconName = labelAppearances[this.type]?.icon || "circle_medium";
    markerEle.insertAdjacentElement("beforeend", icon(iconName));
    if (this.isPrivate) {
      markerEle.style.backgroundColor = "#f74a55";
    } else if (labelAppearances[this.type]?.color) {
      markerEle.style.backgroundColor = labelAppearances[this.type].color;
    }

    const labelObj = new CSS2DObject(container);
    labelObj.position.set(this.coordinatesRel.x, this.coordinatesRel.y, this.coordinatesRel.z);
    labelObj.center.set(0.5, 0.5);

    this.label = labelObj;
    this.parentBody.meshBody.add(this.label);

    if (this.isInOrbit && this.type !== "Orbital marker") {
      this.#createMeshOrbit();
    }
    if (this.isInOrbit || this.type === "Orbital marker") {
      this.#createElevationLine();
    }
  }

  getFuncUpdateLocationTarget() {
    return () => {
      UI.updateControlLocationTarget(this);
    };
  }

  showLabel(show) {
    if (show) {
      this.DOMLabelContainer.classList.remove("hide");
    } else {
      this.DOMLabelContainer.classList.add("hide");
    }
  }

  showOrbit(show) {
    if (this.meshOrbit) {
      this.meshOrbit.visible = show;
    }
  }

  showElevationLine(show) {
    if (this.meshElevationLine) {
      this.meshElevationLine.visible = show;
    }
  }

  checkIfAtFrontOfSphere() {
    const raycaster = new THREE.Raycaster();
    const pos = new THREE.Vector3();
    this.label.getWorldPosition(pos);
    if (this.distanceToParentCenter < this.parentBody.bodyRadius) {
      let parentPos = new THREE.Vector3();
      this.parentBody.meshBody.getWorldPosition(parentPos);
      pos.sub(parentPos).normalize();
      pos.multiplyScalar(this.parentBody.bodyRadius);
      pos.add(parentPos);
    }
    const dir = new THREE.Vector3().copy(pos).sub(Ctrls.camera.position).normalize().negate();
    raycaster.set(pos, dir);
    const intersects = raycaster.intersectObject(this.parentBody.meshBody, false);
    return intersects.length <= 0;
  }

  #createMeshOrbit() {
    let orbitalRadius = Math.sqrt(this.coordinatesRel.x ** 2 + this.coordinatesRel.z ** 2);
    const geoCircle = new THREE.CircleGeometry(orbitalRadius, 100);
    const itemSize = 3;
    geoCircle.setAttribute("position", new THREE.BufferAttribute(geoCircle.attributes.position.array.slice(itemSize, geoCircle.attributes.position.array.length - itemSize), itemSize));
    geoCircle.index = null;
    const matCircle = new THREE.LineBasicMaterial({ color: 0x808080 });
    const meshOrbit = new THREE.LineLoop(geoCircle, matCircle);
    meshOrbit.rotateX(Math.PI / 2);
    meshOrbit.position.set(0, this.coordinatesRel.y, 0);
    meshOrbit.visible = false;

    this.meshOrbit = meshOrbit;
    this.parentBody.meshBody.add(this.meshOrbit);
  }

  #createElevationLine() {
    const geomLine = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(
        this.coordinatesRel.x, 
        this.coordinatesRel.y, 
        this.coordinatesRel.z
      ), 
      new THREE.Vector3(0, 0, 0)
    ]);
    const matLine = new THREE.LineBasicMaterial({color: 0x808080});
    this.meshElevationLine = new THREE.Line(geomLine, matLine);
    this.meshElevationLine.visible = false;
    this.parentBody.meshBody.add(this.meshElevationLine);
  }
}

const labelAppearances = {
  "Landing zone": {
    icon: "landing_zone",
    size: "L",
    color: "#fbc02d",
  },
  "Space station": {
    icon: "space_station",
    size: "L",
    color: "#fbc02d",
  },
  "Asteroid base": {
    icon: "asteroid_base",
    size: "L",
    color: "#fbc02d",
  },
  Outpost: {
    size: "M",
    color: "#0597ff",
  },
  Scrapyard: {
    icon: "scrapyard",
    size: "M",
  },
  CommArray: {
    icon: "commarray",
    size: "M",
  },
  Racetrack: {
    icon: "racetrack",
    size: "M",
    color: "#b56aff",
  },
  "Emergency shelter": {
    icon: "emergency_shelter",
    size: "M",
    color: "#17a773",
  },
  Cave: {
    icon: "cave",
    size: "M",
  },
  "Distribution center": {
    icon: "distribution_center",
    size: "M",
    color: "#0597ff",
  },
  Settlement: {
    icon: "settlement",
    size: "M",
  },
  Landmark: {
    icon: "landmark",
    size: "M",
    color: "#b56aff",
  },
  Shipwreck: {
    icon: "landmark",
    size: "M",
    color: "#b56aff",
  },
  "Underground bunker": {
    icon: "underground_bunker",
    size: "M",
  },
  Ruins: {
    size: "M",
    color: "#9aa0a6",
  },
  Prison: {
    icon: "prison",
    size: "M",
    color: "#ff8126",
  },
  City: {
    size: "M",
    color: "#0597ff",
  },
};
