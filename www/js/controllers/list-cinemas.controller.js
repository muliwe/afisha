'use strict';

angular.module('afisha').controller('ListCinemasController',
    ['$scope', '$state', '$stateParams', 'serverService', 'localStorageService', 'common',
    function($scope, $state, $stateParams, serverService, localStorageService, common) {
        $scope.cinemas = [
            {"id":298,"title":"Каро 9 Атриум","address":"Земляной Вал, 33, ТРК «Атриум»","latitude":55.757223,"longitude":37.658958,"metro":"Курская, Чкаловская","rate":3.6,"city":2},
            {"id":68122,"title":"Мираж Синема Арбат","address":"Артема, 96, ТЦ «Арбат»","latitude":53.623129,"longitude":55.901976,"metro":"","rate":0.0,"city":2605}
        ];

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
