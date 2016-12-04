'use strict';

angular.module('afisha').controller('CinemaController',
    ['$scope', '$state', '$stateParams', 'common', 'localStorageService',
    function($scope, $state, $stateParams, common, localStorageService) {
        $scope.films = [
            {"id":1,"title":"Доктор Стрэндж","age":"16","shows":58274,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1609/28/160928110516678.jpg", "anons": "Главная героиня общается с инопланетянами и вспоминает погибшую дочь"},
            {"id":2,"title":"Инферно","age":"16","shows":5843,"poster":"http://s2.kassa.rl0.ru/StaticContent/P/Img/1610/11/161011103842547.jpg", "anons": "Профессор Лэнгдон снова спасает мир"},
            {"id":3,"title":"Расплата","age":"18","shows":17005,"poster":"http://s2.kassa.rl0.ru/StaticContent/P/Img/1610/20/161020175830989.jpg", "anons": "Аутический триллер про криминального бухгалтера"},
            {"id":4,"title":"Джек Ричер 2: Никогда не возвращайся","age":"16","shows":4139,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1610/04/161004151752356.jpg", "anons": "Проходной боевик с Крузом"},
            {"id":5,"title":"Ледокол","age":"12","shows":19312,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1610/04/161004152034277.jpg", "anons": "Советские моряки против айсберга"},
            {"id":6,"title":"Дуэлянт","age":"16","shows":1600,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1609/08/160908104500630.jpg", "anons": "Сложносочинённая роосийская костюмная дама о проклятии в позапрошлом веке"}
        ];

        $scope.cities = [
            {"id":2,"title":"Москва","latitude":55.7495307478992,"longitude":37.6213073730469},
            {"id":3,"title":"Санкт-Петербург","latitude":59.9281838236965,"longitude":30.3236389160156},
            {"id":2577,"title":"Реутов","latitude":55.7612474656641,"longitude":37.8666889965847},
            {"id":13,"title":"Ставрополь","latitude":45.0444187043641,"longitude":41.9773864746094},
            {"id":2605,"title":"Стерлитамак","latitude":53.6446378248565,"longitude":55.9589080698788},
            {"id":2103,"title":"Липецк","latitude":52.6034645546207,"longitude":39.6029663085938},
            {"id":2394,"title":"Мытищи","latitude":55.9161146016564,"longitude":37.7449035644529},
            {"id":338,"title":"Краснодар","latitude":45.0429632204314,"longitude":38.9801788330078}
        ];

        $scope.cinemas = [
            {"id":298,"title":"Каро 9 Атриум","address":"Земляной Вал, 33, ТРК «Атриум»","latitude":55.757223,"longitude":37.658958,"metro":"Курская, Чкаловская","rate":3.6,"city":2},
            {"id":68122,"title":"Мираж Синема Арбат","address":"Артема, 96, ТЦ «Арбат»","latitude":53.623129,"longitude":55.901976,"metro":"","rate":0.0,"city":2605}
        ];

        $scope.cinema = {};
        $scope.city = {};
        $scope.cinemaId = +$stateParams.cinemaId;

        $scope.getCinema = function(){
            $scope.cinema = $scope.cinemas.filter(cinema => cinema.id === $scope.cinemaId)[0] || $scope.cinema;
            $scope.city = $scope.cities.filter(city => city.id === $scope.cinema.city)[0] || $scope.city;
            canRecount();
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
