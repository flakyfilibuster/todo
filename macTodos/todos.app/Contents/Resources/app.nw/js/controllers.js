'use strict';

/* Controllers */

var todoControllers = angular.module('todoControllers', [])

.controller('TodoListCtrl', ['$scope', 'Todo', '$window', function TodoListCtrl($scope, Todo) {

    // set up some default variables
    $scope.orderProp = 'name';
    $scope.status = 'all';
    $scope.formData = {};
    $scope.selected = null;

    var loadAllTodos = function() {
        return Todo.getAll()
            .then(function(allTodos) {
            $scope.todos = allTodos;
                return allTodos;
            });
    };

    var loadAllSlaves = function(masterId) {
        return Todo.getSlaves(masterId)
            .then(function(allSlaves) {
                $scope.slaves = allSlaves;
                return allSlaves;
            });
    };

    $scope.createTodo = function() {
        Todo.save($scope.formData)
            .then(loadAllTodos)
            .then(function(allTodos) {
                $scope.formData.name = '';
                $scope.todos = allTodos;
                return allTodos;
            });
    };

    $scope.deleteTodo = function(targetId) {
        loadAllSlaves(targetId).then(function(slaves) {
            if (slaves.length > 0) {
                Todo.updateSlaves(targetId, slaves[0]._id, slaves.length-1);
            }
            Todo.delete(targetId).then(loadAllTodos);
        });
        if ($scope.selected) {
            if(targetId === $scope.selected._id) {
                $scope.selected = null;
                $scope.slaves = null;
            }
        }
    };

    $scope.todoDetail = function(target) {
        $scope.selected = target;
        loadAllSlaves(target._id);
    };

    $scope.saveNotes = function(todo, element) {
        var note = element.target.value.replace(/\r?\n/g, '<br/>');
        Todo.updateNote(todo._id, note).then(loadAllTodos);
    };

    $scope.slaveTask = function(masterId, slaveId) {
        Todo.slaveIt(masterId, slaveId).then(loadAllTodos);
    };

    $scope.completeTodo = function(target) {
        (target.completed) ||
        Todo.complete(target)
            .then(loadAllTodos);

        if ($scope.selected._id === target._id) {
            Todo.get(target).then(function(rsp) {
                $scope.selected = rsp;
            });
        }
    };

    loadAllTodos();
}]);
