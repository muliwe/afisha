'use strict';

angular.module('afisha').controller('TicketController',
    ['$scope', '$state', '$stateParams', 'serverService',
    function($scope, $state, $stateParams, serverService) {
        $scope.cinema = {};
        $scope.dataLoaded = false;

        $scope.cinemaId = +$stateParams.cinemaId;
        $scope.showId = +$stateParams.showId;
        $scope.stateTitle = '';

        let localCinema = {};

        $scope.getInfo = () => {
            serverService.fetchCinema($scope.cinemaId, (err, cinema) => {
                if (cinema) {
                    localCinema = Object.assign({}, cinema);
                    $scope.cinema = localCinema;
                    $scope.stateTitle = localCinema.title;
                }

                $scope.dataLoaded = true;
            });
        };
    }
]);
