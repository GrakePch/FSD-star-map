import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Controls {
  constructor() {
    if (Controls.instance) return Controls.instance;
    Controls.instance = this;
  }

  init(camera, domElement) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, domElement);
    // this.controls.enablePan = false;
    this.controls.maxDistance = 200000000;
  }

  update() {
    this.controls.update();
  }
}

const Ctrls = new Controls();

export default Ctrls;

