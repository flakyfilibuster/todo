'use strict';

/* Controllers */

var todocatControllers = angular.module('todocatControllers', []);

todocatControllers.controller('TodoListCtrl', ['$scope', 'Todo', function($scope, Todo) {

    $scope.orderProp = 'name';
    $scope.status = 'all';
    $scope.formData = {};
    $scope.selected = null;



    Todo.getAll().then(function(data) {
            $scope.todos = data;
            $scope.selected = data[0];
    });

    $scope.createTodo = function() {
        Todo.save($scope.formData).then(function() {
            Todo.getAll().then(function(data) {
                $scope.formData.name = '';
                $scope.todos = data;
            });
        });
    };

    $scope.deleteTodo = function(target) {
        Todo.delete(target)
            .then(Todo.getAll()
            .then(function(data) {
                $scope.todos = data;
        }));
    };

    $scope.todoDetail = function(target) {
       $scope.selected = target;
    };

    $scope.saveNotes = function(todo, element) {
        var note = element.target.value.replace(/\r?\n/g, '<br/>');
        Todo.update(todo, note)
            .then(Todo.getAll()
            .then(function(data) {
                $scope.todos = data;
        }));
    };

    $scope.completeTodo = function(target) {
        if(target.completed) {
            return;
        }
        Todo.complete(target)
            .then(Todo.getAll()
            .then(function(data) {
                if ($scope.selected._id === target._id) {
                    Todo.get(target).then(function(rsp) {
                        $scope.selected = rsp;
                    });
                }
            $scope.todos = data;
        }));
    };
}]);
