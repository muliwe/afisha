'use strict';

angular.module('afisha').controller('FilmController',
    ['$scope', '$state', '$stateParams', 'common',
    function($scope, $state, $stateParams, common) {
        $scope.films = [
            {"id":1,"title":"Доктор Стрэндж","age":"16","shows":58274,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1609/28/160928110516678.jpg", "anons": "Главная героиня общается с инопланетянами и вспоминает погибшую дочь"},
            {"id":2,"title":"Инферно","age":"16","shows":5843,"poster":"http://s2.kassa.rl0.ru/StaticContent/P/Img/1610/11/161011103842547.jpg", "anons": "Профессор Лэнгдон снова спасает мир"},
            {"id":3,"title":"Расплата","age":"18","shows":17005,"poster":"http://s2.kassa.rl0.ru/StaticContent/P/Img/1610/20/161020175830989.jpg", "anons": "Аутический триллер про криминального бухгалтера"},
            {"id":4,"title":"Джек Ричер 2: Никогда не возвращайся","age":"16","shows":4139,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1610/04/161004151752356.jpg", "anons": "Проходной боевик с Крузом"},
            {"id":5,"title":"Ледокол","age":"12","shows":19312,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1610/04/161004152034277.jpg", "anons": "Советские моряки против айсберга"},
            {"id":6,"title":"Дуэлянт","age":"16","shows":1600,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1609/08/160908104500630.jpg", "anons": "Сложносочинённая роосийская костюмная дама о проклятии в позапрошлом веке"}
        ];

        $scope.film = {};
        $scope.filmId = +$stateParams.filmId;

        $scope.getFilm = function(){
            $scope.film = $scope.films.filter(film => film.id === $scope.filmId)[0] || {};
        };

        $scope.cinemas = [
            {"id":298,"title":"Каро 9 Атриум","address":"Земляной Вал, 33, ТРК «Атриум»","latitude":55.757223,"longitude":37.658958,"metro":"Курская, Чкаловская","rate":3.6,"city":2},
            {"id":68122,"title":"Мираж Синема Арбат","address":"Артема, 96, ТЦ «Арбат»","latitude":53.623129,"longitude":55.901976,"metro":"","rate":0.0,"city":2605}
        ];

        $scope.city = common.currentCity;
        $scope.date = common.currentDate;

        $scope.openFilm = function () {
            $state.go('film', {
                filmId: film.id
            });
        };
    }
]);
