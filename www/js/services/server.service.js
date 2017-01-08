"use strict";

angular.module('afisha').service('serverService', function($http, common, helperService) {
    let self = this;

    self.fetchCities = (cb) => {
        if (common.cache.cities) {
            return cb(null, common.cache.cities);
        }

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
        self.fetchCities((err, cities) => {
            self.fetchCinemas((err, cinemas) => {
                cb((cities || []).filter(city => city.id === cityId)[0] || {},
                    (cinemas || []).filter(cinema => cinema.city === cityId))
            });
        });
    };

    self.fetchCinema = (cinemaId, cb) => {
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
});

function successCallback(response, exec, cb) {
    if (!response.data.originalUrl) {
        cb(null, exec(response));
    } else {
        cb('Wrong url', null);
    }
}

function errorCallback(response, cb) {
    cb(response.data || 'Request failed', null);
}
