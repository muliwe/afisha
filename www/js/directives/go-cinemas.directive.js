'use strict';

angular.module('afisha').directive('goCinemas', ['$state', 'common',
    function($state, common) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on('click', function () {
                $state.go('cinemas', {cityId: common.currentCity.id});
            });
        }
    };
}]);
