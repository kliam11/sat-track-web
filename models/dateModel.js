const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataMethods = require('../js/dataMethods.js'); 
const dateBackupPath = './models/backup-data/date.json'; 

let dateSchema = Schema({ 
    date : { 
        type: Date, 
        required: true
    }
});

dateSchema.statics.upsert = function(date){
    this.findOne({}, (err, lastDate) => { 
        if(err) console.log('Error: cannot communicate to DB to find a date', err.stack);
        else if (lastDate===null){ 
            this.create({'date':date}, (err, result) => { 
                if(err) console.log('Error: cannot communicate to DB to save new date', err.stack);
                else console.log(date, 'New date created: ', result); 
                dataMethods.writeBackup(dateBackupPath, {'date':date}); 
            });
        } else { 
            this.updateOne({'date':lastDate.date}, {'date':date}, (err, result) => { 
                if(err) console.log('Error: cannot communicate to DB to update date', err.stack);
                else console.log(date, 'Updated date: ', result); 
                dataMethods.writeBackup(dateBackupPath, {'date':date}); 
            }); 
        }
    }); 
}

module.exports = mongoose.model("dateModel", dateSchema);