const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const router = require('./routes');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use('/api', router);

app.listen(3030, () => {
    console.log('Server started!');
})