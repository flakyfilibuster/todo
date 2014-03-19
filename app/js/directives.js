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
        template: '<ul class="side-nav"><li class="active">All</li><li>Personal</li><li>Work</li><li>Important</li></ul>',
        link: function(scope, element, attrs) {
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
