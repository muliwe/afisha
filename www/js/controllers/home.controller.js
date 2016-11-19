'use strict';
angular.module('afisha').controller('HomeController',
    ['$scope', function($scope) {
        setCityName();

        $scope.$watch(function() {
            return 'Moscow';
        }, setDisplayName);

        function setCityName() {
            $scope.cityName = 'Moscow';
        }
    }
]);
