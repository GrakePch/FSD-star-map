import DB from "./Database.js";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./Controls.js";
import { icon } from "../icons.js";

export default class Location {
  constructor(name, type, parentBody, parentStar, coordinatesRel, isPrivate, isQuantum, affiliation, themeImage, wikiLink) {
    this.name = name;
    this.type = type;
    this.parentBody = parentBody;
    this.parentStar = parentStar;
    this.coordinatesRel = coordinatesRel;
    this.isPrivate = isPrivate;
    this.isQuantum = isQuantum;
    this.affiliation = affiliation;
    this.themeImage = themeImage;
    this.wikiLink = wikiLink;

    DB.locations.push(this);
  }

  createLabel() {
    const container = document.createElement("div");
    container.className = "label-location hide " + this.type.toLowerCase().split(" ").join("_");
    const labelEle = document.createElement("div");
    container.insertAdjacentElement("beforeend", labelEle);
    labelEle.className = "label";
    labelEle.textContent = this.name;
    this.DOMLabelContainer = container;
    // element.addEventListener()
    const markerEle = document.createElement("div");
    markerEle.className = "icon";
    container.insertAdjacentElement("beforeend", markerEle);

    if (["Landing zone", "Space station"].includes(this.type)) {
      container.className += " large";
      markerEle.insertAdjacentElement("beforeend", icon(this.type.split(" ").join("_")));
    }

    const labelObj = new CSS2DObject(container);
    labelObj.position.set(this.coordinatesRel.x, this.coordinatesRel.y, this.coordinatesRel.z);
    labelObj.center.set(0.5, 0.5);

    this.label = labelObj;
    this.parentBody.meshBody.add(this.label);
  }

  showLabel(show) {
    if (show) {
      this.DOMLabelContainer.classList.remove("hide");
    } else {
      this.DOMLabelContainer.classList.add("hide");
    }
  }

  checkIfAtFrontOfSphere() {
    const raycaster = new THREE.Raycaster();
    const pos = new THREE.Vector3();
    this.label.getWorldPosition(pos);
    const dir = new THREE.Vector3().copy(pos).sub(Ctrls.camera.position).normalize().negate();
    raycaster.set(pos, dir);
    const intersects = raycaster.intersectObject(this.parentBody.meshBody, false);
    return intersects.length <= 0;
  }
}
