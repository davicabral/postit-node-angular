/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var path = require('path');

var app = express();

var index = require('./routes/index');
var user = require('./routes/user');
var postit = require('./routes/postit');


app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5500));

app.use(express.static(__dirname + '/public'));
app.use('/', index);
//app.use('/user', user);
//app.use('/postit', postit);


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


