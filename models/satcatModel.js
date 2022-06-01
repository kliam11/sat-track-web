const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const config = require('../config.js')

const dataMethods = require('../js/dataMethods.js'); 
const satcatBackupPath = './models/backup-data/satcat.json'; 

let satcatSchema = Schema({ 
    INTLDES: { 
        type: String, 
        required: true, 
        minlength: [9, "INTLDES bad length"], 
        maxlength: [10, "INTLDES bad length"]
    }, 
    NORAD_CAT_ID: { 
        type: String, 
        required: true
    }, 
    OBJECT_TYPE: { 
        type: String, 
        required: true
    }, 
    SATNAME : { 
        type: String, 
        required: true
    }, 
    COUNTRY: { 
        type: String, 
        required: true, 
        minlength: [1, "COUNTRY bad length, too low"], 
        maxlength: [3, "COUNTRY bad length, too high"]
    }, 
    LAUNCH: { 
        type: String, 
        required: true, 
        minlength: [10, "LAUNCH bad length"], 
        maxlength: [10, "LAUNCH bad length"]
    }, 
    SITE: { 
        type: String, 
        required: true, 
        minlength: [1, "SITE bad length, too low"], 
        maxlength: [5, "SITE bad length, too high"]
    }, 
    PERIOD: { 
        type: String, 
        minlength: [3, "PERIOD bad length, too low"], 
        maxlength: [10, "PERIOD bad length, too high"]
    }, 
    INCLINATION: { 
        type: String, 
        minlength: [3, "INCLINATION bad length, too low"], 
        maxlength: [5, "INCLINATION bad length, too high"]
    }, 
    APOGEE: { 
        type: String, 
        minlength: [3, "APOGEE bad length, too low"], 
        maxlength: [6, "APOGEE bad length, too high"]
    }, 
    PERIGEE: { 
        type: String, 
        minlength: [3, "PERIGEE bad length, too low"], 
        maxlength: [6, "PERIGEE bad length, too high"]
    }, 
    LAUNCH_YEAR: { 
        type: String, 
        minlength: [4, "LAUNCH YEAR bad length"], 
        maxlength: [10, "LAUNCH YEAR bad length"]
    }
}); 

satcatSchema.statics.parseSatcat = function(sat){ 
    return { 
        'INTLDES': sat['intlDesignator'], 
        'NORAD_CAT_ID': sat['catalogNumber'], 
        'OBJECT_TYPE': sat['type'], 
        'SATNAME': sat['name'], 
        'COUNTRY': sat['country'],
        'LAUNCH': sat['launchDate'], 
        'SITE': sat['launchSiteCode'], 
        'PERIOD': sat['orbitalPeriod'], 
        'INCLINATION': sat['inclination'],
        'APOGEE': sat['apogee'],
        'PERIGEE': sat['perigee'], 
        'LAUNCH_YEAR': sat['launchYear']
    }
}

satcatSchema.statics.upsert = function(satcatArr){ 
    this.deleteMany({}, (err) => { 
        if(err) console.log('Error: cannot communicate to DB to remove existing satcat array', err.stack);
        else this.insertMany(satcatArr, (err, result) => { 
            if(err) console.log('Error: cannot communicate to DB to create new a satcat array', err.stack);
            console.log(result); 
            dataMethods.writeBackup(satcatBackupPath, satcatArr); 
        }); 
    }); 
}

// Adds all satellite IDs to spacetrack config query condition for params_options 
satcatSchema.statics.configIds = async function(){
    let sats = await this.find({}).exec();
    config.spacetrack.params_options.query[0].condition.length = 0; // reset ids array 
    for(sat of sats){ 
        config.spacetrack.params_options.query[0].condition.push(sat['NORAD_CAT_ID']); 
    }
}

module.exports = mongoose.model("satcatModel", satcatSchema);