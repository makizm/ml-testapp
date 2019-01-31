// import { DbClient } from '../../db';
const { DbClient } = require('../db');

const Device = /** @class */ (function () {
    function Device(deviceId) {
        this.deviceId = deviceId;
        this.db = new DbClient();
    }
    Device.prototype.getInfo = function (callback) {
        const _this = this;
        const deviceId = this.deviceId;
        const query = `SELECT created_on, last_accessed_on, uuid, description, location FROM public.wcs_devices WHERE device_id = '${deviceId}';`    
        _this.db.query(query, (error, result) => {
            if (error) {
                return callback(error, null);
            }
            if (result['rowCount'] !== 1) {
                return callback(new Error('Device not found'), null);
            }
            const device = result['rows'][0];
            callback(null, {
                id: deviceId,
                uuid: device['uuid'] || '',
                location: device['location'] || '',
                description: device['description'] || '',
                createdOn: new Date(device['created_on']),
                lastAccessedOn: new Date(device['last_accessed_on'])
            });
        })
    }
    Device.prototype.getSensors = function (callback) {
        const _this = this;
        const deviceId = this.deviceId;
        const query = `SELECT sensor_id, sensor_type, sensor_name, sensor_description, sensor_units FROM public.wcs_device_sensors WHERE device_id = '${deviceId}';`   
        _this.db.query(query, (error, result) => {
            if (error) {
                return callback(error, null);
            }
            if (result['rowCount'] === 0) {
                return callback(null, []);
            }
            const sensors = Array.from(result['rows'][0]);
            let newSensors = [];
            sensors.forEach(sensor => {
                newSensors.push({
                    id: sensor['sensor_id'],
                    type: sensor['sensor_type'],
                    name: sensor['sensor_name'],
                    description: sensor['sensor_description'],
                    units: sensor['sensor_units']
                })
            })
            return callback(null, newSensors);
        })
    }
    Device.prototype.getSensorById = function (sensorId, callback) {
        const _this = this;
        const query = `SELECT sensor_id, sensor_type, sensor_name, sensor_description, sensor_units FROM public.wcs_device_sensors WHERE sensor_id = '${sensorId}';`   
        _this.db.query(query, (error, result) => {
            if (error) {
                return callback(error, null);
            }
            if (result['rowCount'] !== 1) {
                return callback(new Error('Sensor not found'));
            }
            const sensor = result['rows'][0];
            const newSensor = {
                id: sensor['sensor_id'],
                type: sensor['sensor_type'],
                name: sensor['sensor_name'],
                description: sensor['sensor_description'],
                units: sensor['sensor_units']
            }
            return callback(null, newSensor);
        })
    }
    Device.prototype.updateSensorById = function (sensorId, property, value, callback) {
        const _this = this;
        let dbField = '';
        switch (property) {
            case 'type':
                dbField = 'sensor_type';
                break;
            case 'name':
                dbField = 'sensor_name';
                break;
            case 'description':
                dbField = 'sensor_description';
                break;
            case 'units':
                dbField = 'sensor_units';
                break;
            default:
                return callback(new Error(`Invalid sensor property ${property}`));
        }
        const query = `UPDATE public.wcs_sensors SET ${dbField} = '${value}' WHERE sensor_id = '${sensorId}';`   
        _this.db.query(query, (error, result) => {
            if (error) {
                return callback(error);
            }
            return callback(null);
        })
    }
    Device.prototype.getSensorValueById = function (sensorId, search, callback) {
        const _this = this;
        let query = `SELECT value, measured_on, sensor_id FROM public.wcs_sensors_data WHERE sensor_id = '${sensorId}' `;
        if (search['last']) {
            // last # of entries
            query = query + `LIMIT ${search.last} ORDER BY measured_on;`;
        } else if (search['days']) {
            // last # days
            query = query + `AND measured_on > current_date - interval '${search.days} day' ORDER BY measured_on;`;
        } else {
            // most recent value
            query = query + 'ORDER BY measured_on DESC LIMIT 1;';
        }
        _this.db.query(query, (error, result) => {
            if (error) {
                console.error(error);
                return callback(error, null);
            }
            const data = Array.from(result['rows']);
            let newData = [];
            data.forEach(item => {
                newData.push({
                    value: item['value'],
                    measuredOn: new Date(item['measured_on'])
                })
            })
            return callback(null, newData);
        })
    }
    Device.prototype.updateSensorValueById = function (sensorId, value, callback) {
        const _this = this;
        const timestamp = new Date(Date.now()).toISOString();
        const query = `INSERT INTO public.wcs_sensors_data(value, measured_on, sensor_id) VALUES('${value}','${timestamp}','${sensorId}');`   
        _this.db.query(query, (error, result) => {
            if (error) {
                console.error(error);
                return callback(error);
            }
            if (result['rowCount'] !== 1) {
                return callback(new Error('Sensor not found'));
            }
            return callback(null);
        })
    }
    Device.prototype.update = function (property, value, callback) {
        const _this = this;
        const deviceId = this.deviceId;
        let dbField = '';
        switch (property) {
            case 'uuid':
                dbField = 'uuid';
                break;
            case 'location':
                dbField = 'location';
                break;
            case 'description':
                dbField = 'description';
                break;
            case 'accessKey':
                dbField = 'access_key';
                break;
            default:
                return callback(new Error(`Invalid property ${property}`));
        }
        const query = `UPDATE public.wcs_devices SET ${dbField} = '${value}' WHERE device_id = '${deviceId}';`   
        _this.db.query(query, (error, result) => {
            if (error) {
                return callback(error);
            }
            return callback(null);
        })
    }
    return Device;
}());
exports.Device = Device;
