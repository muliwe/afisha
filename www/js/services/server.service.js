"use strict";

angular.module('afisha').service('serverService', function($http, common, $rootScope, helperService) {
    let self = this;

    self.fetchCities = (cb) => {
        const key = `cities`;
        if (checkCache(key)) {
            return cb(null, common.cache[key]);
        }

        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/cities`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                const cities = response.data.sort(helperService.sortByTitle);
                setCache(key, cities);
                return cities;
            }, cb);
        }, errorResponse => {errorCallback(errorResponse, cb);});
    };

    self.fetchCinemas = (cb) => {
        const key = `cinemas`;
        if (checkCache(key)) {
            return cb(null, common.cache[key]);
        }

        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/cinemas`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                const cinemas = response.data.sort(helperService.sortByShows);
                setCache(key, cinemas);
                return cinemas;
            }, cb);
        }, errorResponse => {errorCallback(errorResponse, cb);});
    };

    self.fetchFilms = (city, cb) => {
        const key = `films${city ? city.id : ''}`;
        if (checkCache(key)) {
            return cb(null, common.cache[key]);
        }

        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/films${city ? '/' + city.id : ''}`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                const films = response.data.sort(helperService.sortByShows);
                setCache(key, films);
                return films;
            }, cb);
        }, errorResponse => {errorCallback(errorResponse, cb);});
    };

    self.fetchFilm = (filmId, cityId, cb) => {
        const key = `film${filmId}${cityId}`;
        if (checkCache(key)) {
            return cb(null, common.cache[key]);
        }

        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/film${filmId ? '/' + filmId : ''}${cityId ? '?showsFor=' + cityId : ''}`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                const film = response.data;
                setCache(key, film);
                return film;
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
        const key = `cinema${cinemaId}`;
        if (checkCache(key)) {
            return cb(null, common.cache[key]);
        }

        $rootScope.$emit('loading:show');
        $http({
            method: 'GET',
            url: `${common.serverUrl}/cinema/${cinemaId}`,
            cache: true,
            responseType: 'json'
        }).then(function(response) {
            successCallback(response, function(response) {
                const cinema = response.data;
                setCache(key, cinema);
                return cinema;
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

    function checkCache(key) {
        return (common.cache[key] && common.cacheDates[key] &&
            common.cacheDates[key].getTime() > new Date().getTime() - common.maxChacheAge);
    }

    function setCache(key, value) {
        common.cache[key] = value;
        common.cacheDates[key] = new Date();
    }
});
