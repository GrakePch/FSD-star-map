import * as THREE from "three";
import DB from "./classes/Database.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./classes/Controls.js";
import { euclideanDist, getBodyByName, getLocationByName } from "./utils.js";
import UI from "./classes/UI.js";

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000000000);

const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = "absolute";
cssRenderer.domElement.style.top = "0px";
document.body.appendChild(cssRenderer.domElement);

Ctrls.init(camera, cssRenderer.domElement);
const controls = Ctrls.controls;

// Draw the ecliptic plane
// const geoCircle = new THREE.CircleGeometry(100000000, 100);
// const matCircle = new THREE.MeshBasicMaterial({ color: 0x111122, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
// const zeroLevel = new THREE.Mesh(geoCircle, matCircle);
// zeroLevel.rotateX(Math.PI / 2);
// scene.add(zeroLevel);

camera.position.set(0, 70000000, 0);
controls.update();

var rootBody = null;
async function init() {
  await DB.createDatabase();

  window.addEventListener("resize", onWindowResize);

  rootBody = getBodyByName("Stanton");
  console.log(rootBody);
  rootBody.createMesh();
  rootBody.createChildrenMesh();
  rootBody.addToScene(scene);

  rootBody.createNavDOMAt(document.querySelector("#nav-panel"), 0);
}
init();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  if (getBodyByName("Hurston")) {
    getBodyByName("Hurston").meshBody?.rotateY(0.01);
  }

  if (rootBody) {
    rootBody.updateLabel();
  }
  if (UI.controlTarget) {
    UI.controlTarget.updateLocationVisibility();
  }

  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
