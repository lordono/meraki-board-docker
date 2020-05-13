/**
 * Find the name of the device given its serial number. If not found, serial is returned
 * @param {string} serial Serial No. of Device
 * @param {array} devices Array of devices to check against
 */
export const findNameForSerial = (serial, devices) => {
  let name = serial;
  devices.forEach((element) => {
    if (element.serial === serial && element.name) name = element.name;
  });
  return name;
};
