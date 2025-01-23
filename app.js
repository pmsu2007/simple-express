const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();

const envFilePath = `.env.${process.env.NODE_ENV}`;

console.log(process.env.NODE_ENV);

if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
}

const PORT = process.env.PORT || 8080;
let isKeepAlive = false;

app.use(express.json());

app.use((req, res, next) => {
    if (isKeepAlive) {
        res.set('Connection', 'close')
    }
    next();
})

app.get('/api/healthcheck', (req, res, next) => {
    console.log('call healthcheck');
    return res
        .status(200)
        .send('OK')
})

app.use('/api', (err, req, res, next) => {
    console.log(err);
})

app.listen(PORT, () => {
    isKeepAlive = true;
    if (process.send){
        process.send('ready');
    }
    console.log(`API Server is running on port ${PORT}`);
})

process.on('SIGINT', () => {
    app.close(() => {
        console.log('server closed');
        if (process.exit) {
            process.exit(0);
        }
    })
})

module.exports = app;
