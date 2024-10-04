class UserInterface {
  constructor() {
    if (UserInterface.instance) return UserInterface.instance;
    UserInterface.instance = this;

    this.controlTarget = null;
    this.controlTargetDOMButton = null;
    this.celestialBodies = []; // 初始化 celestialBodies 数组
  }

  addCelestialBody(body) {
    this.celestialBodies.push(body);
  }

  getAllCelestialBodies() {
    return this.celestialBodies;
  }

  updateControlTarget(cbody) {
    if (this.controlTarget) {
      this.controlTarget.showLocations(false);
    }
    this.controlTarget = cbody;
    document.getElementById("targeting-body").innerHTML = cbody.name;
  }

  getControlTarget() {
    return this.controlTarget;
  }
}

const UI = new UserInterface();

export default UI;