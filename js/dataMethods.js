const fs = require('fs'); 

const dataMethods = {} 

dataMethods.writeBackup = async function(path, data){ 
    fs.writeFile(path, JSON.stringify(data), (err) => { 
        if(err) console.log('Error: could not write backup data to file for ' + path, err.stack); 
    }); 
}

dataMethods.readBackup = async function(path, callback){ 
    fs.readFile(path, 'utf-8', callback); 
}

module.exports = dataMethods; 