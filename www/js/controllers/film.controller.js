'use strict';

angular.module('afisha').controller('FilmController',
    ['$scope', '$state', '$stateParams', 'common', 'serverService', 'helperService', 'localStorageService',
    function($scope, $state, $stateParams, common, serverService, helperService, localStorageService) {
        $scope.cinemas = [];
        $scope.savedCinemas = [];

        $scope.film = {};
        $scope.filmId = +$stateParams.filmId;
        $scope.city = common.currentCity;
        $scope.date = common.currentDate;
        $scope.dataLoaded = false;
        $scope.sortByTitle = common.sortByTitle;
        $scope.stateTitle = '';

        let cinemaList = [];
        let showList = [];

        $scope.getInfo = () => {
            $scope.film = {};
            serverService.fetchFilm($scope.filmId, $scope.city.id || common.defaultCity.id, (err, film) => {
                let localFilm  = Object.assign({}, film);

                (localFilm.shows || []).forEach(helperService.showConfigure);
                showList = (localFilm.shows || []).sort(helperService.sortByTime);
                delete localFilm.shows;
                localFilm.anons = helperService.prepareAnons(film.anons);

                $scope.film = localFilm;
                $scope.stateTitle = localFilm.title;

                $scope.refreshDate($scope.date);
                $scope.dataLoaded = true;
            });
        };

        $scope.splitCinemas = () => {
            let cinemaIds = common.savedCinemas.map(cinema => cinema.id);

            $scope.cinemas = [];
            $scope.savedCinemas = [];

            let cinemas = [];
            let savedCinemas = [];

            const sortHelper = $scope.sortByTitle ? helperService.sortByTitle : helperService.sortByNear;

            cinemaList.filter(cinema => $scope.sortByTitle || cinema.radius < common.nearRadius)
                .sort(sortHelper)
                .forEach(cinema => {
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

        $scope.refreshDate = date => {
            const dateString = new Date(date).toISOString().replace(/T.*$/, '');
            let haveCinema = {};
            let cinemas = [];
            let cinemaHash = {};

            $scope.date = new Date(date);
            $scope.cinemas = [];
            $scope.savedCinemas = [];

            ($scope.film.cinemas || []).forEach(cinema => {
                cinemaHash[cinema.id] = cinema;
                cinemaHash[cinema.id].shows = [];
            });

            // console.log(dateString);

            (showList || []).filter(show => show.date === dateString).forEach(show => {
                if (!haveCinema[show.cinema]) {
                    haveCinema[show.cinema] = true;
                    cinemas.push(cinemaHash[show.cinema]);
                }
                cinemaHash[show.cinema].shows.push(show);
            });

            cinemaList = cinemas;

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
        };

        $scope.openFilm = () => {
            $state.go('film', {
                filmId: film.id
            });
        };
    }
]);
