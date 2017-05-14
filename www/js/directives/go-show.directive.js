'use strict';

angular.module('afisha').directive('goShow', ['$state',
    function($state) {
    return {
        restrict: 'A',
        scope: {
            cinemaId: '=',
            showId: '='
        },
        link: function (scope, element, attr) {
            element.on('click', function () {
                $state.go('ticket', {showId: scope.showId, cinemaId: scope.cinemaId});
            });
        }
    };
}]);
