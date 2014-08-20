'use strict';

var Treasure = require('../models/treasure');

exports.init = function(req, res){
  res.render('treasures/init');
};

exports.create = function(req, res){
  Treasure.create(req.body, function(){
    res.redirect('/treasures');
  });
};
