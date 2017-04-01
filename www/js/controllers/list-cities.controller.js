'use strict';

angular.module('afisha').controller('ListCitiesController',
    ['$scope', '$state', 'common', 'serverService', 'localStorageService', 'helperService',
    function($scope, $state, common, serverService, localStorageService, helperService) {
        $scope.cities = [];

        $scope.currentCity = common.currentCity;
        $scope.city = common.currentCity;
        $scope.sortByTitle = common.sortByTitle;

        let cityList = [];

        $scope.getFilmsList = function() {
            serverService.fetchCities((err, cities) => {
                cityList = cities || [];
                cityList.forEach(city => {
                    if (!city.latitude || !city.longitude) {
                        city.radius = common.defaultCityRadius;
                        return;
                    }
                    city.radius = helperService.distance(city.longitude, city.latitude,
                        common.currentLocation.longitude, common.currentLocation.latitude);
                });

                $scope.refreshList();
            });
        };

        $scope.refreshList = function() {
            // $scope.getFilmsList(function() {
            //     $scope.$broadcast('scroll.refreshComplete');
            // });

            const sortHelper = $scope.sortByTitle ? helperService.sortByTitle : helperService.sortByNear;

            $scope.city = cityList.filter(city => city.id === $scope.currentCity.id)[0] || {};
            $scope.cities = cityList.filter(city => city.id !== $scope.currentCity.id && (
                $scope.sortByTitle || city.radius < common.maxRadius
            )).sort(sortHelper);
        };

        $scope.toggleSortChange = () => {
            $scope.sortByTitle = !$scope.sortByTitle;
            common.sortByTitle = $scope.sortByTitle;
            localStorageService.set('sortByTitle', JSON.stringify(common.sortByTitle));
            $scope.refreshList();
        };

        $scope.openCity = function (city) {
            $state.go('cinemas', {
                cityId: city.id
            });
        };
    }
]);
