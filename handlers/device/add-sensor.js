const { DbClient } = require('../../db');

const Sensor = function() {
    this.type = '';
    this.name = '';
    this.description = '';
    this.units = '';
    this.deviceId = '';
}

/**
 * 
 * @param {*} deviceId 
 * @param {Sensor} sensor 
 * @param {Function} callback 
 */
const DeviceAddSensor = function(sensor, callback) {
    const dbClient = new DbClient();
    const query = `INSERT INTO public.wcs_sensors(sensor_type, sensor_name, sensor_description, sensor_units, device_id)
    VALUES ('${sensor.type}','${sensor.name}','${sensor.description}','${sensor.units}','${sensor.deviceId}');`
    dbClient.query(query, (error) => {
        callback(error);
    })
}

module.exports = DeviceAddSensor;
