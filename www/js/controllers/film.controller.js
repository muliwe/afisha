'use strict';

angular.module('afisha').controller('FilmController',
    ['$scope', '$state', '$stateParams', 'common', 'serverService', 'helperService',
    function($scope, $state, $stateParams, common, serverService, helperService) {
        $scope.film = {};
        $scope.filmId = +$stateParams.filmId;
        $scope.city = common.currentCity;
        $scope.date = common.currentDate;
        $scope.cinemas = [];
        $scope.cinemaHash = {};

        $scope.getFilm = function() {
            $scope.film = {};
            serverService.fetchFilm($scope.filmId, $scope.city.id, (err, film) => {
                (film && film.shows || []).forEach(helperService.showConfigure);

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

            cinemas = cinemas.sort(helperService.sortByTitle);

            cinemas.forEach(cinema => {
                cinema.shows = cinema.shows.sort(helperService.sortByTime);
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
