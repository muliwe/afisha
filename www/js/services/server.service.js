"use strict";

angular.module('afisha').service('serverService', function($http, common, $rootScope, helperService) {
    let self = this;

    self.fetchCities = (cb) => {
        if (common.cache.cities) {
            return cb(null, common.cache.cities);
        }

        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/cities`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                common.cache.cities = response.data.sort(helperService.sortByTitle);

                return common.cache.cities;
            }, cb);
        }, errorResponse => {errorCallback(errorResponse, cb);});
    };

    self.fetchCinemas = (cb) => {
        if (common.cache.cinemas) {
            return cb(null, common.cache.cinemas);
        }

        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/cinemas`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                common.cache.cinemas = response.data.sort(helperService.sortByShows);

                return common.cache.cinemas;
            }, cb);
        }, errorResponse => {errorCallback(errorResponse, cb);});
    };

    self.fetchFilms = (city, cb) => {
        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/films${city ? '/' + city.id : ''}`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                return response.data.sort(helperService.sortByShows);
            }, cb);
        }, errorResponse => {errorCallback(errorResponse, cb);});
    };

    self.fetchFilm = (filmId, cityId, cb) => {
        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/film${filmId ? '/' + filmId : ''}${cityId ? '?showsFor=' + cityId : ''}`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                return response.data;
            }, cb);
        }, errorResponse => {errorCallback(errorResponse, cb);});
    };

    self.fetchCity = (cityId, cb) => {
        $rootScope.$emit('loading:show');
        self.fetchCities((err, cities) => {
            self.fetchCinemas((err, cinemas) => {
                $rootScope.$emit('loading:hide');
                cb((cities || []).filter(city => city.id === cityId)[0] || {},
                    (cinemas || []).filter(cinema => cinema.city === cityId))
            });
        });
    };

    self.fetchCinema = (cinemaId, cb) => {
        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/cinema/${cinemaId}`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                return response.data;
            }, cb);
        }, errorResponse => {errorCallback(errorResponse, cb);});
    };

    function successCallback(response, exec, cb) {
        $rootScope.$emit('loading:hide');
        if (!response.data.originalUrl) {
            cb(null, exec(response));
        } else {
            cb('Wrong url', null);
        }
    }

    function errorCallback(response, cb) {
        $rootScope.$emit('loading:hide');
        cb(response.data || 'Request failed', null);
    }
});
