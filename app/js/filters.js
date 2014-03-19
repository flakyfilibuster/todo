'use strict';

/* Filters */

var todocatFilters = angular.module('todocatFilters', []);

todocatFilters.filter('status', function() {
    return function(todos, scope) {

        function isCompleted(todo) {
            return !!todo.completed;
        }

        function isUncompleted(todo) {
            return !todo.completed;
        }

        if(typeof todos === "object") {
            switch (scope.status) {
                case "completed":
                    return todos.filter(isCompleted);
                case "uncompleted":
                    return todos.filter(isUncompleted);
                case "all":
                    return todos;
                default:
                    return todos;
            }
        }
    };
});

todocatFilters.filter('category', function() {
    return function(todos, scope) {

        if(scope.category === 'all') {
            return todos;
        }

        function isCategory(todo) {
            return (scope.category === todo.category);
        }

        if(typeof todos === "object") {
            return todos.filter(isCategory);
        }
    };
});
