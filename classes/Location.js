import DB from "./Database.js";
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./Controls.js";

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
    container.insertAdjacentElement("beforeend", markerEle);
    const labelObj = new CSS2DObject(container);
    labelObj.position.set(this.coordinatesRel.x, this.coordinatesRel.y, this.coordinatesRel.z);
    labelObj.center.set(0.5, 1.5);

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
    let updatedNormal = this.label.parent.localToWorld(this.label.position.clone());
    updatedNormal.sub(this.label.parent.position)
    let cameraPos = Ctrls.camera.position.clone();
    let controlTargetPos = Ctrls.controls.target.clone();
    let cameraVec = new THREE.Vector3();
    cameraVec.subVectors(cameraPos, controlTargetPos);
    let locationToCamVec = cameraVec.clone().sub(updatedNormal);
    let angleRad = updatedNormal.angleTo(locationToCamVec);
    return angleRad < Math.PI / 2;
  }
}
