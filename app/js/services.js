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
            db.insert(todo, function (err, newDoc) { });
        },
        delete: function(todo) {
            db.remove({_id: todo}, {}, function (err, numRemoved) {});
        }
    }
});
  
