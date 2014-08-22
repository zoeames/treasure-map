'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    treasure       = require('../controllers/treasures'),
    home           = require('../controllers/home');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());

  app.get('/', home.index);
  app.get('/treasures', treasure.index);
  app.get('/treasures/new', treasure.init);
  app.post('/treasures', treasure.create);
  app.get('/treasures/:id', treasure.view);
  app.get('/treasures/:id/found', treasure.found);

  console.log('Express: Routes Loaded');
};
