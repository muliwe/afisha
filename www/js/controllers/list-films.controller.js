'use strict';

angular.module('afisha').controller('ListFilmsController',
    ['$scope', '$state', 'common', 'serverService',
    function($scope, $state, common, serverService) {
        $scope.films = [];

        $scope.currentCity = null;

        $scope.getCitiesList = function(city) {
            $scope.films = [];
            serverService.fetchFilms(city, (err, films) => {
                $scope.films = films;
            });
        };

        $scope.refreshList = function() {
            $scope.getCitiesList(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.openFilm = function(film) {
            $state.go('film', {
                filmId: film.id
            });
        };

        $scope.toggleCity = function() {
            $scope.currentCity = $scope.currentCity ? null : common.currentCity;
            $scope.getCitiesList($scope.currentCity);
        };

        $scope.toggleCity();
    }
]);
