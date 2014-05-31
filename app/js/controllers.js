'use strict';

/* Controllers */

var todocatControllers = angular.module('todocatControllers', []);

todocatControllers.controller('TodoListCtrl', ['$scope', 'Todo', '$window', function($scope, Todo, $window) {

    // get nodewebkit window object
    $scope.nwWin = $window.gui.Window.get();

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
        Todo.getSlaves(target).then(function(slaves) {
            if(slaves.length > 0) {
                Todo.updateSlaves(target, slaves[0]._id)
                .then(Todo.delete(target)
                    .then(Todo.getAll()
                    .then(function(data) {
                        $scope.todos = data;
                        if ($scope.selected) {
                            Todo.getSlaves(slaves[0]._id).then(function(data) {
                                $scope.slaves = data;
                            });
                        }
                })));
            } else {
                Todo.delete(target)
                    .then(Todo.getAll()
                    .then(function(data) {
                        $scope.todos = data;
                }));
            }
        });
        if ($scope.selected) {
                

            if(target === $scope.selected._id) {
                $scope.selected = null;
                $scope.slaves = null;
            }
        }
    };

    $scope.todoDetail = function(target) {
       $scope.selected = target;
       Todo.getSlaves(target._id).then(function(data) {
           $scope.slaves = data;
       })
    };

    $scope.saveNotes = function(todo, element) {
        var note = element.target.value.replace(/\r?\n/g, '<br/>');
        Todo.update(todo, note)
            .then(Todo.getAll()
            .then(function(data) {
                $scope.todos = data;
        }));
    };

    $scope.slaveTask = function(masterId, slaveId) {
        Todo.slaveIt(masterId, slaveId).then(function() {
            Todo.getAll().then(function(data) {
                $scope.todos = data;
                if ($scope.selected) {
                    if(masterId === $scope.selected._id) {
                        Todo.getSlaves(masterId).then(function(data) {
                            $scope.slaves = data;
                        });
                    }
                }
            });
        });
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
