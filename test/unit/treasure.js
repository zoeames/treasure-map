/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Treasure  = require('../../app/models/treasure'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'template-test',
    o,
    t;

describe('Treasure', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      o = {name:'diamonds', loc:{name:'Brazil', lat:32.034, lng:123.084}, difficulty:1, order:'1', hints:{ 1:'dig', 2:'find'}, tags:'fun,shiny'},
      t = new Treasure(o);
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Treasure object', function(){
      expect(t).to.be.instanceof(Treasure);
      expect(t.name).to.equal('diamonds');
      expect(t.loc.lat).to.be.closeTo(32.034, 0.01);
      expect(t.loc.lng).to.be.closeTo(123.084, 0.01);
      expect(t.photos).to.have.length(0);
      expect(t.tags).to.have.length(2);
      expect(t.hints).to.have.length(2);
    });
  });

  describe('.found', function(){
    it('should get all treasures', function(done){
      Treasure.found(function(err, treasures){
        expect(treasures).to.have.length(3);
        done();
      });
    });
  });

  describe('#save', function(){
    it('should save to the database', function(done){
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

