const { Router } = require('express');
const deviceValidate = require('./device-validate');
const { Device } = require('../../data');

const router = Router();

// validate device
router.param('id', deviceValidate);

router.get('/:id', (req, res) => {
    const deviceId = req.deviceId;
    const device = new Device(deviceId);
    device.getInfo((error, result) => {
        if (error) {
            console.log('Device error %o', error);
            res.status(500);
        } else {
            res.send(result);
        }
    })
})
router.patch('/:id', (req, res) => {
    const deviceId = req.deviceId;
    const device = new Device(deviceId);
    const property = req.body['property'] || '';
    const value = req.body['value'] || '';
    if (!property || !value) {
        return res.sendStatus(400);
    }
    device.update(property, value, (error) => {
        if (error) {
            console.log('Device update error %o', error);
            res.status(500);
        } else {
            res.sendStatus(201);
        }
    })
})
router.post('/:id/sensors', (req, res) => {
    res.sendStatus(400);
})
router.get('/:id/sensors', (req, res) => {
    const deviceId = req.deviceId;
    const device = new Device(deviceId);
    device.getSensors((error, result) => {
        if (error) {
            console.log('Sensors error %o', error);
        } else {
            console.log('Sensors %o', result);
            res.send(result);
        }
    })
})
router.get('/:deviceId/sensor/:sensorId', (req, res) => {
    const deviceId = req.deviceId;
    const sensorId = req.params.sensorId;
    const device = new Device(deviceId);
    device.getSensorById(sensorId, (error, sensor) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.send(sensor);
        }
    })
})
router.patch('/:deviceId/sensor/:sensorId', (req, res) => {
    const property = req.body['property'] || '';
    const value = req.body['value'] || '';
    if (!property || !value) {
        return res.sendStatus(400);
    }
    const deviceId = req.deviceId;
    const sensorId = req.params.sensorId;
    const device = new Device(deviceId);
    device.updateSensorById(sensorId, property, value, (error) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    })
})
router.post('/:deviceId/sensor/:sensorId/value', (req, res) => {
    const value = req.body['value'] || '';
    if (!value) {
        return res.sendStatus(400);
    }
    const deviceId = req.deviceId;
    const sensorId = req.params.sensorId;
    const device = new Device(deviceId);
    device.updateSensorValueById(sensorId, value, (error) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    })
})
router.get('/:deviceId/sensor/:sensorId/value', (req, res) => {
    const deviceId = req.deviceId;
    const sensorId = req.params.sensorId;
    const search = req.query;
    console.log('Search %o', search);
    const device = new Device(deviceId);
    device.getSensorValueById(sensorId, search, (error, value) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.send(value);
        }
    })
})
exports.DeviceHandler = router;
