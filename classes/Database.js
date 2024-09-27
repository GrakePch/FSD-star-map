import { euclideanDist, getBodyByName } from "../utils.js";
import CelestialBody from "./CelestialBody.js";

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    Database.instance = this;

    this.systems = Array();
    this.stars = Array();
    this.bodies = Array();
    this.locations = Array();
    this.wormholes = Array();
  }

  static async fetchCSV(url) {
    let csvStr = null;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching CSV:\nURL: ${url}\nStatus: ${response.status}`);
      }
      csvStr = await response.text();
    } catch (err) {
      throw new Error(`Error fetching CSV:\n${err}`);
    }

    const data = Database.#parseCSV(csvStr);
    return data;
  }

  static #parseCSV(csvStr) {
    const lines = csvStr.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());
    const data = [];

    for (let l = 1; l < lines.length; ++l) {
      const values = lines[l].split(",").map((value) => value.trim());
      const obj = {};

      for (let i = 0; i < headers.length; ++i) {
        obj[headers[i]] = values[i];
      }
      data.push(obj);
    }

    return data;
  }

  async createDatabase() {
    await Database.createCelestialBodies();
  }

  static async createCelestialBodies() {
    const bodies = await Database.fetchCSV("/public/data/bodies.csv");

    // Create Celestial Bodies
    for (const data of bodies) {
      let cb = new CelestialBody(
        data.name,
        data.type,
        data.ordinal,
        data.parentBody,
        data.parentStar,
        {
          x: parseFloat(data.coordinateX),
          y: parseFloat(data.coordinateZ),
          z: parseFloat(-data.coordinateY),
        },
        {
          w: parseFloat(data.quaternionW),
          x: parseFloat(data.quaternionX),
          y: parseFloat(data.quaternionY),
          z: parseFloat(data.quaternionZ),
        },
        parseFloat(data.bodyRadius),
        parseFloat(data.rotationRate),
        parseFloat(data.rotationCorrection),
        parseFloat(data.orbitAngle),
        parseFloat(data.orbitRadius),
        data.themeColorR
          ? {
              r: parseFloat(data.themeColorR),
              g: parseFloat(data.themeColorG),
              b: parseFloat(data.themeColorB),
            }
          : null
      );
    }

    // Link Parent Body Object to child
    // Link Child Bodies Objects to parent
    for (const body of DB.bodies) {
      let parentStar = getBodyByName(body.parentStar);
      body.parentStar = parentStar;
      let parentBody = getBodyByName(body.parentBody);
      body.parentBody = parentBody;
      if (parentBody) {
        if (!parentBody.childBodies) parentBody.childBodies = Array();
        parentBody.childBodies.push(body);
      }
    }

    // Compute Orbital Radius
    for (const body of DB.bodies)
      if (isNaN(body.orbitRadius)) {
        if (body.type === "Jump Point") {
          body.orbitalRadius = euclideanDist(body.coordinates, body.parentBody.coordinates);
        }
        if (body.type === "Lagrange Point") {
          body.orbitalRadius = euclideanDist(body.coordinates);
        }
      }

    // Sort children
    for (const body of DB.bodies) {
      if (body.childBodies) {
        body.childBodies.sort((a, b) => (b.ordinal === "" ? (a.ordinal === "" ? 0 : -1) : a.ordinal === "" ? 1 : a.ordinal?.localeCompare(b.ordinal)));
      }
    }
  }
}

const DB = new Database();
export default DB;
