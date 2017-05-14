'use strict';

angular.module('afisha').directive('goCities', ['$state',
    function($state) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on('click', function () {
                $state.go('cities');
            });
        }
    };
}]);
