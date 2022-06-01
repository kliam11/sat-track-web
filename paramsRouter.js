const express = require('express');
let router = express.Router();
const url = require("url");

const dataMethods = require('./js/dataMethods.js'); 
const paramsModel = require('./models/paramsModel.js'); 
const paramsBackupPath = './models/backup-data/params.json'; 

/* /params */ 

// Return all orbital parameter data for all satellites 
router.get('/', (req, res) => { 
    paramsModel.find({}, (err, mongoData) => { 
        if(err || (mongoData===undefined)){ 
            dataMethods.readBackup(paramsBackupPath, (err, backupData) => { 
                if(err) res.status(500).send(); 
                else if (backupData===undefined) res.status(403).send('Backup data unavailable'); 
                else res.status(201).json(backupData); 
            }); 
        } else res.status(200).json(mongoData); 
    });
}); 

// Return all orbital parameter data for satellites of specific country 
router.get('/:country', (req, res) => { 
    
}); 

// Return all orbital parameter data for specifc satellite 
router.get('/:satNum', (req, res) => { 
    
}); 

// Return satcat data for a specific satellite and specific country 
router.get('/:country/:satNum', (req, res) => { 
    
}); 

module.exports = router; 