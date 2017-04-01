'use strict';

angular.module('afisha').controller('FilmController',
    ['$scope', '$state', '$stateParams', 'common', 'serverService', 'helperService',
    function($scope, $state, $stateParams, common, serverService, helperService) {
        $scope.film = {};
        $scope.filmId = +$stateParams.filmId;
        $scope.city = common.currentCity;
        $scope.date = common.currentDate;
        $scope.dataLoaded = false;
        $scope.cinemas = [];
        $scope.savedCinemas = [];

        $scope.getFilm = function() {
            $scope.film = {};
            serverService.fetchFilm($scope.filmId, $scope.city.id, (err, film) => {
                film  = film || {};

                (film.shows || []).forEach(helperService.showConfigure);
                film.shows = (film.shows || []).sort(helperService.sortByTime);
                film.anons = helperService.prepareAnons(film.anons);

                $scope.film = film;

                $scope.refreshDate($scope.date);
                $scope.dataLoaded = true;
            });
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

        $scope.refreshDate = function(date) {
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

            ($scope.film && $scope.film.shows || []).filter(show => show.date === dateString).forEach(show => {
                if (!haveCinema[show.cinema]) {
                    haveCinema[show.cinema] = true;
                    cinemas.push(cinemaHash[show.cinema]);
                }
                cinemaHash[show.cinema].shows.push(show);
            });

            cinemas = cinemas.sort(helperService.sortByTitle);

            $scope.splitCinemas(cinemas);
        };

        $scope.openFilm = function() {
            $state.go('film', {
                filmId: film.id
            });
        };
    }
]);
