'use strict';

angular.module('afisha').controller('ListCinemasController',
    ['$scope', '$state', '$stateParams', 'serverService', 'localStorageService', 'common', 'helperService',
    function($scope, $state, $stateParams, serverService, localStorageService, common, helperService) {
        $scope.cinemas = [];
        $scope.savedCinemas = [];

        $scope.city = {};
        $scope.isCurrentCity = false;
        $scope.cityId = +$stateParams.cityId;
        $scope.currentCity = common.currentCity;
        $scope.sortByTitle = common.sortByTitle;
        $scope.stateTitle = '';

        let cinemaList = [];

        recountCurrentCity();

        $scope.getInfo = () => {
            serverService.fetchCity($scope.cityId, (city, cinemas) => {
                $scope.city = Object.assign({}, city);
                $scope.stateTitle = city.title;
                cinemaList = cinemas || [];

                cinemaList.forEach(cinema => {
                    if (!cinema.latitude || !cinema.longitude ||
                        !common.currentLocation.longitude || !common.currentLocation.latitude) {
                        cinema.radius = common.defaultCinemaRadius;
                        return;
                    }
                    cinema.radius = parseInt(helperService.distance(cinema.longitude, cinema.latitude,
                        common.currentLocation.longitude, common.currentLocation.latitude) + 0.6, 10);
                });

                $scope.splitCinemas();
            });
        };

        $scope.saveCity = () => {
            $scope.currentCity = common.currentCity = $scope.city;
            localStorageService.set('currentCity', JSON.stringify($scope.city));
            recountCurrentCity();
        };

        $scope.splitCinemas = () => {
            let cinemaIds = common.savedCinemas.map(cinema => cinema.id);

            $scope.cinemas = [];
            $scope.savedCinemas = [];

            let cinemas = [];
            let savedCinemas = [];

            const sortHelper = $scope.sortByTitle ? helperService.sortByTitle : helperService.sortByNear;

            cinemaList.filter(cinema => $scope.sortByTitle || cinema.radius < common.nearRadius)
                .sort(sortHelper).forEach(cinema => {
                   if (cinemaIds.includes(cinema.id)) {
                       savedCinemas.push(cinema);
                   } else {
                       cinemas.push(cinema);
                   }
                });

            $scope.cinemas = cinemas;
            $scope.savedCinemas = savedCinemas;
        };

        $scope.toggleSortChange = () => {
            $scope.sortByTitle = !$scope.sortByTitle;
            common.sortByTitle = $scope.sortByTitle;
            localStorageService.set('sortByTitle', JSON.stringify(common.sortByTitle));
            $scope.splitCinemas();
        };

        $scope.openCinema = cinema => {
            $state.go('cinema', {
                cinemaId: cinema.id
            });
        };

        function recountCurrentCity() {
            $scope.isCurrentCity = $scope.city.id && $scope.city.id === $scope.currentCity.id;
        }
    }
]);
