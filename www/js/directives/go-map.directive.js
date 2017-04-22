'use strict';

angular.module('afisha').directive('goMap', ['$state', '$ionicModal',
    function($state, $ionicModal) {
    return {
        restrict: 'E',
        templateUrl: 'templates/popovers/open.popover.html',
        scope: {
            items: '@'
        },
        link: function (scope, element, attr) {
            scope.popover = null;

            scope.openPopover = e => {
                if (scope.popover) {
                    scope.popover.remove();
                }

                $ionicModal.fromTemplateUrl('templates/popovers/maps.popover.html', {
                    scope,
                    animation: 'fade-in'
                }).then(aPopover => {
                    scope.popover = aPopover;
                    scope.popover.show(e);
                });
            };

            scope.closePopover = () => {
                scope.popover.remove();
                scope.popover = null;
            };

            //Cleanup the popover when we're done with it!
            scope.$on('$destroy', () => {
                scope.popover.remove();
            });

            // Execute action on hidden popover
            scope.$on('popover.hidden', () => {
                // Execute action
            });

            // Execute action on remove popover
            scope.$on('popover.removed', () => {
                // Execute action
            });
        }
    };
}]);
