'use strict';

angular.module('afisha').controller('ListFilmsController',
    ['$scope', '$state', 'common', 'serverService',
    function($scope, $state, common, serverService) {
        $scope.films = [];

        $scope.currentCityOnly = false; // NB: will be toggled
        $scope.currentCity = common.currentCity;

        $scope.getFilmsList = function(city) {
            $scope.films = [];
            serverService.fetchFilms(city, (err, films) => {
                $scope.films = films || [];
            });
        };

        $scope.refreshList = function() {
            $scope.getFilmsList(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.openFilm = function(film) {
            $state.go('film', {
                filmId: film.id
            });
        };

        $scope.toggleChange = () => {
            $scope.currentCityOnly = !$scope.currentCityOnly;
            $scope.getFilmsList($scope.currentCityOnly ? $scope.currentCity : null);
        };

        $scope.toggleChange();
    }
]);
