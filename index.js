const PORT = process.env.PORT || 5000;

const { DeviceHandler } = require('./handlers/device/device');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/rest/api/device', DeviceHandler)

app.use('/rest/api', (req, res) => {
    console.log(req.headers);
    res.send({ message: 'REST API'});
})

app.listen(PORT, () => {
    console.log(`Started express on port ${PORT}`);
})
