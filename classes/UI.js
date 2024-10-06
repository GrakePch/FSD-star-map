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
    if (!cbody) {
      document.getElementById("target-panel").classList.add("hide");
    } else {
      document.getElementById("target-panel").classList.remove("hide");
      this.controlTarget = cbody;
      document.getElementById("target-image").style.backgroundImage = `url(${cbody.themeImage})`;
      document.getElementById("target-name").innerHTML = cbody.name;
      document.getElementById("target-type").innerHTML = cbody.parentBody ? `${cbody.type} of ${cbody.parentBody.name}` : cbody.type;
      document.getElementById("target-radius").innerHTML = cbody.bodyRadius?.toFixed(0) + " km";
      document.getElementById("target-length-of-day").innerHTML = cbody.rotationRate + " h";
      document.getElementById("target-hour-angle").innerHTML = (cbody.rotationRate ? (360 / cbody.rotationRate)?.toFixed(2) : 0) + "°";
      document.getElementById("target-orbital-radius").innerHTML = `≈${(cbody.orbitalRadius / 1000)?.toFixed(0)} Mm`;
      document.getElementById("target-orbital-inclination").innerHTML = cbody.orbitalInclination?.toFixed(0) + "°";
    }
  }

  getControlTarget() {
    return this.controlTarget;
  }
}

const UI = new UserInterface();

export default UI;
