'use strict';

angular.module('afisha').directive('cityCell', ['$state',
   function($state) {
   return {
       restrict: 'E',
       templateUrl: 'templates/directives/city-cell.directive.html',
       scope: {
           city: '=',
           current: '@'
       },
       link: function (scope, element, attr) {
           scope.openCity = function (city) {
               $state.go('cinemas', {
                   cityId: city.id
               });
           };
       }
   };
}]);
