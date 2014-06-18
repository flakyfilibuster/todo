'use strict';
var Datastore = require('nedb'),
    path = require('path'),
    db = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'todo.db'), autoload: true });

/* Services */

var todoServices = angular.module('todoServices', []);

todoServices.factory('Todo', function($q) {

    return {
        getAll: function(){
            var defer = $q.defer();
            db.find({ $not: { slave: true }  } , function (err, docs) {
                defer.resolve(docs);
            });
            return defer.promise;
        },
        getSlaves: function(masterId){
            var defer = $q.defer();
            db.find({master: masterId}).sort({ slaveNr: 1 }).exec( function (err, docs) {
                defer.resolve(docs);
            });
            return defer.promise;
        },
        get: function(todo){
            var defer = $q.defer();
            db.findOne({_id: todo._id} , function (err, docs) {
                defer.resolve(docs);
            });
            return defer.promise;
        }, 
        updateNote: function(todoId, note) {
            var defer = $q.defer();
            db.update({ _id: todoId },
                      { $set: { notes: note } },
                      {}, function (err, numUpdated) {
                            defer.resolve(numUpdated);
                      });
            return defer.promise;
        },
        updateSlaves: function(oldMaster, newMaster, numSlaves) {
            var defer = $q.defer();
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
            var defer = $q.defer();
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
            });
            return defer.promise;
        },
        save: function(todo, callback) {
            var defer = $q.defer();
            todo.created = {
                uTime: Date.now()
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
            var defer = $q.defer(),
                completeDate = Date.now();

            db.update({ _id: todo._id },
                      { $set: { "completed.uTime": completeDate } },
                      {}, function (err, numUpdated) {
                            defer.resolve(numUpdated);
                      });
            return defer.promise;
        },
        delete: function(todoId) {
            var defer = $q.defer();
            db.remove({_id: todoId}, {}, function (err, numRemoved) {
                defer.resolve(numRemoved);
            });
            return defer.promise;
        }
    };
});
