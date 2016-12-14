const connect = require('connect');
const http = require('http');
const cors = require('cors');
const app = connect();
const compression = require('compression');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const data = require('../data/rambler.json');

const cities = {};
const cinemas = {};
const films = {};

const started = new Date();

app.use(compression());
app.use(bodyParser.json({extended: false}));
app.use(cors());

init();

app.use('/cities', (req, res, next) => {
    sendResponse(data.cities, res);
});

app.use('/cinemas', (req, res, next) => {
    const cityId = parseInt(req.originalUrl.replace('/cinemas/', ''), 10);

    if (req.originalUrl === '/cinemas') {
        sendResponse(data.cinemas, res);
    } else if (cities[cityId]) {
        sendResponse(cities[cityId].cinemas, res);
    } else {
        notFound(`Can't find city ${cityId}`, res);
    }
});

app.use('/films', (req, res, next) => {
    const cityId = parseInt(req.originalUrl.replace('/films/', ''), 10);

    if (req.originalUrl === '/films') {
        sendResponse(data.films, res);
    } else if (cities[cityId]) {
        sendResponse(cities[cityId].films, res);
    } else {
        notFound(`Can't find city ${cityId}`, res);
    }
});

app.use('/film/', (req, res, next) => {
    const filmId = parseInt(req.originalUrl.replace('/film/', ''), 10);

    if (films[filmId]) {
        sendResponse(films[filmId], res);
    } else {
        notFound(`Can't find film ${filmId}`, res);
    }
});

app.use('/show/', (req, res, next) => {
    const filmId = parseInt(req.originalUrl.replace(/^\/show\/([0-9]+)\/.*$/, '$1'), 10);
    const cinemaId = parseInt(req.originalUrl.replace(/^\/show\/([0-9]+)\/(.*)$/, '$2'), 10);

    sendResponse(data.shows.filter(function(show) {
        return show.film === filmId && show.cinema === cinemaId;
    }), res);
});

app.use(serveStatic(__dirname + '/../www/'));

app.use('/', (req, res, next) => {
    if (req.originalUrl === '/') {
        sendResponse({
            started: started.toISOString(),
            running: timeDiffFormat((new Date().getTime() - started.getTime()) / 1000),
            originalUrl: req.originalUrl
        }, res);
    } else {
        notFound(`There is no method to handle GET ${req.originalUrl}`, res);
    }
});

http.createServer(app).listen(process.env.PORT || 3000);

console.log('Server started at http://127.0.0.1:' + (process.env.PORT || 3000));

function init () {
    let cityFilmMap = {};

    data.cities.forEach(city => {
        cities[city.id] = JSON.parse(JSON.stringify(city)); // clone instance
        cities[city.id].cinemas = [];
        cities[city.id].films = [];
    });

    data.films.forEach(film => {
        films[film.id] = film;
    });

    data.cinemas.forEach(cinema => {
        cinemas[cinema.id] = cinema;
        cities[cinema.city].cinemas.push(cinema);
    });

    data.shows.forEach(show => {
        if (!cinemas[show.cinema] || !films[show.film]) {
            return;
        }

        const key = `${cinemas[show.cinema].city}_${show.film}`;

        if (!cityFilmMap[key]) {
            cities[cinemas[show.cinema].city].films.push(films[show.film]);
            cityFilmMap[key] = true;
        }
    });
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
