'use strict';

/* Directives */

var todoDirectives = angular.module('todoDirectives', ['ngSanitize']);

todoDirectives.directive('ffEditable', function() {
    var editTemplate = '<textarea title="double-click to save me!"id="todo-notes-textarea" ng-show="isEditMode" ng-dblclick="switchToPreview($event); saveNotes(selected, $event)" cols="30" rows="10" autofocus></textarea>';
    var previewTemplate = '<div title="double-click to edit me!" class="ff-editable panel" ng-hide="isEditMode" ng-dblclick="switchToEdit($event)" ng-bind-html="selected.notes"></div>';

    return {
        restrict: 'E',
        compile: function($tElement, $tAttrs, $transclude) {
            $tElement.html(editTemplate);
            var $previewElement = angular.element(previewTemplate);
            $tElement.append($previewElement);

            return function($scope, $element, $attrs) {
                $scope.isEditMode = false;

                $scope.switchToPreview = function(ev) {
                    $previewElement.html(ev.target.value.replace(/\n/g, '<br>'));
                    $scope.isEditMode = false;
                };

                $scope.switchToEdit = function(ev) {
                    $element[0].children[0].value = ev.target.innerHTML.replace(/<br>/g,'\n');
                    $scope.isEditMode = true;
                };
            };
        }
    };
});

todoDirectives.directive("ffSidenav", function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/todo-sidenav.html',
        link: function($scope, $element, $attrs) {
            $scope.category = 'all';

            $scope.clickMe = function(input) {
                var $tEl = angular.element(input.target);
                if ($tEl.hasClass('active')) {
                    return;
                }

                $scope.category = $tEl.text().toLowerCase();

                // iterate over all element children for 'active' class
                [].forEach.call($element.children(), function(child) {
                    if (child.classList.contains('active')) {
                        child.classList.remove('active');
                        $tEl.addClass('active');
                        return;
                    }
                });
            };
        }
    };
});

todoDirectives.directive('ffTodoform', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/todo-input-form.html',
        link: function($scope, $element, $attrs) {
            $scope.formData.category = 'personal';
        }
    };
});


todoDirectives.directive('ffTodoitem', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/todo-item.html',
        link: function($scope, $element, $attrs) {
        }
    };
});

todoDirectives.directive('ffDnd', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs) {
            $element.on('dragstart', function(e) {
                e.dataTransfer.setData('id', $attrs.id);
                $element.addClass('dragging');
            });

            $element.on('dragend', function(e) {
                $element.removeClass('dragging');
            });

            $element.on('drop', function(e) {
                var droptarget = e.target.dataset.id,
                    dragobject = e.dataTransfer.getData('id');

                // todo can't be slave of itself
                if(dragobject === droptarget) {
                    alert('Todo can\'t be slave of itself');
                    return;
                }

                $scope.slaveTask(dragobject, droptarget);
            });
            $element.on('dragover', function(e) {
                e.preventDefault();
            });
        }
    };
});

todoDirectives.directive('ffTodoslave', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/todo-slave.html',
        link: function($scope, $element, $attrs) {
        }
    };
});

todoDirectives.directive('ffBtngroup', function($window) {

    return {
        restrict: 'E',
        replace: true,
        template: '<div class="ff-btn-group"><i class="fa fa-times" ng-click="close()"></i><i class="fa fa-minus" ng-click="minimize()"></i></div>',
        link: function($scope, $element, $attrs) {
            // get nodewebkit window object
            $scope.nwWin = $window.gui.Window.get();

            $scope.close = function() {
                $scope.nwWin.close();
            };

            $scope.minimize = function() {
                $scope.nwWin.minimize();
            };
        }
    };
});

todoDirectives.directive('ffSlide', function($document) {
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
            });
        }
    };

});

