const express = require('express');
const env = require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const ngrok = require('ngrok');
const router = express.Router();


console.log(process.env.REACT_APP_API_KEY);
const app = express();

// cors
router.get('/Home', (req, res) => {
    // res.send("Hello World");
    (async function() {
        try {
            await ngrok.connect({authtoken: process.env.REACT_APP_TOKEN, proto: 'http' });
            // ngrok.authtoken(token);
            const url = await ngrok.connect(19006);
            const api = ngrok.getApi();
            console.log(url) 
           
        } catch(err) {
            console.log(err);
        }
    })();
    
})


app.use('/', router);

app.listen(3000, () => {
    console.log("stuff");
})



// module.exports = router;