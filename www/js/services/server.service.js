"use strict";

angular.module('afisha').service('serverService', function($http, common) {
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
                common.cache.cities = response.data.sort(function(a, b){
                    if(a.title < b.title) return -1;
                    if(a.title > b.title) return 1;
                    return 0;
                });

                return common.cache.cities;
            }, cb);
        }, errorCallback);
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
                common.cache.cinemas = response.data.sort((a, b) => {
                    if(a.title < b.title) return -1;
                    if(a.title > b.title) return 1;
                    return 0;
                });

                return common.cache.cinemas;
            }, cb);
        }, errorCallback);
    };

    self.fetchFilms = (city, cb) => {
        $http({
            method: 'GET',
            url: `${common.serverUrl}/films${city ? '/' + city.id : ''}`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                return response.data.sort((a, b) => {
                    if(a.shows < b.shows) return 1;
                    if(a.shows > b.shows) return -1;
                    return 0;
                });
            }, cb);
        }, errorCallback);
    };

    self.fetchCity = (cityId, cb) => {
        self.fetchCities((err, cities) => {
            self.fetchCinemas((err, cinemas) => {
                cb(cities.filter(city => city.id === cityId)[0] || {},
                    cinemas.filter(cinema => cinema.city === cityId))
            });
        });
    };

    self.fetchCinema = (cinemaId, cb) => {
        self.fetchCities((err, cities) => {
            self.fetchCinemas((err, cinemas) => {
                let cinema = cinemas.filter(cinema => cinema.id === cinemaId)[0] || {};
                cb(cinema, cities.filter(city => city.id === cinema.city)[0] || {});
            });
        });
    };
});

function successCallback(response, exec, cb) {
    if (!response.data.originalUrl) {
        cb(null, exec(response));
    } else {
        cb('Wrong url', {});
    }
}

function errorCallback(response, cb) {
    cb(response.data || 'Request failed', {});
}
