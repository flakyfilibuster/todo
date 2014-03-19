'use strict';

/* App Module */

var todocatApp = angular.module('todocatApp', [
  'ngRoute',
  'todocatAnimations',
  'todocatControllers',
  'todocatFilters',
  'todocatDirectives',
  'todocatServices'
]);

todocatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/todo-list.html',
        controller: 'TodoListCtrl'
      });
  }]);
