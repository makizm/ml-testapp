const { DbClient } = require('../../db');

const DeviceUpdateAccessed = function(deviceId, callback) {
    const timeStamp = new Date(Date.now()).toISOString();
    const dbClient = new DbClient();
    const query = `UPDATE public.wcs_devices SET last_accessed_on = '${timeStamp}' WHERE device_id = '${deviceId}';`
    dbClient.query(query, (error) => {
        callback(error);
    })
}

module.exports = DeviceUpdateAccessed;
