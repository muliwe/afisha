'use strict';

angular.module('afisha').controller('ListCinemasController',
    ['$scope', '$state', '$stateParams', 'serverService', 'localStorageService', 'common',
    function($scope, $state, $stateParams, serverService, localStorageService, common) {
        $scope.cinemas = [];

        $scope.city = {};
        $scope.cityId = +$stateParams.cityId;
        $scope.currentCity = common.currentCity;

        $scope.getCityCinemas = function(){
            serverService.fetchCity($scope.cityId, (city, cinemas) => {
                $scope.city = city;
                $scope.cinemas = cinemas;
            });
        };

        $scope.saveCity = function () {
            $scope.currentCity = common.currentCity = $scope.city;
            localStorageService.set('currentCity', JSON.stringify($scope.city));
        };

        $scope.openCinema= function (cinema) {
            $state.go('cinema', {
                cinemaId: cinema.id
            });
        };
    }
]);
