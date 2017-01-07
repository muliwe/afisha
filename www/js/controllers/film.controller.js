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
                    show.timeParsed = show.time;
                    show.timeParsed = show.timeParsed.replace(':', '');
                    show.timeParsed = parseInt(show.timeParsed, 10);
                    show.timeParsed = show.timeParsed > 600 ? show.timeParsed : show.timeParsed + 2400;
                    show.timeClass = show.timeParsed > 1850 && show.timeParsed < 2300 ? 'more' : (
                        show.timeParsed < 1400 ? 'less' : '');
                });

                $scope.film = film || {};

                $scope.refreshDate($scope.date);
            });
        };

        $scope.refreshDate = function(date) {
            const dateString = new Date(date).toISOString().replace(/T.*$/, '');
            let haveCinema = {};
            let cinemas = [];

            $scope.cinemas = [];
            $scope.cinemaHash = {};

            ($scope.film.cinemas || []).forEach(cinema => {
                $scope.cinemaHash[cinema.id] = cinema;
                $scope.cinemaHash[cinema.id].shows = [];
            });

            // console.log(dateString);

            ($scope.film && $scope.film.shows || []).forEach(show => {
                if (show.date === dateString) {
                    if (!haveCinema[show.cinema]) {
                        haveCinema[show.cinema] = true;
                        cinemas.push($scope.cinemaHash[show.cinema]);
                    }
                    $scope.cinemaHash[show.cinema].shows.push(show);
                }
            });

            cinemas = cinemas.sort((a, b) => {
                if (a.title < b.title) return -1;
                if (a.title > b.title) return 1;
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
