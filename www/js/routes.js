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

            .state('cities', {
                url: '/cities',
                controller: 'ListCitiesController',
                templateUrl: 'templates/views/list-cities.view.html'
            })

            .state('cinemas', {
                url: '/city/:cityId',
                controller: 'ListCinemasController',
                templateUrl: 'templates/views/list-cinemas.view.html'
            })

            .state('film', {
                url: '/film/:filmId',
                controller: 'FilmController',
                templateUrl: 'templates/views/film.view.html'
            })

            .state('cinema', {
                url: '/cinema/:cinemaId',
                controller: 'CinemaController',
                templateUrl: 'templates/views/cinema.view.html'
            })

            .state('cinemasmap', {
                url: '/citymap/:cityId',
                controller: 'ListCinemasController',
                templateUrl: 'templates/views/map.view.html'
            })

            .state('filmmap', {
                url: '/filmmap/:filmId',
                controller: 'FilmController',
                templateUrl: 'templates/views/map.view.html'
            })

            .state('cinemamap', {
                url: '/cinemamap/:cinemaId',
                controller: 'CinemaController',
                templateUrl: 'templates/views/map.view.html'
            })

        ;
    }
]);
