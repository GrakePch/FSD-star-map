import { cartesianToFormatLatLong, formatTime } from "../utils.js";

class UserInterface {
  constructor() {
    if (UserInterface.instance) return UserInterface.instance;
    UserInterface.instance = this;

    this.controlTarget = null;
    this.controlTargetDOMButton = null;
    this.controlLocationTarget = null;
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
      this.controlTarget.showLocationsOrbit(false);
      this.controlTarget.showLocationsElevationLine(false);
    }
    if (this.controlLocationTarget) {
      this.controlLocationTarget = null;
      document.getElementById("location-target-panel").classList.add("hide");
    }
    this.controlTarget = cbody;
    if (!cbody) {
      document.getElementById("target-panel").classList.add("hide");
    } else {
      document.getElementById("target-panel").classList.remove("hide");
      document.getElementById("target-image").style.backgroundImage = `url(${cbody.themeImage})`;
      document.getElementById("target-name").innerHTML = cbody.name;
      document.getElementById("target-type").innerHTML = cbody.parentBody ? `${cbody.type} of ${cbody.parentBody.name}` : cbody.type;
      document.getElementById("target-radius").innerHTML = cbody.bodyRadius?.toFixed(0) + " km";
      document.getElementById("target-length-of-day").innerHTML = formatTime(cbody.lengthOfDay);
      document.getElementById("target-hour-angle").innerHTML = (cbody.lengthOfDay ? (360 / cbody.lengthOfDay)?.toFixed(2) : 0) + "°";
      document.getElementById("target-orbital-radius").innerHTML = `≈${(cbody.orbitalRadius / 1000)?.toFixed(0)} Mm`;
      document.getElementById("target-orbital-inclination").innerHTML = cbody.orbitalInclination?.toFixed(0) + "°";
    }
  }

  updateControlLocationTarget(location) {
    document.getElementById("target-panel").classList.add("hide");
    this.controlTarget = location?.parentBody;
    this.controlLocationTarget = location;
    if (!location) {
      document.getElementById("location-target-panel").classList.add("hide");
    } else {
      document.getElementById("location-target-panel").classList.remove("hide");
      document.getElementById("location-target-image").style.backgroundImage = `url(${location.themeImage})`;
      document.getElementById("location-target-name").innerHTML = location.name;
      document.getElementById("location-target-type").innerHTML = location.parentBody ? `${location.type} of ${location.parentBody.name}` : location.type;
      document.getElementById("location-target-is-quantum").innerHTML = location.isQuantum ? "Yes" : "No";
      document.getElementById("location-target-is-private").innerHTML = location.isPrivate ? "Yes" : "No";
      document.getElementById("location-target-affiliation").innerHTML = location.affiliation || "-";
      document.getElementById("location-target-altitude").innerHTML = location.parentBody ? ((location.distanceToParentCenter - location.parentBody.bodyRadius) * 1000).toFixed(0) + " m" : "N/A";

      const latLong = cartesianToFormatLatLong(location.coordinatesRel.x, location.coordinatesRel.y, location.coordinatesRel.z);
      document.getElementById("location-target-latitude").innerHTML = latLong.lat;
      document.getElementById("location-target-longitude").innerHTML = latLong.long;
    }
  }

  getControlTarget() {
    return this.controlTarget;
  }
}

const UI = new UserInterface();

export default UI;
