/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Treasure  = require('../../app/models/treasure'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'template-test',
    obj       = {name:['Diamonds'], difficulty:['2'], loc:['Siberia', '20', '10.22'], order:['2'], tags:['shiny, bling'], photos:[], hints:['turn left', 'dig']};

describe('Treasure', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Person object', function(){
      var t = new Treasure(obj);
      expect(t).to.be.instanceof(Treasure);
      expect(t.name).to.equal('Diamonds');
      expect(t.difficulty).to.equal(2);
      expect(t.order).to.equal(2);
      expect(t.loc.name).to.equal('Siberia');
      expect(t.loc.lat).to.equal(20);
      expect(t.loc.lng).to.equal(10.22);
      expect(t.tags).to.have.length(2);
      expect(t.tags[1]).to.equal('bling');
      expect(t.photos).to.have.length(0);
      expect(t.hints).to.have.length(2);
      expect(t.hints[0]).to.equal('turn left');
      expect(t.isFound).to.equal(false);
    });
  });

  describe('.query', function(){
    it('should get all treasures', function(done){
      Treasure.query({}, function(err, treasures){
        expect(treasures).to.have.length(3);
        done();
      });
    });
  });


  describe('#save', function(){
    it('should save to the database', function(done){
      var t = new Treasure(obj);
      t.save(function(){
        expect(t._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });


  describe('.findById', function(){
    it('should find a treasure in database by it\'s ID', function(done){
      var id = '000000000000000000000003';
      Treasure.findById(id, function(err, treasure){
        expect(treasure._id).to.be.instanceof(Mongo.ObjectID);
        expect(treasure._id.toString()).to.equal(id);
        done();
      });
    });
  });

});

