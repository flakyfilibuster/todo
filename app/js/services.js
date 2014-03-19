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
            db.find({}, function (err, docs) {
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
        save: function(todo, callback) {
            var createDate = new Date(),
                defer = this.defer();
            todo.created = {
                date: createDate.toDateString(),
                time: createDate.toLocaleTimeString("de")
            };
            todo.notes = "Double-Click to add notes";
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
