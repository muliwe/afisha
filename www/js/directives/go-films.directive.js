'use strict';

angular.module('afisha').directive('goFilms', ['$state',
    function($state) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.on('click', function () {
                // window.open(encodeURI('https://www.youtube.com/watch?v=E_UcsvWmB5g'), '_system');
                $state.go('index');
            });
        }
    };
}]);
