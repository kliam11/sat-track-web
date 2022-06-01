const express = require('express');  
const app = express(); 
const cron = require('node-cron');
const st = require('spacetrack'); 
const fs = require('fs'); 

const config = require('./config.js'); 
const satcatRouter = require('./satcatRouter.js');
const paramsRouter = require('./paramsRouter.js');
const dataMethods = require('./js/dataMethods.js')

const mongoose = require('mongoose');
var db;
app.locals.db = db;

const satcatModel = require('./models/satcatModel'); 
const paramsModel = require('./models/paramsModel'); 
const dateModel = require('./models/dateModel'); 


// Update dataset for the day at midnight 
cron.schedule('0 0 0 * * *', () => {
    console.log('SATCAT and TLE data update starting...'); 
    fetchSatcat(config.spacetrack.satcat_options, config.spacetrack.uname, config.spacetrack.pword); 
    fetchParams(config.spacetrack.params_options, config.spacetrack.uname, config.spacetrack.pword, initDate()); 
    console.log('...update finished!');
});

function initDate(){ 
    let date = new Date(); 
    dateModel.upsert(date); 
    return date; 
}

// Retrieve satellite catalog data from Space-Track.org API
function fetchSatcat(options, uname, pword){ 
    st.login({username: uname, password: pword});
    st.get(options).then(function(satcatData) {
        let satcatArr = []; 
        for(sat of satcatData){  
            if(sat.decayDate===undefined){ 
                satcatArr.push(satcatModel.parseSatcat(sat));  // Only add if in orbit currenlty 
            }
        }
        satcatModel.upsert(satcatArr);  
    }, function(err) {
        console.error('SATCAT query error', err.stack);
        return false; 
    });
}
 // Retrieve TLE data and build each satellite's positions 
async function fetchParams(options, uname, pword, date){ 
    await satcatModel.configIds(); 
    
    st.login({username: uname, password: pword});
    st.get(options).then(function(tleArr) {
        let params = []; 
        for(sat of tleArr){ 
            params.push(paramsModel.parseParams(sat, date)); 
        }
        paramsModel.upsert(params); 
    }, function(err) {
        console.error('SATCAT query error', err.stack);
    });
}


// API 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req,_,next) => {
    console.log(`${req.method}: ${req.url}`);
    if (Object.keys(req.body).length > 0){
        console.log('Body:');
        console.log(req.body);
    }
    next();
}); 

app.use(express.static(__dirname + '/public', {
    extensions: ['html']
})); 

app.use('/satcat', satcatRouter); 
app.use('/params', paramsRouter); 

app.get('/date', (req, res) => { 
    dateModel.findOne({}, (err, mongoData) => { 
        if(err || (mongoData===undefined)){ 
            dataMethods.readBackup(satcatBackupPath, (err, backupData) => { 
                if(err) res.status(500).send(); 
                else if (backupData===undefined) res.status(403).send('Backup data unavailable'); 
                else res.status(201).json(backupData); 
            }); 
        } else res.status(200).json(mongoData); 
    });
}); 

app.get('/', function(req, res){ 
    res.status(200).send(); 
}); 

app.use(function(req, res){ 
    res.status(404).sendFile(__dirname + '/public/err.html'); 
}); 

mongoose.connect(config.db.host, {useNewUrlParser: true, useUnifiedTopology: true});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error')); 

db.once('open', () => { 
    console.log('Connected to DB'); 
    fetchSatcat(config.spacetrack.satcat_options, config.spacetrack.uname, config.spacetrack.pword); // Retrieve initial satcat data 
    fetchParams(config.spacetrack.params_options, config.spacetrack.uname, config.spacetrack.pword, initDate()); // Retrieve initial TLE data 
}); 

process.on('SIGINT', () => { 
    mongoose.connection.close(function(){ 
        console.log('DB disconnected'); 
        process.exit(0);
    }); 
}); 

app.listen(config.port); 



