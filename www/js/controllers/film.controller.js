'use strict';

angular.module('afisha').controller('FilmController',
    ['$scope', '$state', '$stateParams', 'common', 'serverService',
    function($scope, $state, $stateParams, common, serverService) {
        $scope.film = {};
        $scope.filmId = +$stateParams.filmId;
        $scope.city = common.currentCity;
        $scope.date = common.currentDate;
        $scope.cinemas = [];

        $scope.getFilm = function() {
            $scope.film = {};
            serverService.fetchFilm($scope.filmId, $scope.cityId, (err, film) => {
                $scope.film = film || {};
                $scope.refreshDate($scope.date);
            });
        };

        $scope.refreshDate = function(date) {
            $scope.cinemas = $scope.film && $scope.film.cinemas;
        };

        $scope.openFilm = function() {
            $state.go('film', {
                filmId: film.id
            });
        };
    }
]);
