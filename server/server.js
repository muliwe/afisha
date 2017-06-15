const connect = require('connect');
const query = require('connect-query');
const http = require('http');
const cors = require('cors');
const app = connect();
const compression = require('compression');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const zlib = require('zlib');
const tar = require('tar-fs');
const fs = require('fs');
const cjson = require('cjson');
const schedule = require('node-schedule');

let data = {};
let cities = {};
let cinemas = {};
let films = {};
let filmsWithShows = {};
let cinemasWithoutShows = {};

const started = new Date();
let reloaded = new Date();
const doIt = schedule.scheduleJob('55 3,15 * * *', init);

app.use(compression());
app.use(bodyParser.json({extended: false}));
app.use(cors());
app.use(query());

init();

app.use('/cities', (req, res, next) => {
    sendResponse(data.cities, res);
});

app.use('/cinemas', (req, res, next) => {
    const cityId = getIntUrlElem(req, '/cinemas/');

    if (req.originalUrl === '/cinemas') {
        sendResponse(data.cinemas, res);
    } else if (cities[cityId]) {
        sendResponse(cities[cityId].cinemas, res);
    } else {
        notFound(`Can't find city ${cityId}`, res);
    }
});

app.use('/cinema', (req, res, next) => {
    const cinemaId = getIntUrlElem(req, '/cinema/');

    if (cinemas[cinemaId]) {
        sendResponse(cinemas[cinemaId], res);
    } else {
        notFound(`Can't find cinema ${cinemaId}`, res);
    }
});

app.use('/films', (req, res, next) => {
    const cityId = getIntUrlElem(req, '/films/');

    if (req.originalUrl === '/films') {
        sendResponse(data.films.filter(film => film.shows > 0), res);
    } else if (cities[cityId]) {
        sendResponse(cities[cityId].films, res);
    } else {
        notFound(`Can't find city ${cityId}`, res);
    }
});

app.use('/film/', (req, res, next) => {
    const filmId = getIntUrlElem(req, '/film/');
    const cityId = parseInt(req.query.showsFor, 10);

    if (filmsWithShows[`${cityId}_${filmId}`]) {
        sendResponse(filmsWithShows[`${cityId}_${filmId}`], res);
    } else if (films[filmId]) {
        sendResponse(films[filmId], res);
    } else {
        notFound(`Can't find film ${filmId}`, res);
    }
});

app.use(serveStatic(__dirname + '/../www/')); // eslint-disable-line no-path-concat

app.use('/reload', (req, res, next) => {
    init();
    sendResponse({
        status: 'OK'
    }, res);
});

app.use('/', (req, res, next) => {
    if (req.originalUrl === '/') {
        sendResponse({
            started: started.toISOString(),
            reloaded: reloaded.toISOString(),
            updated: data.updated,
            running: timeDiffFormat((new Date().getTime() - started.getTime()) / 1000)
        }, res);
    } else {
        notFound(`There is no method to handle GET ${req.originalUrl}`, res);
    }
});

http.createServer(app).listen(process.env.PORT || 3000);

console.log('Server started at http://127.0.0.1:' + (process.env.PORT || 3000));

function downloadThenParse(next) {
    const req = http.get('http://www.kinokadr.ru/export/afisha.tar.gz');

    req.on('response', function(res) {
        const total = res.headers['content-length']; //total byte length
        let count = 0;
        res.on('data', function(data) {
            count += data.length;
            // console.log(count/total*100, '%');
        })
            .pipe(zlib.createGunzip())
            .pipe(fs.createWriteStream('./data/afisha.tar'))
            .on('close',() => {
                console.log('finished downloading, start extracting');

                fs.createReadStream('./data/afisha.tar')
                    .pipe(tar.extract('./data'))
                    .on('finish',() => {
                        console.log('finished extracting, start parsing');

                        try {
                            data = cjson.load('./data/rambler.json', true);
                            console.log('extracted completely', new Date());
                        } catch (e) {
                            console.log('JSON parse error: ', e);
                        }

                        reloaded = new Date();

                        next();
                    });
            });
    });
}

function manageData() {
    let cityFilmMap = {};
    let cityFilmCinemaMap = {};
    let cinemaFilmMap = {};

    cities = {};
    cinemas = {};
    films = {};
    filmsWithShows = {};
    cinemasWithoutShows = {};

    (data.cities || []).forEach(city => {
        cities[city.id] = cloneInstance(city);
        cities[city.id].cinemas = [];
        cities[city.id].films = [];
    });

    (data.films || []).forEach(film => {
        films[film.id] = film;
    });

    (data.cinemas || []).forEach(cinema => {
        cinemasWithoutShows[cinema.id] = cloneInstance(cinema);
        cinemas[cinema.id] = cloneInstance(cinema);
        cinemas[cinema.id].films = [];
        cinemas[cinema.id].shows = [];
        cinemas[cinema.id].aCity = cities[cinema.city];
        cities[cinema.city].cinemas.push(cinema);
    });

    (data.shows || []).forEach(show => {
        if (!cinemas[show.cinema] || !films[show.film] || !cinemasWithoutShows[show.cinema]) {
            return;
        }

        const key = `${cinemas[show.cinema].city}_${show.film}`;
        const key2 = `${show.cinema}_${show.film}`;
        const key3 = `${cinemas[show.cinema].city}_${show.film}_${show.cinema}`;

        if (!cityFilmMap[key]) {
            cities[cinemas[show.cinema].city].films.push(films[show.film]);

            filmsWithShows[key] = cloneInstance(films[show.film]);
            filmsWithShows[key].cinemas = [];
            filmsWithShows[key].shows = [];

            cityFilmMap[key] = true;
        }

        if (!cinemaFilmMap[key2]) {
            cinemas[show.cinema].films.push(films[show.film]);
            cinemaFilmMap[key2] = true;
        }

        if (!cityFilmCinemaMap[key3]) {
            filmsWithShows[key].cinemas.push(cinemasWithoutShows[show.cinema]);
            cityFilmCinemaMap[key3] = true;
        }

        cinemas[show.cinema].shows.push(show);
        filmsWithShows[key].shows.push(show);
    });
}

function init() {
    downloadThenParse(manageData);
}

function timeDiffFormat(diff) {
    const hours = Math.floor(diff / 60 / 60);
    let timeRow = `${Math.round(diff)} s`;

    if (diff > 60) {
        if (diff < 60 * 60) {
            timeRow = `${Math.round(diff / 60)} m`;
        } else {
            timeRow = `${hours} h ${Math.round(diff / 60) - hours * 60} m`;
        }
    }

    return timeRow;
}

function sendResponse(data, res) {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(data));
}

function notFound(message, res) {
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify({
        error: {
            name: 'Error',
            status: 404,
            message: message,
            statusCode: 404
        }
    }));
}

function cloneInstance(instance) {
    return JSON.parse(JSON.stringify(instance));
}

function getIntUrlElem(req, url) {
    return parseInt(req.originalUrl.replace(url, ''), 10);
}
