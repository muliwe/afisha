'use strict';

angular.module('afisha').directive('calendarNav', ['$state', 'common',
   function($state, common) {
   return {
       restrict: 'E',
       templateUrl: 'templates/directives/calendar-nav.directive.html',
       scope: {
           cinema: '=',
           film: '=',
           date: '='
       },
       link: function (scope, element, attr) {
           scope.dates = [];
           scope.date = common.currentDate;

           let date = scope.date.getDate() > new Date().getDate()? new Date() : new Date(scope.date);
           let more = false;
           for (let i = 0; i < 7; i++) {
               scope.dates.push(new Date(date));
               date.setDate(date.getDate() + 1);
           }

           scope.changeDate = function (date) {
               if (date) {
                   common.currentDate = date;
                   scope.date = common.currentDate;
               }
           };
       }
   };
}]);
