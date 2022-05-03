const methods = {} 

const st = require('spacetrack'); 
const fs = require("fs");
const config = require('./config.js');
const satMod = require('./sat.js');

const dataPath = "data/data.json";  
const backupPath = "data/backup.json";  

// TODO: redo and dont make so many files, async, error handling, and do computations to send as a file...
// Note: the error handling here is horse shit 
methods.initUpdateData = function(){
    // Copy-save yesterdays data for failsafe 
    copy(); 

    st.login({
        username: config.uname,
        password: config.pword
    });

    st.get(config.satcat_options).then(function(catdata) {
        try{ 
            config.tle_options.query[0].condition = getNORADids(catdata); 
            st.get(config.tle_options).then(function(tledata) {
                try { 
                    var s = satMod.buildModel(tledata); 
                    console.log(s); 
                    fs.writeFileSync(dataPath, JSON.stringify(s)); 
                } catch(err){ 
                    return undefined; 
                }
            }, function(err) {
                console.error('TLE query error', err.stack);
                return false; 
            }); 
        } catch(err){ 
            console.log(err); 
            return undefined; 
        }
    }, function(err) {
        console.error('SATCAT query error', err.stack);
        return false; 
    });
}

// Creates the data that needs to be sent to the client
// TODO: make async for faster serving... 
methods.getData = function(){ 
    try { 
        let data = fs.readFileSync(dataPath, 'utf-8'); 
        return JSON.parse(data);
    } catch(err){ 
        console.log('Backup data was sent instead...'); 
        try { 
            let bData = fs.readFileSync(backupPath, 'utf-8'); 
            return JSON.parse(bData); 
        } catch(err){ 
            return undefined
        }
    }
}

function getNORADids(sats){ 
    let ids = []; 
    for(sat of sats){ 
        ids.push(sat['catalogNumber']); 
    }
    return ids; 
}

function copy(){ 
    fs.copyFileSync(dataPath, backupPath); 
}

module.exports = methods; 

