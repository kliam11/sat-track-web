const express = require('express');  
const app = express(); 
const cron = require('node-cron');  
const mod = require('./js/methods.js'); 
const rateLimit = require('express-rate-limit');


// init data on server startup 
// *** node server.js init *** 
if(process.argv[2]==='init') { 
    console.log('Manual initialization of data on startup...'); 
    if(mod.initUpdateData()) console.log('Initialization/updates failed');
    console.log('Manual initialization completed!'); 
} 

// Scheduled cron update of json data at midnight 
cron.schedule('0 0 * * *', function() {
    console.log('Daily data update');
    if(mod.initUpdateData()) console.log('Initialization/updates failed');
});

app.use(express.static(__dirname + '/public', {
    extensions: ['html']
})); 

// API req limiter 
// only for /data requests 
app.use('/data', rateLimit({
    // 2 requests for data per one minute 
    windowMs: 60 * 1000, 
    max: 2, 
    standardHeaders: true 
}));

app.get('/data', function(req, res){ 
    if(req.accepts('application/json')){ 
        let data = mod.getData(); 
        if(!data) res.status(404).send('Not even backup data can be sent, please contact for maitenance!'); 
        if(data) res.status(200).json(data); 
        else res.status(500).send('Server error'); 
    } else { 
        res.status(400).send('Bad request'); 
    }
}); 

app.get('/', function(req, res){ 
    res.status(400).send('The site is currently unavailable.'); 
}); 

app.listen(8080); 


