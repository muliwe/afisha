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
           onChange: '&'
       },
       link: function (scope, element, attr) {
           scope.dates = [];
           scope.date = common.currentDate;

           let date = scope.date.getDate() > new Date('2016-11-05').getDate()?
               new Date('2016-11-05') : new Date(scope.date);

           for (let i = 0; i < 7; i++) {
               scope.dates.push(new Date(date));
               date.setDate(date.getDate() + 1);
           }

           scope.changeDate = function (date) {
               if (date) {
                   common.currentDate = date;
                   scope.date = common.currentDate;
                   scope.onChange(date);
               }
           };
       }
   };
}]);
