'use strict';

angular.module('afisha').controller('ListCitiesController',
    ['$scope', '$state', 'common', 'serverService',
    function($scope, $state, common, serverService) {
        $scope.cities = [];

        $scope.currentCity = common.currentCity;
        $scope.city = common.currentCity;

        $scope.getCitiesList = function(){
            serverService.fetchCities((err, cities) => {
                $scope.cities = cities || [];
                $scope.city = $scope.cities.filter(city => city.id === $scope.currentCity.id)[0] || {};
                $scope.cities = $scope.cities.filter(city => city.id !== $scope.currentCity.id);
            });
        };

        $scope.refreshList = function() {
            $scope.getCitiesList(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.openCity = function (city) {
            $state.go('cinemas', {
                cityId: city.id
            });
        };
    }
]);
