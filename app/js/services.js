'use strict';
var Datastore = require('nedb'),
    path = require('path'),
    db = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'todo.db'), autoload: true });

/* Services */

var todocatServices = angular.module('todocatServices', []);

todocatServices.factory('Todo', function($q) {

    return {
        defer: function() {
            return $q.defer();
        },
        getAll: function(){
            var defer = this.defer();
            db.find({ $not: { slave: true }  } , function (err, docs) {
                defer.resolve(docs);
            });
            return defer.promise;
        },
        getSlaves: function(masterId){
            var defer = this.defer();
            db.find({master: masterId}).sort({ slaveNr: 1 }).exec( function (err, docs) {
                defer.resolve(docs);
            });
            return defer.promise;
        },
        get: function(todo){
            var defer = this.defer();
            db.findOne({_id: todo._id} , function (err, docs) {
                defer.resolve(docs);
            });
            return defer.promise;
        }, 
        update: function(todo, note) {
            var defer = this.defer();
            db.update({ _id: todo._id },
                      { $set: { notes: note } },
                      {}, function (err, numUpdated) {
                            defer.resolve(numUpdated);
                      });
            return defer.promise;
        },
        updateSlaves: function(oldMaster, newMaster, numSlaves) {
            var defer = this.defer();
            // update the first in row of the slaves
            db.update({ _id : newMaster },
                { $set: { slave: false, master: null, slaveCount: numSlaves } },
                {}, 
                function (err, numUpdated) {
            });
            // tell the old slaves who the new master is
            db.update({ master : oldMaster },
                { $set: { master: newMaster } },{ multi: true }, 
                function (err, numUpdated) {
                    defer.resolve(numUpdated);
            });
            return defer.promise;
        },
        slaveIt: function(masterId, slaveId) {
            var defer = this.defer();
            db.findOne({_id: masterId}, function (err, data) {
                db.update({ _id: slaveId},
                    { $set: { master: masterId, slave: true, slaveNr: data.slaveCount+1} },
                    {}, function (err, numUpdated) {
                    defer.resolve(numUpdated);
                });
                db.update({_id: masterId},
                    {$set: {slaveCount: data.slaveCount+1}},
                    function(err, numUpdated) {
                });
            })
            return defer.promise;
        },
        save: function(todo, callback) {
            var createDate = new Date(),
                defer = this.defer();
            todo.created = {
                date: createDate.toDateString(),
                time: createDate.toLocaleTimeString("de")
            };
            todo.notes = "Double-Click to add notes";
            todo.slave = false;
            todo.slaveCount = 0;
            todo.slaveNr = 0;
            todo.master = null;
            db.insert(todo, function (err, newDoc) {
                defer.resolve(newDoc);
            });
            return defer.promise;
        },
        complete: function(todo) {
            var defer = this.defer(),
                completeDate = new Date(),
                date = completeDate.toDateString(),
                time = completeDate.toLocaleTimeString("de");

            db.update({ _id: todo._id },
                      { $set: { "completed.date": date, "completed.time": time } },
                      {}, function (err, numUpdated) {
                            defer.resolve(numUpdated);
                      });
            return defer.promise;
        },
        delete: function(todo) {
            var defer = this.defer();
            db.remove({_id: todo}, {}, function (err, numRemoved) {
                defer.resolve(numRemoved);
            });
            return defer.promise;
        }
    };
});
