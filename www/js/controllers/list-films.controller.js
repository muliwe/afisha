'use strict';

angular.module('afisha').controller('ListFilmController',
    ['$scope', '$state', '$ionicModal', '$ionicPopup', '$ionicPopover',
    function($scope, $state, $ionicModal, $ionicPopup, $ionicPopover) {
        /**
         * Common
         */

        $scope.films = [];

        // Find a list of Car models
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
