'use strict';
/* App Module */

var todoApp = angular.module('todoApp', [
    'ngRoute',
    'todoControllers',
    'todoFilters',
    'todoDirectives',
    'todoServices'
]);

todoApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/todo-list.html',
                controller: 'TodoListCtrl'
            });
    }
]);
