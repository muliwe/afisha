'use strict';

angular.module('afisha').controller('ListFilmsController',
    ['$scope', '$state', '$ionicModal', '$ionicPopup', '$ionicPopover',
    function($scope, $state, $ionicModal, $ionicPopup, $ionicPopover) {
        $scope.films = [];

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
