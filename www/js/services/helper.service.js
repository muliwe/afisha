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

    self.sotByTitle = (a, b) => {
        if (a.timeParsed < b.timeParsed) return -1;
        if (a.timeParsed > b.timeParsed) return 1;
        return 0;
    };

    self.sotByShows = (a, b) => {
        if (a.shows < b.shows) return 1;
        if (a.shows > b.shows) return -1;
        return 0;
    };
});
