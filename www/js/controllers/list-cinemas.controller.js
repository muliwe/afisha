'use strict';

angular.module('afisha').controller('ListCinemasController',
    ['$scope', '$state', '$stateParams',
    function($scope, $state, $stateParams) {
        $scope.cities = [
            {"id":2,"title":"Москва","latitude":55.7495307478992,"longitude":37.6213073730469},
            {"id":3,"title":"Санкт-Петербург","latitude":59.9281838236965,"longitude":30.3236389160156},
            {"id":2577,"title":"Реутов","latitude":55.7612474656641,"longitude":37.8666889965847},
            {"id":13,"title":"Ставрополь","latitude":45.0444187043641,"longitude":41.9773864746094},
            {"id":2605,"title":"Стерлитамак","latitude":53.6446378248565,"longitude":55.9589080698788},
            {"id":2103,"title":"Липецк","latitude":52.6034645546207,"longitude":39.6029663085938},
            {"id":2394,"title":"Мытищи","latitude":55.9161146016564,"longitude":37.7449035644529},
            {"id":338,"title":"Краснодар","latitude":45.0429632204314,"longitude":38.9801788330078}
        ];

        $scope.cinemas = [
            {"id":298,"title":"Каро 9 Атриум","address":"Земляной Вал, 33, ТРК «Атриум»","latitude":55.757223,"longitude":37.658958,"metro":"Курская, Чкаловская","rate":3.6,"city":2},
            {"id":68122,"title":"Мираж Синема Арбат","address":"Артема, 96, ТЦ «Арбат»","latitude":53.623129,"longitude":55.901976,"metro":"","rate":0.0,"city":2605}
        ];

        $scope.city = {};
        $scope.cityId = +$stateParams.cityId;

        $scope.getCityCinemas = function(){
            $scope.city = $scope.cities.filter(city => city.id === $scope.cityId)[0] || {};
        };

        $scope.openCinema= function (cinema) {
            $state.go('cinema', {
                cinemaId: cinema.id
            });
        };
    }
]);
