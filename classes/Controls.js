import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Controls {
  constructor() {
    if (Controls.instance) return Controls.instance;
    Controls.instance = this;
  }

  init(camera, domElement) {
    this.controls = new OrbitControls(camera, domElement);
  }

  update() {
    this.controls.update();
  }
}

const Ctrls = new Controls();

export default Ctrls;

