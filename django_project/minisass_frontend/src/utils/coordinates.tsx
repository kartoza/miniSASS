/** Degree to DMS **/
export function toDegreesMinutesAndSeconds(coordinate) {
  let absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutes = 0 | (((absolute += 1e-9) % 1) * 60)
  const seconds = (0 | (((absolute * 60) % 1) * 6000)) / 100

  return { degrees, minutes, seconds }
}

/*** Convert latitude to dms */
export function convertToDMSLatitude(val) {
  const { degrees, minutes, seconds } = toDegreesMinutesAndSeconds(val);
  const cardinal = val >= 0 ? "N" : "S";
  const adjustedDegrees = cardinal === 'S' ? -degrees : degrees;
  return { adjustedDegrees, minutes, seconds, cardinal }
}

/*** Convert longitude to dms */
export function convertToDMSLongitude(val) {
  const { degrees, minutes, seconds } = toDegreesMinutesAndSeconds(val);
  const cardinal = val >= 0 ? "E" : "W";

  return { degrees, minutes, seconds, cardinal }
}

/** DMS to degree **/
function toDegree(degrees, minutes, seconds) {
  return degrees + (minutes / 60) + (seconds / 3600)
}

/*** Convert dms to latitude */
export function convertDmsToLatitude(degrees, minutes, seconds, cardinal) {
  const DD = toDegree(degrees, minutes, seconds)
  return cardinal === "N" ? DD : -1 * DD
}

/*** Convert dms to latitude */
export function convertDmsToLongitude(degrees, minutes, seconds, cardinal) {
  const DD = toDegree(degrees, minutes, seconds)
  return cardinal === "E" ? DD : -1 * DD
}