const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const  satellite = require('satellite.js');
const Cesium = require('cesium'); 

const  dateModel = require('./dateModel.js');
const config = require('../config.js'); 
const dataMethods = require('../js/dataMethods.js'); 
const paramsBackupPath = './models/backup-data/params.json'; 

Cesium.Ion.defaultAccessToken = config.cs_token; 

// Time constants 
const timestepInSeconds = 120;
const totalSeconds = 86400; 


let paramsSchema = Schema({ 
    SATNAME : { 
        type: String, 
        required: true
    }, 
    NORAD_CAT_ID: { 
        type: String, 
        required: true
    }, 
    tle: {
        type: [String], 
        required: true 
    }, 
    positions: [{}], 
    period: { 
        type: String, 
        required: true, 
    }, 
    type: { 
        type: String, 
        required: true, 
    }
});

paramsSchema.statics.parseParams = function(sat, date){ 
    return { 
        SATNAME: sat['name'], 
        NORAD_CAT_ID: sat['catalogNumber'], 
        tle: sat['tle'], 
        positions: buildPositions(sat, date), 
        period: sat['orbitalPeriod'], 
        type: sat['type'] 
    }
}

paramsSchema.statics.upsert = function(paramsArr){ 
    this.deleteMany({}, (err) => { 
        if(err) console.log('Error: cannot communicate to DB to remove existing params array', err.stack);
        else this.insertMany(paramsArr, (err, result) => { 
            if(err) console.log('Error: cannot communicate to DB to create new a params array', err.stack);
            console.log(result); 
            dataMethods.writeBackup(paramsBackupPath, paramsArr); 
        }); 
    }); 
}

// Bundles computed positional data 
function buildPositions(sat, date){ 
    let tle = sat['tle']; 
    const start = Cesium.JulianDate.fromDate(date);
    let positions = [] ; 

    let satrec = satellite.twoline2satrec(tle[1].trim(), tle[2].trim());
    let pos = computePositions(satrec, start);  
    if(pos!==undefined){ 
        positions.push(pos);
    } return positions; 
}

// Mathematical computation of orbital positions (lat, lon, height)
function computePositions(satrec, start){ 
    var pData = []; 
    for (let i = 0; i < totalSeconds; i+= timestepInSeconds) {
        const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
        const jsDate = Cesium.JulianDate.toDate(time);

        const positionAndVelocity = satellite.propagate(satrec, jsDate);
        
        if(positionAndVelocity.position) pData.push(positionAndVelocity.position); 
    } 
    if(pData.length!==0) return pData; 
    else return undefined; 
}

module.exports = mongoose.model("paramsModel", paramsSchema);