const { DbClient } = require('../../db');
const deviceUpdateAccessed = require('./update-last-access');

const DeviceValidate = function(req, res, next) {
    // device id param must be present
    if (!req.params) {
        console.error('400 Invalid request');
        return res.sendStatus(400);
    }
    const deviceUuid = req.params['id'] + '' || '';
    if (!deviceUuid) {
        console.error('400 Invalid request');
        return res.sendStatus(400);
    }
    // auth validation
    const auth = req.headers['authorization'] + '' || '';
    if (!auth) {
        console.error('401 Invalid auth');
        return res.sendStatus(401);
    }
    if (!auth.startsWith('Bearer')) {
        console.error('401 Invalid auth type');
        return res.sendStatus(401);
    }
    if (auth.length !== 51) {
        console.error('401 Invalid auth size %o', auth.length);
        return res.sendStatus(401);
    }
    // user supplied access key aka bearer
    const base64Bearer = auth.substr(7, auth.length -1);
    const bearer = Buffer.from(base64Bearer, 'base64').toString('utf-8');
    if (!bearer) {
        console.error('401 Invalid auth bearer %o', bearer);
        return res.sendStatus(401);
    }
    const dbClient = new DbClient();
    const query = `SELECT access_key, device_id FROM public.wcs_devices WHERE uuid = '${deviceUuid}';`
    dbClient.query(query, (error, result) => {
        if (error) {
            console.error('Invalid auth device not found %o', error);
            return res.sendStatus(401);
        }
        // must return a single entry
        if (result['rowCount'] !== 1) {
            console.error('401 Invalid auth device not found');
            return res.sendStatus(401);
        }
        // validate user key with stored key
        const accessKey = result['rows'][0]['access_key'] + '' || '';
        if (!accessKey) {
            console.error('401 Invalid auth access key not found');
            return res.sendStatus(401);
        }
        // validate access key
        if (bearer !== accessKey) {
            console.error('401 Invalid auth access ket mismatch');
            return res.sendStatus(401);
        }
        const deviceId = result['rows'][0]['device_id'] + '' || '';
        // store device_id value in request
        req.deviceId = deviceId;
        deviceUpdateAccessed(deviceId, (err) => {
            if (err) {
                console.error('500 Device validate audit failed');
                return res.sendStatus(500);
            } else {
                next();
            }
        })
    })
}

module.exports = DeviceValidate;
