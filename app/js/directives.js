'use strict';

/* Directives */

var todocatDirectives = angular.module('todocatDirectives', ['ngSanitize']);

todocatDirectives.directive("flakyEditable", function() {
    var editTemplate = '<textarea title="double-click to save me!"id="todo-notes-textarea" ng-show="isEditMode" ng-dblclick="switchToPreview($event); saveNotes(selected, $event)" cols="30" rows="10"></textarea>';
    var previewTemplate = '<div title="double-click to edit me!" class="flaky-editable panel" ng-hide="isEditMode" ng-dblclick="switchToEdit($event)" ng-bind-html="selected.notes"></div>';

    return {
        restrict: 'E',
        compile: function(tElement, tAttrs, transclude) {
            tElement.html(editTemplate);
            var previewElement = angular.element(previewTemplate);
            tElement.append(previewElement);

            return function(scope, element, attrs) {
                scope.isEditMode = false;

                scope.switchToPreview = function(ev) {
                    previewElement.html(ev.target.value.replace(/\n/g, "<br>"));
                    scope.isEditMode = false;
                };

                scope.switchToEdit = function(ev) {
                    element[0].children[0].value = ev.target.innerHTML.replace(/<br>/g,"\n");
                    scope.isEditMode = true;
                };
            };
        }
    };
});

todocatDirectives.directive("ffSidenav", function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<ul ng-click="clickMe($event)" class="ff-side-nav">'+
                    '<li class="active">All</li>'+
                    '<li class="">Personal</li>'+
                    '<li class="">Work</li>'+
                    '<li class="">Important</li>'+
                  '</ul>',
        link: function(scope, element, attrs) {
            scope.category = 'all'

            scope.clickMe = function(input) {
                if(input.target.classList.contains("active")) {
                    return;
                }

                scope.category = input.target.innerHTML.toLowerCase();

                for (var i=0, len = element[0].children.length; i<len; i++) {
                    if (element[0].children[i].classList.contains("active")) {
                        element[0].children[i].classList.remove("active");
                        input.target.classList.add("active");
                        return;
                    }
                }
            };
        }
    };
});

todocatDirectives.directive("todoform", function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/todo-input-form.html',
        link: function(scope, element, attrs) {
            scope.formData.category = "personal";
        }
    };
});
