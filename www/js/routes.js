'use strict';

//Setting up route
angular.module('afisha').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/list/films');

        // Car models state routing
        $stateProvider
            .state('list', {
                abstract: true,
                url: '/list',
                controller: 'ListsController',
                templateUrl: 'templates/views/lists.view.html'
            })
            .state('list.films', {
                url: '/films',
                templateUrl: 'templates/views/list-film.view.html'
            })
            .state('film', {
                abstract: true,
                url: '/film/:filmId',
                controller: 'FilmController',
                templateUrl: 'templates/views/film.view.html'
            })
    }
]);
