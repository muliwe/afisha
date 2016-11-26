'use strict';
angular.module('afisha').controller('HomeController',
    ['$scope', 'common', function($scope, common) {
        $scope.cityName = '';

        setCityName();

        $scope.$watch(function() {
            return common.currentCity.title;
        }, setCityName);

        function setCityName() {
            $scope.cityName = common.currentCity.title;
        }
    }
]);
