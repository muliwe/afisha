angular.module('afisha').service('serverService', function($http, common) {
    let self = this;

    self.fetchCities = (cb) => {
        "use strict";

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
});
