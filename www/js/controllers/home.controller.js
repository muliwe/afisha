'use strict';
angular.module('afisha').controller('HomeController',
    ['$scope', function($scope) {
        setCityName();

        $scope.$watch(function() {
            return 'Moscow';
        }, setCityName);

        function setCityName() {
            $scope.cityName = 'Moscow';
        }
    }
]);
