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
  const hourNumber = Math.floor(hours);
  const remainMinutes = (hours - hourNumber) * 60;
  const minuteNumber = Math.floor(remainMinutes);
  const remainSeconds = (remainMinutes - minuteNumber) * 60;
  const secondNumber = Math.round(remainSeconds);
  return `${hourNumber}:${minuteNumber.toString().padStart(2, "0")}:${secondNumber.toString().padStart(2, "0")}`;
}
