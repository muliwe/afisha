'use strict';

angular.module('afisha').directive('filmCell', ['$state',
    function($state) {
   return {
       restrict: 'E',
       templateUrl: 'templates/directives/film-cell.directive.html',
       scope: {
           full: '@full',
           film: '='
       },
       link: function (scope, element, attr) {
           scope.openFilm = function (film) {
               if (film && film.id) {
                   $state.go('film', {filmId: film.id});
               }
           };

       }
   };
}]);
