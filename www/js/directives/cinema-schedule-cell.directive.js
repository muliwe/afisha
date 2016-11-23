'use strict';

angular.module('afisha').directive('cinemaScheduleCell', ['$state',
    function($state) {
   return {
       restrict: 'E',
       templateUrl: 'templates/directives/cinema-schedule-cell.directive.html',
       scope: {
           byHalls: '@byHalls',
           cinema: '=',
           film: '=',
           oneFilm: '@oneFilm'
       },
       link: function (scope, element, attr) {
           scope.openCinema = function (cinema) {
               if (cinema && cinema.id) {
                   $state.go('cinema', {cinemaId: cinema.id});
               }
           };
           scope.openFilm = function (film) {
               if (film && film.id) {
                   $state.go('film', {filmId: film.id});
               }
           };
       }
   };
}]);
