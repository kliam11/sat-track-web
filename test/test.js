const fs = require('fs'); 
const st = require('spacetrack'); 
const satMod = require('../js/sat.js'); 
const config = require('../js/config.js');

// Test data.json build with sat.js 
function testBuildModel(){ 
    let catdata = JSON.parse(fs.readFileSync('satcat.json', 'utf-8'));

    st.login({
        username: config.uname,
        password: config.pword
    });
    config.tle_options.query[0].condition = getNORADids(catdata); 
    st.get(config.tle_options).then(function(tledata) {
        try {
            var s = satMod.buildModel(tledata); 
            console.log(s); 
            fs.writeFileSync('dataTest.json', JSON.stringify(s)); 
        } catch(err){ 
            console.log(err.stack); 
            return undefined; 
        }
    }, function(err) {
        console.error('TLE query error', err.stack);
        return false; 
    }); 
}

function getNORADids(sats){ 
    let ids = []; 
    for(sat of sats){ 
        ids.push(sat['NORAD_CAT_ID']); 
    }
    return ids; 
}

testBuildModel(); 

