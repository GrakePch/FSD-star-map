import * as THREE from "three";
import DB from "./classes/Database.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import Ctrls from "./classes/Controls.js";
import { getBodyByName } from "./utils.js";
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

camera.position.set(0, 70000000, -50000000);
controls.update();

/* Ambient light */
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

var rootBody = null;
async function init() {
  await DB.createDatabase();

  window.addEventListener("resize", onWindowResize);

  rootBody = getBodyByName("Stanton");
  console.log(rootBody);
  rootBody.createMesh();
  rootBody.createChildrenMesh();
  rootBody.addToScene(scene);
  await rootBody.updateMapsRecur(false);

  rootBody.createNavDOMAt(document.querySelector("#nav-panel"), 0);

  // 调用 showCoordinatesOnHover 方法
  rootBody.showCoordinatesOnHover();

  document.getElementById("load-HD-textures").addEventListener("change", async (e) => {
    await rootBody.updateMapsRecur(e.target.checked);
  });
}
init();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  if (rootBody) {
    rootBody.updateRotationRecur();
    rootBody.updateLabel();

    if (UI.controlTarget && controls.getDistance() < Math.max(UI.controlTarget.bodyRadius * 5, 1000)) {
      ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, 0.5, 0.1);
      rootBody.lightSource.intensity = THREE.MathUtils.lerp(rootBody.lightSource.intensity, 3, 0.1);
    } else {
      ambientLight.intensity = THREE.MathUtils.lerp(ambientLight.intensity, 0, 0.1);
      rootBody.lightSource.intensity = THREE.MathUtils.lerp(rootBody.lightSource.intensity, 5, 0.1);
    }
  }
  if (renderer.info.render.frame % 2 === 0 && UI.controlTarget) {
    UI.controlTarget.updateLocationVisibility();
  }
  if (renderer.info.render.frame % 2 === 0 && UI.controlLocationTarget) {
    const lat = UI.controlLocationTarget.latitude;
    const long = UI.controlLocationTarget.longitude;
    const e = UI.controlLocationTarget.parentBody.getAllSunRelatedEvents(lat, long);

    document.getElementById("analog-clock").style.setProperty("--sunrise-hour-angle", e.sunriseHourAngle + "deg");
    document.getElementById("analog-clock").style.setProperty("--hand-direction", e.dayProgressDegree + "deg");

    document.getElementById("location-target-day-progress").innerHTML = e.dayProgress + "%";
    document.getElementById("location-target-solar-altitude-angle").innerHTML = e.solarAltitudeDegree + "°";
    document.getElementById("location-target-daylight-duration").innerHTML = e.daytimeDuration;
    document.getElementById("location-target-night-duration").innerHTML = e.nighttimeDuration;
    if (e.polarDayOrNight) {
      document.getElementById("location-target-polar-day-or-night-container").classList.remove("display-none");
      document.getElementById("location-target-polar-day-or-night").innerHTML = e.polarDayOrNight;
    } else {
      document.getElementById("location-target-polar-day-or-night-container").classList.add("display-none");
    }

    document.getElementById("location-target-next-sunrise").innerHTML = "T\u2212" + e.timeUntilSunrise;
    document.getElementById("location-target-next-noon").innerHTML = "T\u2212" + e.timeUntilNoon;
    document.getElementById("location-target-next-sunset").innerHTML = "T\u2212" + e.timeUntilSunset;
    document.getElementById("location-target-next-midnight").innerHTML = "T\u2212" + e.timeUntilMidnight;

    document.getElementById("location-target-last-sunrise").innerHTML = "T+" + e.timeAfterSunrise;
    document.getElementById("location-target-last-noon").innerHTML = "T+" + e.timeAfterNoon;
    document.getElementById("location-target-last-sunset").innerHTML = "T+" + e.timeAfterSunset;
    document.getElementById("location-target-last-midnight").innerHTML = "T+" + e.timeAfterMidnight;
  }

  controls.update();
  renderer.render(scene, camera);

  if (renderer.info.render.frame % 2 === 0) {
    cssRenderer.render(scene, camera);
  }
}

renderer.setAnimationLoop(animate);
