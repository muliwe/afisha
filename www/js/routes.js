'use strict';

//Setting up route
angular.module('afisha').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('index', {
                url: '/',
                controller: 'ListFilmsController',
                templateUrl: 'templates/views/list-films.view.html'
            })

            .state('film', {
                url: '/film/:filmId',
                controller: 'FilmController',
                templateUrl: 'templates/views/film.view.html'
            })
            ;
    }
]);
