'use strict';

angular.module('afisha').directive('calendarNav', ['$state', 'common', '$rootScope',
   function($state, common, $rootScope) {
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
           let date = scope.date.getTime() > new Date('2017-02-12').getTime() ? new Date('2017-02-12') :
               // (scope.date.getTime() < new Date().getTime() ? new Date() :
               new Date(scope.date);

           scope.changeDate = function (newDate) {
               if (newDate && common.currentDate !== newDate) {
                   $rootScope.$emit('reconfiguring:show');
                   common.currentDate = newDate;
                   scope.date = common.currentDate;

                   setTimeout(() => {
                       scope.change(newDate);
                       $rootScope.$emit('reconfiguring:hide');
                   }, 0);
               } else {
                   scope.change(newDate);
               }
           };

           // @todo remove hardcoded date
           scope.changeDate(scope.date.getTime() > new Date('2017-02-18').getTime() ? new Date(date) :
               // scope.date.getTime() < new Date().getTime() ? new Date() :
               new Date(scope.date)
           );

           for (let i = 0; i < 7; i++) {
               scope.dates.push(new Date(date));
               date.setDate(date.getDate() + 1);
           }
       }
   };
}]);
