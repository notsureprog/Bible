const express = require('express');
// const env = require('dotenv').config();
// const cors = require('cors');
// const axios = require('axios');
const app = express();
const ngrok = require('ngrok');
const router = express.Router();


console.log(process.env.REACT_APP_API_KEY);

// cors
router.get('/Home', (req, res, next) => {
    // res.send("Hello World");
    (async function() {
        try {
            // await ngrok.connect({authtoken: process.env.REACT_APP_TOKEN });
            // ngrok.authtoken(token);
            const url = await ngrok.connect(19006);
            const api = ngrok.getApi();
            console.log(url) 
            res.send(url);
            await ngrok.disconnect();
           
        } catch(err) {
            console.log(err);
        }
    })();
    next();
});

router.get('/callback', (req, res) => {

})


app.use('/', router);

app.listen(3000, () => {
    console.log("stuff");
})



// module.exports = router;