'use strict';
var Mongo = require('mongodb'),
    _     = require('lodash'),
    fs    = require('fs'),
    path  = require('path');


function Treasure(o){
  this.name = o.name[0];
  this.loc = [o.loc[0], parseFloat(o.loc[1]), parseFloat(o.loc[2])];
  this.difficulty=o.difficulty[0] * 1;
  this.order=o.order[0] *1;
  this.photos=[];
  this.hints=o.hints;
  this.tags = o.tags[0].split(',').map(function(i){return i.trim();});
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

Treasure.found = function(id,cb){
  id=Mongo.objectID(id);
  Treasure.collection.update({_id:id}, {$set:{isFound:true}}, cb);
};

Treasure.prototype.save = function(cb){
  Treasure.collection.save(this, function(err, object){
    cb();
  });
};

Treasure.prototype.uploadPhoto = function(files, cb){
  var dir   = __dirname + '/../static/img/' + this._id,
      exist = fs.existsSync(dir),
      self  = this;

  if(!exist){fs.mkdirSync(dir);}

  files.photos.forEach(function(photo){
    var ext    = path.extname(photo.path),
        rel    = '/img/' + self._id + '/' + self.photos.length + ext,
        abs    = dir + '/' + self.photos.length + ext;
    fs.renameSync(photo.path, abs);
    self.photos.push(rel);
  });

  Treasure.collection.save(self, cb);
};


module.exports = Treasure;



