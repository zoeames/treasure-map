'use strict';

var Mongo = require('mongodb'),
       fs = require('fs'),
     path = require('path');

function Treasure(o){
  this.loc        = {};
  this.loc.name   = o.loc[0];
  this.loc.lat    = o.loc[1] * 1;
  this.loc.lng    = o.loc[2] * 1;
  this.name       = o.name[0];
  this.photos     = [];
  this.hints      = o.hints;
  this.tags       = o.tags[0].split(',').map(function(t){return t.trim();});
  this.order      = o.order[0] * 1;
  this.difficulty = o.difficulty[0] * 1;
  this.isFound    = false;
  this.isLinkable = this.order === 1 ? true : false;
}

Object.defineProperty(Treasure, 'collection', {
  get: function(){return global.mongodb.collection('treasures');}
});

Treasure.query = function(query, cb){
  var filter = {},
        sort = {};

  if(query.tag){filter = {tags:{$in:[query.tag]}};}
  if(query.sort){sort[query.sort] = query.order * 1;}
  Treasure.collection.find(filter).sort(sort).toArray(cb);
};

Treasure.findById = function(id, cb){
  id = Mongo.ObjectID(id);
  Treasure.collection.findOne({_id:id}, function(err, obj){
    cb(obj);
  });
};


Treasure.found = function(id, cb){
  id = Mongo.ObjectID(id);
  Treasure.collection.update({_id:id}, {$set:{isFound:true}}, cb);
};

Treasure.prototype.save = function(cb){
  Treasure.collection.save(this, cb);
};

Treasure.prototype.addPhotos = function(files, cb){
  var dir   = __dirname + '/../static/img/' + this._id,
      self  = this,
      exist = fs.existsSync(dir); //true if the directory already exists
  if(!exist){
    fs.mkdirSync(dir); //Nodes way of making a file, uses the fs module
  }

  files.photos.forEach(function(photo){
    var ext = path.extname(photo.path),
        rel = '/img/' + self._id + '/' + self.photos.length +  ext,
        abs = dir + '/' + self.photos.length + ext;

    fs.renameSync(photo.path, abs); //move and rename
    self.photos.push(rel);
  });
  Treasure.collection.save(self, cb);
};

Treasure.create = function(fields, files, cb){
  var t = new Treasure(fields);
  t.save(function(){
    t.addPhotos(files, cb);
  });
};


module.exports = Treasure;
