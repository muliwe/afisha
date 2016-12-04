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
        }).then(function successCallback(response) {
            if (!response.data.originalUrl) {
                common.cache.cities = response.data.sort(function(a, b){
                    if(a.title < b.title) return -1;
                    if(a.title > b.title) return 1;
                    return 0;
                });
                cb(null, common.cache.cities);
            } else {
                cb('Wrong url', []);
            }
        }, function errorCallback(response) {
            cb(response.data || 'Request failed', []);
        });
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
        }).then(function successCallback(response) {
            if (!response.data.originalUrl) {
                common.cache.cinemas = response.data.sort(function(a, b){
                    if(a.title < b.title) return -1;
                    if(a.title > b.title) return 1;
                    return 0;
                });
                cb(null, common.cache.cinemas);
            } else {
                cb('Wrong url', []);
            }
        }, function errorCallback(response) {
            cb(response.data || 'Request failed', []);
        });
    };

    self.fetchCity = (cityId, cb) => {
        self.fetchCities((err, cities) => {
            self.fetchCinemas((err, cinemas) => {
                cb(cities.filter(city => city.id === cityId)[0] || {},
                    cinemas.filter(cinema => cinema.city === cityId))
            });
        });
    };
});
