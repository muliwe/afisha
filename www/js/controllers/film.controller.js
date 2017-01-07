'use strict';

angular.module('afisha').controller('FilmController',
    ['$scope', '$state', '$stateParams', 'common', 'serverService',
    function($scope, $state, $stateParams, common, serverService) {
        $scope.film = {};
        $scope.filmId = +$stateParams.filmId;
        $scope.city = common.currentCity;
        $scope.date = common.currentDate;
        $scope.cinemas = [];
        $scope.cinemaHash = {};

        $scope.getFilm = function() {
            $scope.film = {};
            serverService.fetchFilm($scope.filmId, $scope.city.id, (err, film) => {
                (film && film.shows || []).forEach(show => {
                    show.timeParsed = show.date;
                    show.timeParsed = show.timeParsed.replace(':', '');
                    show.timeParsed = parseInt(show.timeParsed, 10);
                    show.timeParsed = show.timeParsed > 600 ? show.timeParsed : show.timeParsed + 2400;
                });

                $scope.film = film || {};
                $scope.cinemaHash = {};

                ($scope.film.cinemas || []).forEach(cinema => {
                    $scope.cinemaHash[cinema.id] = cinema;
                    $scope.cinemaHash[cinema.id].show = [];
                });

                $scope.refreshDate($scope.date);
            });
        };

        $scope.refreshDate = function(date) {
            const dateString = new Date(date).toISOString().replace(/T.*$/, '');
            let haveCinema = {};
            let cinemas = [];

            ($scope.film && $scope.film.shows || []).forEach(show => {
                if (show.date === dateString && !haveCinema[show.cinema]) {
                    haveCinema[show.cinema] = true;
                    cinemas.push($scope.cinemaHash[show.cinema])
                }
            });

            cinemas = cinemas.sort((a, b) => {
                if (b.shows.length < a.shows.length) return -1;
                if (b.shows.length > a.shows.length) return 1;
                return 0;
            });

            cinemas.forEach(cinema => {
                cinema.shows = cinema.shows.sort((a, b) => {
                    if (a.timeParsed < b.timeParsed) return -1;
                    if (a.timeParsed > b.timeParsed) return 1;
                    return 0;
                });
            });

            $scope.cinemas = cinemas;
        };

        $scope.openFilm = function() {
            $state.go('film', {
                filmId: film.id
            });
        };
    }
]);
