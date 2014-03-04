'use strict';

/* App Module */

var todocatApp = angular.module('todocatApp', [
  'ngRoute',
  'todocatAnimations',
  'todocatControllers',
  'todocatFilters',
  'todocatServices'
]);

todocatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/todos', {
        templateUrl: 'partials/todo-list.html',
        controller: 'TodoListCtrl'
      }).
      when('/todos/:todoId', {
        templateUrl: 'partials/todo-detail.html',
        controller: 'TodoDetailCtrl'
      }).
      otherwise({
        redirectTo: '/todos'
      });
  }]);
