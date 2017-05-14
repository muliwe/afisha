'use strict';

angular.module('afisha').directive('goMap', ['$state',
    function($state) {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/go-map.directive.html',
        scope: {
            go: '@',
            id: '@'
        },
        link: function (scope, element, attr) {
            const keys = {
                cinemasmap: 'cityId',
                filmmap: 'filmId',
                cinemamap: 'cinemaId'
            };

            element.on('click', function () {
                $state.go(scope.go, {[keys[scope.go] || 'id']: scope.id});});
        }
    };
}]);
