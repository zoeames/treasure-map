'use strict';
var Mongo = require('mongodb'),
    _     = require('lodash');


function Treasure(o){
  this.name = o.name;
  this.loc = {name:o.loc.name, lat:parseFloat(o.loc.lat), lng:parseFloat(o.loc.lng)};
  this.difficulty=parseInt(o.difficulty);
  this.order=parseInt(o.order);
  this.photos=[];
  this.hints=o.hints;
  this.tags = o.tags;
  this.tags = this.tags.split(',').map(function(i){return i.trim();});
  this.isFound=false;
}

Object.defineProperty(Treasure, 'collection', {
  get: function(){return global.mongodb.collection('treasure');}
});

Treasure.query = function(cb){
  Treasure.collection.find().toArray(cb);
};

Treasure.findById = function(id, cb){
  id = Mongo.ObjectID(id);
  Treasure.collection.findOne({_id:id}, function(err, t){
    t = _.create(Treasure.prototype, t);
    cb(err, t);
  });
};


module.exports = Treasure;



///Helper Function

