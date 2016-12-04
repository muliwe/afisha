'use strict';

angular.module('afisha').controller('CinemaController',
    ['$scope', '$state', '$stateParams', 'common', 'localStorageService', 'serverService',
    function($scope, $state, $stateParams, common, localStorageService, serverService) {
        $scope.films = [
            {"id":1,"title":"Доктор Стрэндж","age":"16","shows":58274,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1609/28/160928110516678.jpg", "anons": "Главная героиня общается с инопланетянами и вспоминает погибшую дочь"},
            {"id":2,"title":"Инферно","age":"16","shows":5843,"poster":"http://s2.kassa.rl0.ru/StaticContent/P/Img/1610/11/161011103842547.jpg", "anons": "Профессор Лэнгдон снова спасает мир"},
            {"id":3,"title":"Расплата","age":"18","shows":17005,"poster":"http://s2.kassa.rl0.ru/StaticContent/P/Img/1610/20/161020175830989.jpg", "anons": "Аутический триллер про криминального бухгалтера"},
            {"id":4,"title":"Джек Ричер 2: Никогда не возвращайся","age":"16","shows":4139,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1610/04/161004151752356.jpg", "anons": "Проходной боевик с Крузом"},
            {"id":5,"title":"Ледокол","age":"12","shows":19312,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1610/04/161004152034277.jpg", "anons": "Советские моряки против айсберга"},
            {"id":6,"title":"Дуэлянт","age":"16","shows":1600,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1609/08/160908104500630.jpg", "anons": "Сложносочинённая роосийская костюмная дама о проклятии в позапрошлом веке"}
        ];

        $scope.cinema = {};
        $scope.city = {};
        $scope.cinemaId = +$stateParams.cinemaId;

        $scope.getCinema = function(){
            serverService.fetchCinema($scope.cinemaId, (cinema, city) => {
                console.log(cinema, city);
                $scope.cinema = cinema;
                $scope.city = city;
                canRecount();
            });
        };

        $scope.date = common.currentDate;

        $scope.currentCity = common.currentCity;

        canRecount();

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
