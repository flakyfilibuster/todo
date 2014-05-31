'use strict';

/* Directives */

var todocatDirectives = angular.module('todocatDirectives', ['ngSanitize']);

todocatDirectives.directive("ffEditable", function() {
    var editTemplate = '<textarea title="double-click to save me!"id="todo-notes-textarea" ng-show="isEditMode" ng-dblclick="switchToPreview($event); saveNotes(selected, $event)" cols="30" rows="10"></textarea>';
    var previewTemplate = '<div title="double-click to edit me!" class="ff-editable panel" ng-hide="isEditMode" ng-dblclick="switchToEdit($event)" ng-bind-html="selected.notes"></div>';

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
                    '<li><i class="fa fa-heart"></i>Personal</li>'+
                    '<li><i class="fa fa-briefcase"></i>Work</li>'+
                    '<li><i class="fa fa-exclamation-triangle"></i>Important</li>'+
                  '</ul>',
        link: function(scope, element, attrs) {
            scope.category = 'all';

            scope.clickMe = function(input) {
                if(input.target.classList.contains("active")) {
                    return;
                }

                var angEl = angular.element(input.target);
                scope.category = angEl.text().toLowerCase();

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

todocatDirectives.directive("ffTodoform", function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/todo-input-form.html',
        link: function(scope, element, attrs) {
            scope.formData.category = "personal";
        }
    };
});


todocatDirectives.directive("ffTodoitem", function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/todo-item.html',
        link: function(scope, element, attrs) {
        }
    };
});

todocatDirectives.directive("ffDnd", function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on("dragstart", function(e) {
                e.dataTransfer.setData("id", attrs.id);
            });
            element.on("drop", function(e) {
                var droptarget = e.target.dataset.id,
                    dragobject = e.dataTransfer.getData("id");

                // todo can't be slave of itself
                if(dragobject === droptarget) {
                    alert("Todo can't be slave of itself");
                    return;
                }

                scope.slaveTask(dragobject, droptarget);
            });
            element.on("dragover", function(e) {
                e.preventDefault();
            })
        }
    };
});

todocatDirectives.directive("ffTodoslave", function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/todo-slave.html',
        link: function(scope, element, attrs) {
        }
    };
});

todocatDirectives.directive("ffBtngroup", function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="ff-btn-group"><i class="fa fa-times" ng-click="close()"></i><i class="fa fa-minus" ng-click="minimize()"></i></div>',
        link: function($scope, $element, $attrs) {
            $scope.close = function() {
                $scope.nwWin.close();
            };

            $scope.minimize = function() {
                $scope.nwWin.minimize();
            };
        }
    };
});

todocatDirectives.directive("ffSlide", function($document) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            var direction = $attrs.ffSlide;
            var $opener = angular.element($element[0].querySelector('.absolute-icon'));
            $opener.bind('click', function() {
                if ($scope.selected) {
                    $element.toggleClass('slide-left');
                    $opener.toggleClass('close-details');
                }
            })
        }
    }

})

