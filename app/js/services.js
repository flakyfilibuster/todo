'use strict';
var Datastore = require('nedb'),
    path = require('path'),
    db = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'todo.db'), autoload: true });

/* Services */

var todocatServices = angular.module('todocatServices', []);

todocatServices.factory('Todo', function() {
    return {
        query: function(callback){
            db.find({}, function (err, docs) {
                callback(docs);
            });
        },
        get: function(id, callback){
            db.findOne(id , function (err, docs) {
                callback(docs);
            });
        }, 
        save: function(todo, callback) {
            var createDate = new Date();
            todo.created = {
                date: createDate.toDateString(),
                time: createDate.toLocaleTimeString("de")
            };
            db.insert(todo, function (err, newDoc) { });
        },
        complete: function(todo) {
            var createDate = new Date(),
                date = createDate.toDateString(),
                time = createDate.toLocaleTimeString("de");

            db.update({ _id: todo },
                      { $set: { "completed.date": date, "completed.time": time } },
                      {}, function () {})
        },
        delete: function(todo) {
            db.remove({_id: todo}, {}, function (err, numRemoved) {});
        }
    }
});
  
