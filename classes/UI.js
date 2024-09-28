class UserInterface {
  constructor() {
    if (UserInterface.instance) return UserInterface.instance;
    UserInterface.instance = this;

    this.controlTarget = null;
    this.controlTargetDOMButton = null;
  }

  updateControlTarget(cbody) {
    this.controlTarget = cbody;
    document.getElementById("targeting-body").innerHTML = cbody.name;
  }
}

const UI = new UserInterface();

export default UI;
