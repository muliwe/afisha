'use strict';

angular.module('afisha').controller('CinemaController',
    ['$scope', '$state', '$stateParams', 'common', 'localStorageService', 'serverService', 'helperService',
    function($scope, $state, $stateParams, common, localStorageService, serverService, helperService) {
        $scope.cinema = {};
        $scope.city = {};
        $scope.films = [];
        $scope.filmsHash = {};

        $scope.cinemaId = +$stateParams.cinemaId;
        $scope.date = common.currentDate;
        $scope.currentCity = common.currentCity;

        canRecount();

        $scope.refreshDate = function(date) {
            const dateString = new Date(date).toISOString().replace(/T.*$/, '');
            let haveFilm = {};
            let films = [];

            $scope.films = [];
            $scope.filmsHash = {};

            ($scope.cinema.films || []).forEach(film => {
                $scope.filmsHash[film.id] = film;
                $scope.filmsHash[film.id].halls = [];
                $scope.filmsHash[film.id].shows = [];
            });

            // console.log(dateString);

            ($scope.cinema.shows || []).forEach(show => {
                if (show.date === dateString) {
                    if (!haveFilm[show.film]) {
                        haveFilm[show.film] = true;
                        films.push($scope.filmsHash[show.film]);
                    }
                    $scope.filmsHash[show.films].shows.push(show);
                }
            });

            films = films.sort(helperService.sortByShows);

            films.forEach(films => {
                let haveHall = {};
                let halls = [];
                let hallHash = {};

                films.shows.forEach(show => {
                    const key = show.hall + show.format;
                    if (!haveHall[key]) {
                        haveHall[key] = true;
                        hallHash[key] = {
                            title: show.hall,
                            format: show.format,
                            shows: []
                        };
                        halls.push(hallHash[key]);
                    }
                    hallHash[key].shows.push(show);
                });

                delete film.shows;
                film.halls = halls.sort(helperService.sortByTitle);
            });


            $scope.films = films;
        };

        $scope.getCinema = function() {
            serverService.fetchCinema($scope.cinemaId, (err, cinema) => {
                if (cinema) {
                    (cinema.shows || []).forEach(helperService.showConfigure);

                    $scope.cinema = cinema;
                    $scope.city = cinema.aCity;
                }

                $scope.refreshDate($scope.date);
                canRecount();
            });
        };

        $scope.saveCinema = function () {
            common.savedCinemas.push($scope.cinema);
            localStorageService.set('savedCinemas', JSON.stringify(common.savedCinemas));
            canRecount();
        };

        $scope.cancelCinema = function () {
            common.savedCinemas = common.savedCinemas.filter(cinema => cinema.id !== $scope.cinemaId);
            localStorageService.set('savedCinemas', JSON.stringify(common.savedCinemas));
            canRecount();
        };

        $scope.saveCity = function () {
            $scope.currentCity = common.currentCity = $scope.city;
            localStorageService.set('currentCity', JSON.stringify($scope.city));
            canRecount();
        };

        $scope.openFilm = function (film) {
            $state.go('film', {
                filmId: film.id
            });
        };

        function canRecount() {
            // console.log($scope.cinema, $scope.city);

            $scope.canSaveCity = $scope.city.id && $scope.cinema.city !== $scope.currentCity.id;

            $scope.canSave = !$scope.canSaveCity &&
                (common.savedCinemas.filter(cinema => cinema.id === $scope.cinemaId)).length === 0;

            $scope.canCancel = !$scope.canSaveCity &&
                (common.savedCinemas.filter(cinema => cinema.id === $scope.cinemaId)).length === 1;

            // console.log($scope.canSaveCity, $scope.canSave, $scope.canCancel);
        }
    }
]);
