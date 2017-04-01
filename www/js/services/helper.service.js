"use strict";

angular.module('afisha').service('helperService', function() {
    let self = this;

    self.showConfigure = show => {
        show.timeParsed = show.time;
        show.timeParsed = show.timeParsed.replace(':', '');
        show.timeParsed = parseInt(show.timeParsed, 10);
        show.timeParsed = show.timeParsed > 600 ? show.timeParsed : show.timeParsed + 2400;
        show.timeClass = show.timeParsed > 1850 && show.timeParsed < 2300 ? 'more' : (
            show.timeParsed < 1400 ? 'less' : '');
    };

    self.sortByTime = (a, b) => {
        if (a.timeParsed < b.timeParsed) return -1;
        if (a.timeParsed > b.timeParsed) return 1;
        return 0;
    };

    self.sortByTitle = (a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    };

    self.sortByShows = (a, b) => {
        if (a.shows < b.shows) return 1;
        if (a.shows > b.shows) return -1;
        return 0;
    };

    self.prepareAnons = anons => {
        if (!anons) {
            return anons;
        }

        anons = '' + anons;
        anons = anons.replace(/\n\n/g, '<br>');
        anons = anons.replace(/<\/*a.*?>/ig, '');
        return anons;
    }
});

function distance(lon1, lat1, lon2, lat2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1).toRad();  // Javascript functions in radians
    const dLon = (lon2 - lon1).toRad();
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}
