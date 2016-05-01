/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var app = express();

var index = require('./routes/index');
var user = require('./routes/user');
var postit = require('./routes/postit');


app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use('/', index);
app.use('/user', user);
app.use('/postit', postit);


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


