var mongoose = require('mongoose');
var datadb = mongoose.connection;
datadb.on('error', console.error);
datadb.once('open', function() {
  // Create your schemas and models here.
});

var connection_string = 'localhost/checkdb';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

console.log("Conection string" + connection_string);

mongoose.connect('mongodb://'  + connection_string , function (error) {
    if (error) {
        console.log(error);
    }
});

var Schema = mongoose.Schema;
var depositSchema = new Schema({
name :String,
checknumber:String,
amount : String,
frontimage: Buffer,
backimage: Buffer,
status :String
});

var checkDeposits = mongoose.model('checkDeposits', depositSchema);

exports.getUserNames = function(req, res, callback) {
       checkDeposits.find({}, function(err, items) {
		if(err) {
		console.log(err);
		return null;
		}
		var names = [];		
		for(i=0; i<items.length; i++){				
		  var name = items[i].name;		  
		  if(names.indexOf(name) == -1) {
		  names.push(name);
		  
		  }
		}		
		var users = [];
		for(i=0;i<names.length;i++) {		
		var aname = {name:names[i]};
		users.push(aname);
		}
		callback(req,res,users);        
        }); 
}

exports.showUserStatusandDeposit  = function(req, res, callback) {
var userName = req.param('username');
if(!userName)
userName = req.param('eusername');
console.log("usernameparam"+userName);
var query = {name:userName}
       checkDeposits.find(query, function(err, items) {
		if(err) {
		console.log(err);
		return null;
		}	
		callback(req,res,items);		
            
        });
}

exports.makeNewDeposit = function(req,res,callback) {
var userName = req.param('username');
var amount  = req.param('amount');
var checkNumber = req.param('checknumber');
var frontImage = req.param('frontImage');
console.log(frontImage);

var backImage = req.param('backImage');
console.log(backImage);
var status = 'InProgress';
var deposit = { name:userName, amount:amount, checknumber:checkNumber, frontimage:frontImage, backimage:backImage, status:status};

var depositdb = new checkDeposits(deposit);
 console.log('deposit from request: ' + JSON.stringify(depositdb));		
   depositdb.save(function(err, result) {
            if (err) {
                //res.send({'error':'An error has occurred'});
				conlose.log('error');
            } else {
                console.log('Success: ' + JSON.stringify(result));			
                callback(req,res,result);
            }
        });
}

exports.getUpdateRecords = function(req, res, callback) {
       checkDeposits.find({}, function(err, items) {
		if(err) {
		console.log(err);
		return null;
		}
		callback(req,res,items);        
        }); 
}

exports.getUpdateRecord = function(req, res, callback) {

var userName = req.param('username');
var checkNumber = req.param('checknumber');
var query = { name:userName, checknumber:checkNumber};
       checkDeposits.find(query, function(err, items) {
		if(err) {
		console.log(err);
		return null;
		}		
		callback(req,res,items[0]);        
        }); 
}

exports.updateRecord = function(req, res, callback) {
var userName = req.param('username');
var checkNumber = req.param('checknumber');
var estatus = req.param('estaus');
var status = req.param('status');
var deposit = [];
if(estatus != status){
   if(userName && checkNumber) {
   var query = { name:userName, checknumber:checkNumber};
     checkDeposits.find(query, function(err, items) {
		if(err) {
		console.log(err);
		return null;
		}	
        items[0].status = status;
        items[0].save(function(err, result) {
		if(err) {
		return;
		}
		else{
		callback(req,res,result);        
		}
		
         });		
		
        }); 
   }
}
}

exports.getCheckImage = function(req, res, callback) {
var userName = req.param('username');
var checkNumber = req.param('checknumber');
var type = req.param('type');
var query = { name:userName, checknumber:checkNumber};
       checkDeposits.find(query, function(err, items) {
		if(err) {
		console.log(err);
		return null;
		}		
		var image;
		if(type = 'front'){
		image = items[0].frontimage;
		}else{
		image = items[0].backimage;
		}
		callback(req,res,image);        
        }); 
}
