'use strict';

angular.module('afisha').directive('cinemaCell', ['$state',
   function($state) {
   return {
       restrict: 'E',
       templateUrl: 'templates/directives/cinema-cell.directive.html',
       scope: {
           cinema: '=',
           city: '='
       },
       link: function (scope, element, attr) {
       }
   };
}]);
