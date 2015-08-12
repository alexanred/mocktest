var express = require('express')    
var app = express();
var deposit = require('./routes/deposits');

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	app.set('view engine', 'jade');
    app.locals.pretty = true;
});


app.get('/', function (req, res) {
  res.render('index', { title: 'Mock Test Index', message: 'Mock Test Message!'});
});

app.get('/deposits', function(req,res) {
deposit.getUserNames(req,res, function(req,res,userNames) {
var chooseData =  { title : 'Choose User', data: userNames};
console.log("choosedata"+chooseData);
res.render('chooseUser', chooseData);
});
});

app.get('/checkimage', function(req,res) {
deposit.getCheckImage(req,res, function(req,res,checkImage) {
res.write(checkImage);
res.end();
});
});

app.post('/deposits', function(req,res) {

deposit.showUserStatusandDeposit(req, res, function(req,res,deposits) {
var userName = req.param('username');
if(!userName)
userName = req.param('eusername');
console.log("server username " + userName);
var data  = {tile :'Status and Deposit', deposits:deposits, username:userName};
console.log(data);
res.render('statusAndDeposit', data);
});
});

app.post('/newdeposit', function(req,res) {
deposit.makeNewDeposit(req,res, function(req,res, deposit) {
var userName = req.param('username');
var data  = {tile :'New deposit status', deposit:deposit, username:userName };
res.render('newDepositStatus', data);
});
});

app.get('/updatecheckstatus', function(req,res) {
var nameParam = req.param('username');
var checkNumber = req.param('checknumber');
if(nameParam && checkNumber) {
deposit.getUpdateRecord(req,res, function(req,res, deposit) {
var chooseData =  { title : 'Update Check Status', deposit: deposit};
res.render('updateRecord', chooseData);
});
}
else {
deposit.getUpdateRecords(req,res, function(req,res,deposits) {
var chooseData =  { title : 'Update Check Status', deposits: deposits};
res.render('updateRecords', chooseData);
});
}
});
app.post('/updateRecord', function(req,res) {
deposit.updateRecord(req,res, function(req,res, deposit) {
var data = { title : 'Record Updted', deposit:deposit};
res.render("recordUpdated", data);
});
});
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 4000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});