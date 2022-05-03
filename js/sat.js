const  satellite = require('satellite.js');
const Cesium = require('cesium'); 
const config = require('./config.js'); 

Cesium.Ion.defaultAccessToken = config.cs_token; 

const sat = {} 

const totalSeconds = 60 * 60;
const timestepInSeconds = 120;

sat.buildModel = function(tledata){ 
    const date = new Date();
    const start = Cesium.JulianDate.fromDate(date);
    
    var data = [];
    
    for(s of tledata){ 
        
        let satrec = satellite.twoline2satrec(s['tle'][1].trim(), s['tle'][2].trim());
        let pos = computeParams(satrec, start);  
        let p = buildObject(date, s['tle'], pos); 
        data.push(p); 
    }
    return data; 
}

function buildObject(date, tle, pos){ 
    const p = {
        'date':date, 
        'tle': tle, 
        'positions': pos
    } 
    return p;  
}

function computeParams(satrec, start){ 
    //const positionsOverTime = new Cesium.SampledPositionProperty();
    var pData = []; 
    for (let i = 0; i < totalSeconds; i+= timestepInSeconds) {
        const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
        const jsDate = Cesium.JulianDate.toDate(time);

        const positionAndVelocity = satellite.propagate(satrec, jsDate);
        const gmst = satellite.gstime(jsDate);
        
        let p; 
        if(positionAndVelocity.position!==undefined){ 
            p   = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
            pData.push(p); 
            //position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
            //positionsOverTime.addSample(time, position);
        }
    }
    return pData; 
}

module.exports = sat; 