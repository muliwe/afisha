'use strict';

angular.module('afisha').directive('filmCell', ['$state',
    function($state) {
   return {
       restrict: 'E',
       templateUrl: 'templates/directives/film-cell.directive.html',
       scope: {
           title: '@title',
           film: '='
       },
       link: function (scope, element, attr) {
           scope.openFilm = function (film) {
               if (cargo && cargo.id) {
                   $state.go('film', {filmId: film.id});
               } 
           };

       }
   };
}]);
