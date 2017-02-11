'use strict';

angular.module('afisha').controller('ListCinemasController',
    ['$scope', '$state', '$stateParams', 'serverService', 'localStorageService', 'common', 'helperService',
    function($scope, $state, $stateParams, serverService, localStorageService, common, helperService) {
        $scope.cinemas = [];
        $scope.savedCinemas = [];

        $scope.city = {};
        $scope.cityId = +$stateParams.cityId;
        $scope.currentCity = common.currentCity;
        $scope.isCurrentCity = false;

        recountCurrentCity();

        $scope.getCityCinemas = function(){
            serverService.fetchCity($scope.cityId, (city, cinemas) => {
                $scope.city = city;
                $scope.splitCinemas(cinemas);
            });
        };

        $scope.saveCity = function () {
            $scope.currentCity = common.currentCity = $scope.city;
            localStorageService.set('currentCity', JSON.stringify($scope.city));
            recountCurrentCity();
        };

        $scope.splitCinemas = function (cinemas) {
            let cinemaIds = common.savedCinemas.map(cinema => cinema.id);

            $scope.cinemas = [];
            $scope.savedCinemas = [];

            cinemas.sort(helperService.sortByTitle).forEach(cinema => {
               if (cinemaIds.includes(cinema.id)) {
                   $scope.savedCinemas.push(cinema);
               } else {
                   $scope.cinemas.push(cinema);
                }
            });
        };

        $scope.openCinema = function (cinema) {
            $state.go('cinema', {
                cinemaId: cinema.id
            });
        };

        function recountCurrentCity() {
            $scope.isCurrentCity = $scope.city.id && $scope.city.id === $scope.currentCity.id;
        }
    }
]);
