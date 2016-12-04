'use strict';

angular.module('afisha').controller('ListCinemasController',
    ['$scope', '$state', '$stateParams', 'serverService',
    function($scope, $state, $stateParams, serverService) {
        $scope.cities = [];

        $scope.cinemas = [
            {"id":298,"title":"Каро 9 Атриум","address":"Земляной Вал, 33, ТРК «Атриум»","latitude":55.757223,"longitude":37.658958,"metro":"Курская, Чкаловская","rate":3.6,"city":2},
            {"id":68122,"title":"Мираж Синема Арбат","address":"Артема, 96, ТЦ «Арбат»","latitude":53.623129,"longitude":55.901976,"metro":"","rate":0.0,"city":2605}
        ];

        $scope.city = {};
        $scope.cityId = +$stateParams.cityId;

        $scope.getCityCinemas = function(){
            serverService.fetchCities((err, cities) => {
                $scope.cities = cities;
                $scope.city = $scope.cities.filter(city => city.id === $scope.cityId)[0] || {};
                $scope.cities = $scope.cities.filter(city => city.id !== $scope.cityId)
            });
        };

        $scope.openCinema= function (cinema) {
            $state.go('cinema', {
                cinemaId: cinema.id
            });
        };
    }
]);
