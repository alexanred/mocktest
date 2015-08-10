var express = require('express')    
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	app.set('view engine', 'jade');
    app.locals.pretty = true;
});


app.get('/', function (req, res) {
  res.render('index', { title: 'Mock Test Index', message: 'Mock Test Message!'});
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 4000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

server.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});