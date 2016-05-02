/**
 * Created by Davi on 01/05/16.
 */
var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var db = require('./models/models');

var app = express();

var index = require('./routes/index');
var user = require('./routes/user');
var postit = require('./routes/postit');


app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.set('port', (process.env.PORT || 5500));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', index);
app.use('/user', user);
app.use('/postit', postit);

db.sequelize.sync({force: true}).then(function () {

    db.User.create({
        login: 'carlos',
        password: '7c4a8d09ca3762af61e59520943dc26494f8941b'
    }).then(function () {
        console.log('Usuario criado');
    });

    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });

});


