'use strict';
angular.module('constants', []);

angular.module('constants').constant('common', {
    serverUrl: 'http://afisha-back.kinokadr.ru:3020', // 'http://127.0.0.1:3000',
    currentDate: new Date(),
    defaultCity: {
        id: 2,
        title: 'Москва',
        latitude: 55.7495307478992,
        longitude: 37.6213073730469
    },
    currentCity: {
        id: 2,
        title: 'Москва',
        latitude: 55.7495307478992,
        longitude: 37.6213073730469
    },
    currentLocation: {
        latitude: 55.7495307478992,
        longitude: 37.6213073730469
    },
    savedCinemas: [],
    useHalls: true,
    sortByTitle: true,
    defaultCityRadius: 1000,
    defaultCinemaRadius: 30,
    maxRadius: 300,
    nearRadius: 20,
    cache: {},
    cacheDates: {},
    maxChacheAge: 1000 * 60 * 60 // an hour
});
