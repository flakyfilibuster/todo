'use strict';

/* Controllers */

var todocatControllers = angular.module('todocatControllers', []);

todocatControllers.controller('TodoListCtrl', ['$scope', 'Todo', function($scope, Todo) {
    $scope.orderProp = 'name';
    $scope.formData = {};

    Todo.query(function(data) {
        $scope.todos = data;
        $scope.$apply();
    })

    $scope.createTodo = function() {
        if ($scope.formData.name) {
            Todo.save($scope.formData);
            $scope.formData = {};
            Todo.query(function(data) {
                $scope.todos = data;
                $scope.$apply();
            })
        }
    };

    $scope.deleteTodo = function(target) {
        Todo.delete(target);
    };
}]);

todocatControllers.controller('TodoDetailCtrl', ['$scope', '$routeParams', 'Todo', function($scope, $routeParams, Todo) {
    Todo.get({_id: $routeParams.todoId}, function(data) {
    })
}]);
