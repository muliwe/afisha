'use strict';

angular.module('afisha').directive('calendarNav', ['$state', 'common',
   function($state, common) {
   return {
       restrict: 'E',
       templateUrl: 'templates/directives/calendar-nav.directive.html',
       scope: {
           cinema: '=',
           film: '=',
           date: '=',
           change: '='
       },
       link: function (scope, element, attr) {
           scope.dates = [];
           scope.date = common.currentDate;

           // @todo remove hardcoded date
           let date = scope.date.getDate() > new Date('2016-11-03').getDate()?
               new Date('2016-11-03') : new Date(scope.date);

           scope.changeDate = function (newDate) {
               if (newDate) {
                   common.currentDate = newDate;
                   scope.date = common.currentDate;
                   scope.change(newDate);
               }
           };

           // @todo remove hardcoded date
           scope.changeDate(scope.date > new Date('2016-11-09') ? date : scope.date);

           for (let i = 0; i < 7; i++) {
               scope.dates.push(new Date(date));
               date.setDate(date.getDate() + 1);
           }
       }
   };
}]);
