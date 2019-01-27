const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();

app.use('/rest/api', (req, res) => {
    console.log(req.headers);
    res.send({ message: 'Hello world'});
})

app.listen(PORT, () => {
    console.log(`Started express on port ${PORT}`);
})
