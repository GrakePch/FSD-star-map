import { euclideanDist, getBodyByName } from "../utils.js";
import CelestialBody from "./CelestialBody.js";
import Location from "./Location.js";

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
    await Database.createLocations();
  }

  static async createCelestialBodies() {
    const bodies = await Database.fetchCSV("/public/data/bodies.csv");

    // Create Celestial Bodies
    for (const data of bodies) {
      new CelestialBody(
        data.name,
        data.type,
        data.ordinal,
        data.parentBody,
        data.parentStar,
        {
          x: -parseFloat(data.coordinateX),
          y: parseFloat(data.coordinateZ),
          z: parseFloat(data.coordinateY),
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
        parseFloat(data.ringRadiusInner),
        parseFloat(data.ringRadiusOuter),
        data.themeColorR
          ? {
              r: parseFloat(data.themeColorR),
              g: parseFloat(data.themeColorG),
              b: parseFloat(data.themeColorB),
            }
          : null,
        data.themeImage
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
        parentBody.childBodies.push(body);
      }
    }

    // Compute Orbital Radius
    for (const body of DB.bodies) {
      body.orbitalRadius = euclideanDist(body.coordinates);
      if (body.type === "Moon") {
        body.orbitalRadius = euclideanDist(body.coordinates, body.parentBody.coordinates);
      }
    }

    // Sort children
    for (const body of DB.bodies) {
      if (body.childBodies) {
        body.childBodies.sort((a, b) => (b.ordinal === "" ? (a.ordinal === "" ? 0 : -1) : a.ordinal === "" ? 1 : a.ordinal?.localeCompare(b.ordinal)));
      }
    }
  }

  static async createLocations() {
    const locations = await Database.fetchCSV("/public/data/locations.csv");

    for (const data of locations) {
      new Location(
        data.name,
        data.type,
        data.parentBody,
        data.parentStar,
        {
          x: -parseFloat(data.coordinateX),
          y: parseFloat(data.coordinateZ),
          z: parseFloat(data.coordinateY),
        },
        parseInt(data.private),
        parseInt(data.quantum),
        data.affiliation,
        data.themeImage,
        data.wikiLink
      );
    }

    // Link CB object to location
    // Push Locations to Celestial Bodies
    for (const location of DB.locations) {
      location.parentStar = getBodyByName(location.parentStar);
      let parentBody = getBodyByName(location.parentBody);
      location.parentBody = parentBody;
      if (parentBody) {
        parentBody.locations.push(location);
      }
    }
  }
}

const DB = new Database();
export default DB;
