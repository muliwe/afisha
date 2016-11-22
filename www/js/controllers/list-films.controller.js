'use strict';

angular.module('afisha').controller('ListFilmsController',
    ['$scope', '$state', '$ionicModal', '$ionicPopup', '$ionicPopover',
    function($scope, $state, $ionicModal, $ionicPopup, $ionicPopover) {
        $scope.films = [
            {"id":62465,"title":"Доктор Стрэндж","age":"16","shows":58274,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1609/28/160928110516678.jpg"},
            {"id":58574,"title":"Инферно","age":"16","shows":5843,"poster":"http://s2.kassa.rl0.ru/StaticContent/P/Img/1610/11/161011103842547.jpg"},
            {"id":63803,"title":"Расплата","age":"18","shows":17005,"poster":"http://s2.kassa.rl0.ru/StaticContent/P/Img/1610/20/161020175830989.jpg"},
            {"id":67229,"title":"Джек Ричер-2: Никогда не возвращайся","age":"16","shows":4139,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1610/04/161004151752356.jpg"},
            {"id":65771,"title":"Ледокол","age":"12","shows":19312,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1610/04/161004152034277.jpg"},
            {"id":68159,"title":"Дуэлянт","age":"16","shows":1600,"poster":"http://s1.kassa.rl0.ru/StaticContent/P/Img/1609/08/160908104500630.jpg"}
        ];

        $scope.getFilmList = function(){
            let resourse = null;

            return resourse;
        };

        $scope.refreshList = function () {
            $scope.getFilmList().$promise.finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
    }
]);
