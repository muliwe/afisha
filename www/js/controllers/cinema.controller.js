'use strict';

angular.module('afisha').controller('CinemaController',
    ['$scope', '$state', '$stateParams', 'common', 'localStorageService', 'serverService', 'helperService',
    function($scope, $state, $stateParams, common, localStorageService, serverService, helperService) {
        $scope.cinema = {};
        $scope.city = {};
        $scope.films = [];
        $scope.dataLoaded = false;
        $scope.useHalls = common.useHalls;

        $scope.cinemaId = +$stateParams.cinemaId;
        $scope.date = common.currentDate;
        $scope.currentCity = common.currentCity;

        let localCinema = {};
        let showList = [];

        canRecount();

        $scope.refreshDate = function(date) {
            const dateString = new Date(date).toISOString().replace(/T.*$/, '');
            let haveFilm = {};
            let films = [];
            let filmsHash = {};

            $scope.films = [];
            $scope.date = new Date(date);

            ($scope.cinema.films || []).forEach(film => {
                filmsHash[film.id] = film;
                filmsHash[film.id].halls = [];
                filmsHash[film.id].shows = [];
            });

            // console.log(dateString);

            (showList || []).filter(show => show.date === dateString).forEach(show => {
                if (!haveFilm[show.film]) {
                    haveFilm[show.film] = true;
                    films.push(filmsHash[show.film]);
                }
                filmsHash[show.film].shows.push(show);
            });

            films = films.sort(helperService.sortByShows);

            films.forEach(film => {
                let haveHall = {};
                let halls = [];
                let hallHash = {};

                const defaultHallTitle = '';

                film.shows.forEach(show => {
                    const key = ($scope.useHalls ? show.hall : 'defaultHall') + show.format;
                    if (!haveHall[key]) {
                        haveHall[key] = true;
                        hallHash[key] = {
                            title: ($scope.useHalls ? show.hall : defaultHallTitle),
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
                    localCinema = Object.assign({}, cinema);
                    (localCinema.shows || []).forEach(helperService.showConfigure);
                    showList = (localCinema.shows  || []).sort(helperService.sortByTime);

                    delete localCinema.shows;

                    if (!localCinema.latitude || !localCinema.longitude ||
                        !common.currentLocation.longitude || !common.currentLocation.latitude) {
                        localCinema.radius = common.defaultCinemaRadius;
                    } else {
                        localCinema.radius =
                            parseInt(helperService.distance(localCinema.longitude, localCinema.latitude,
                            common.currentLocation.longitude, common.currentLocation.latitude) + 0.6, 10);
                    }

                    $scope.cinema = localCinema;
                    $scope.city = cinema.aCity;
                }

                $scope.refreshDate($scope.date);
                canRecount();
                $scope.dataLoaded = true;
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

        $scope.toggleChange = () => {
            $scope.useHalls = !$scope.useHalls;
            common.useHalls = $scope.useHalls;
            localStorageService.set('useHalls', JSON.stringify(common.useHalls));
            $scope.refreshDate($scope.date);
        };

        $scope.openFilm = function (film) {
            $state.go('film', {
                filmId: film.id
            });
        };

        function canRecount() {
            // console.log($scope.cinema, $scope.city);

            $scope.canSaveCity = $scope.city.id && $scope.cinema.city !== $scope.currentCity.id;

            $scope.isSaved = (common.savedCinemas.filter(cinema => cinema.id === $scope.cinemaId)).length === 1;

            $scope.canSave = !$scope.canSaveCity &&
                (common.savedCinemas.filter(cinema => cinema.id === $scope.cinemaId)).length === 0;

            $scope.canCancel = !$scope.canSaveCity &&
                (common.savedCinemas.filter(cinema => cinema.id === $scope.cinemaId)).length === 1;

            // console.log($scope.canSaveCity, $scope.canSave, $scope.canCancel);
        }
    }
]);
