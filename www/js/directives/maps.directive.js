'use strict';

angular.module('afisha').directive('maps', ['common',
    function(common) {
    return {
        restrict: 'E',
        template: '<div id="ymaps"></div>',
        scope: {
            cinemas: '=',
            savedCinemas: '=',
            cinema: '='
        },
        link: function (scope, element, attr) {
            let dataDone = {};
            let dataCinemas = [];
            let lat;
            let long;
            let lattmp;
            let longtmp;
            let count;

            $('#ymaps').css('height', $('.scroll').css('height'));

            function watcher() {
                return (scope.cinemas && scope.cinemas.length) || (scope.savedCinemas && scope.savedCinemas.length)
                    || (scope.cinema && scope.cinema.id);
            }
            scope.$watch(watcher, function(newValue, oldValue) {
                if (scope.cinema && scope.cinema.id) {
                    lat = scope.cinema.latitude;
                    long = scope.cinema.longitude;

                    dataCinemas = [];

                    addCinema(scope.cinema);

                    dataDone = {type: 'FeatureCollection', features: dataCinemas};
                    ymaps.ready(initCinema);
                } else {
                    lattmp = 0;
                    longtmp = 0;
                    count = 0;

                    dataCinemas = [];

                    (scope.cinemas || []).forEach(addCinema);
                    (scope.savedCinemas || []).forEach(addCinema);

                    if (count) {
                        long = longtmp / count;
                        lat = lattmp / count;
                    } else {
                        long = common.currentLocation.longitude;
                        lat = common.currentLocation.latitude;
                    }

                    dataDone = {type: 'FeatureCollection', features: dataCinemas};
                    ymaps.ready(initCinema);
                }
            });

            function addCinema(cinema) {
                if (cinema.latitude && cinema.longitude) {
                    lattmp += cinema.latitude;
                    longtmp += cinema.longitude;
                    count++;
                }

                dataCinemas.push({
                    type: 'Feature',
                    id: cinema.id,
                    geometry: {type: 'Point', coordinates: [cinema.latitude, cinema.longitude]},
                    properties: {
                        balloonContent: `Кинотеатр &laquo;<a href='#!/cinema/${cinema.id}'><b>${cinema.title}</b></a>&raquo;<br />
                                            ${cinema.metro ? 'м. ' + cinema.metro + '<br /> ' : ''} 
                                            ${cinema.address}`,
                        clusterCaption: cinema.title,
                        hintContent: `Кинотеатр ${cinema.title}`
                    }
                });
            }

            function initCinema() {
                let myMap = new ymaps.Map('ymaps', {
                        center: [lat, long],
                        zoom: scope.cinema && scope.cinema.id ? 15 : 11
                    }, {
                        searchControlProvider: 'yandex#search'
                    });
                let objectManager = new ymaps.ObjectManager({
                        clusterize: true,
                        gridSize: 32
                    });

                objectManager.objects.options.set('preset', 'islands#blueDotIcon');
                objectManager.clusters.options.set('preset', 'islands#blueClusterIcons');
                myMap.geoObjects.add(objectManager);
                objectManager.add(dataDone);
            }
        }
    };
}]);

