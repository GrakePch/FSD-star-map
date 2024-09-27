import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import DB from "./classes/Database.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000000000);
const controls = new OrbitControls(camera, renderer.domElement);

const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = "absolute";
cssRenderer.domElement.style.top = "0px";
cssRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(cssRenderer.domElement);

const geoCircle = new THREE.CircleGeometry(100000000, 100);
const matCircle = new THREE.MeshBasicMaterial({ color: 0x111122, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
const zeroLevel = new THREE.Mesh(geoCircle, matCircle);
zeroLevel.rotateX(Math.PI / 2);
scene.add(zeroLevel);

camera.position.set(0, 20, 100);
controls.update();

async function init() {
  await DB.createDatabase();
  console.log(DB.bodies[0]);

  window.addEventListener("resize", onWindowResize);
  DB.bodies[0].createMesh();
  DB.bodies[0].createChildrenMesh();
  DB.bodies[0].addToScene(scene);
  // DB.bodies[0].addChildrenToScene(scene);
  camera.position.set(DB.bodies[0].bodyRadius, 20, 100);

  controls.target = DB.bodies[3].meshBody.position.clone();

}
init();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // console.log(camera.position)
  if (DB.bodies[0]) {
    // DB.bodies[0].meshGroup.rotation.x += 0.01;
  }
  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
