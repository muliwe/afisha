'use strict';
angular.module('constants', []);

angular.module('constants').constant('common', {
    serverUrl: 'http://127.0.0.1:3000',
    currentDate: new Date(),
    currentCity: {
        id: 2,
        title: 'Москва',
        latitude: 55.7495307478992,
        longitude: 37.6213073730469
    },
    savedCinemas: [],
    cache: {}
});
