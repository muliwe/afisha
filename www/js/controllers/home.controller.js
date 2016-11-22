'use strict';
angular.module('afisha').controller('HomeController',
    ['$scope', function($scope) {
        setCityName();

        $scope.$watch(function() {
            return 'Москва';
        }, setCityName);

        function setCityName() {
            $scope.cityName = 'Москва';
        }
    }
]);
