import DB from "./classes/Database.js";

export function getBodyByName(name) {
  if (!name) return null;
  for (const body of DB.bodies) if (body.name === name) return body;
  return null;
}

export function euclideanDist(d1, d2) {
  if (!d2) d2 = { x: 0, y: 0, z: 0 };
  return Math.sqrt((d1.x - d2.x) ** 2 + (d1.y - d2.y) ** 2 + (d1.z - d2.z) ** 2);
}

export function getLocationByName(name) {
    if (!name) return null;
    for (const location of DB.locations) if (location.name === name) return location;
    return null;
  }
