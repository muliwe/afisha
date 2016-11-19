'use strict';

angular.module('afisha').controller('ListFilmController',
    ['$scope', '$state', '$ionicModal', '$ionicPopup', '$ionicPopover',
    function($scope, $state, $ionicModal, $ionicPopup, $ionicPopover) {
        /**
         * Common
         */

        $scope.films = [];
                }
                interval = Math.max(Math.floor(seconds / 60), 1);
                return interval + " m";
            }
        }
        // Find a list of Car models
        $scope.getFilmList = function(){
            var resourse = null;

            return resourse;
        };

        $scope.refreshList = function () {
            $scope.getFilmList().$promise.finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

    }

]);
