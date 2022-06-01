const express = require('express');
let router = express.Router();
const url = require("url");

const dataMethods = require('./js/dataMethods.js')
const satcatModel = require('./models/satcatModel.js'); 
const satcatBackupPath = './models/backup-data/satcat.json'; 


/* /satcat */ 

// Return all satcat data 
router.get('/', (req, res) => { 
    satcatModel.find({}, (err, mongoData) => { 
        if(err || (mongoData===undefined)){ 
            dataMethods.readBackup(satcatBackupPath, (err, backupData) => { 
                if(err) res.status(500).send(); 
                else if (backupData===undefined) res.status(403).send('Backup data unavailable'); 
                else res.status(201).json(backupData); 
            }); 
        } else res.status(200).json(mongoData); 
    });
}); 

// Return all satcat data for a specified country 
router.get('/:country', (req, res) => { 
    
}); 

// Return satcat data for a specific satellite 
router.get('/:satNum', (req, res) => { 
    
}); 

// Return satcat data for a specific satellite and specific country 
router.get('/:country/:satNum', (req, res) => { 
    
}); 

module.exports = router; 