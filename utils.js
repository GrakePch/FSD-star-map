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

export function getRealTime() {
  return new Date();
}

export function getNumDaysSinceAnchor() {
  const anchor = new Date("2020-01-01T00:00:00.000Z");
  const now = getRealTime();
  const timeSinceAnchor = now - anchor;
  return timeSinceAnchor / 1000 / 60 / 60 / 24;
}

export function modulo(dividend, divisor) {
  return ((dividend % divisor) + divisor) % divisor;
}

export function formatTime(hours) {
  if (hours === Infinity) return "Infinity";
  if (hours === -Infinity) return "Infinity";
  const hourNumber = Math.floor(hours);
  const remainMinutes = (hours - hourNumber) * 60;
  const minuteNumber = Math.floor(remainMinutes);
  const remainSeconds = (remainMinutes - minuteNumber) * 60;
  const secondNumber = Math.round(remainSeconds);
  return `${hourNumber}:${minuteNumber.toString().padStart(2, "0")}:${secondNumber.toString().padStart(2, "0")}`;
}

export function cartesianToSpherical(x, y, z) {
  const r = Math.sqrt(x * x + y * y + z * z);
  const theta = Math.atan2(z, x); // azimuthal angle: randian in the xz-plane from the positive x
  const phi = Math.acos(y / r); // polar angle: radian from the positive y
  return { r: r, theta: theta, phi: phi };
}

/* Spherical to Latitude-longitude coordinates centered at OM-5 */
export function sphericalToLatLong(theta, phi) {
  const latitude = Math.PI / 2 - phi;
  let longitude = Math.PI - theta;
  if (longitude > Math.PI) {
    longitude -= Math.PI * 2;
  }
  return { lat: radToDeg(latitude), long: radToDeg(longitude) };
}

export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

export function formatAngle(degrees) {
  const isNeg = degrees < 0;
  degrees = isNeg ? -degrees : degrees;
  const degreeNumber = Math.floor(degrees);
  const remainMinutes = (degrees - degreeNumber) * 60;
  const minuteNumber = Math.floor(remainMinutes);
  const remainSeconds = (remainMinutes - minuteNumber) * 60;
  const secondNumber = Math.round(remainSeconds);
  return `${isNeg ? "-" : ""}${degreeNumber}° ${minuteNumber.toString().padStart(2, "0")}' ${secondNumber.toString().padStart(2, "0")}"`;
}

export function cartesianToLatLong(x, y, z) {
  const sph = cartesianToSpherical(x, y, z);
  return sphericalToLatLong(sph.theta, sph.phi);
}

export function formatLatitude(degree) {
  return degree === 0 ? formatAngle(degree) : degree > 0 ? formatAngle(degree) + " N" : formatAngle(-degree) + " S";
}

export function formatLongitude(degree) {
  return degree === 0 ? formatAngle(degree) : degree > 0 ? formatAngle(degree) + " E" : formatAngle(-degree) + " W";
}
