var connect = require('connect');
var http = require('http');
var cors = require('cors');
var app = connect();
var compression = require('compression');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var data = require('../data/rambler.json');

var started = new Date();

app.use(compression());
app.use(bodyParser.json({extended: false}));
app.use(cors());

app.use('/cities', function(req, res, next) {
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"}); 
  res.end(JSON.stringify(data.cities));
});

app.use('/cinemas/', function(req, res, next) {
  var cinemaId = parseInt(req.originalUrl.replace('/cinemas/', ''), 10);
  
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"}); 
  res.end(JSON.stringify(data.cinemas.filter(function (cinema) {
      return cinema.city === cinemaId;
  })));
});

app.use('/film/', function(req, res, next) {
  var filmId = parseInt(req.originalUrl.replace('/film/', ''), 10);
  
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"}); 
  res.end(JSON.stringify(data.films.filter(function (film) {
      return film.id === filmId;
  })[0]));
});

app.use('/show/', function(req, res, next) {
  var filmId = parseInt(req.originalUrl.replace(/^\/show\/([0-9]+)\/.*$/, '$1'), 10);
  var cinemaId = parseInt(req.originalUrl.replace(/^\/show\/([0-9]+)\/(.*)$/, '$2'), 10);
  
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"}); 
  res.end(JSON.stringify(data.shows.filter(function (show) {
      return show.film === filmId && show.cinema === cinemaId;
  })));
});

app.use(serveStatic(__dirname + '/../www/'));

app.use('/', function(req, res, next) {
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"}); 
  res.end(JSON.stringify({
      started: started.toISOString(),
      running: timeDiffFormat((new Date().getTime() - started.getTime()) / 1000)
  }));
});

http.createServer(app).listen(process.env.PORT || 3000);

console.log('Server started at http://127.0.0.1:' + (process.env.PORT || 3000));

function timeDiffFormat(diff) {
        let hours = Math.floor(diff / 60 / 60);
        let timerow = `${Math.round(diff)} s`;

        if (diff > 60) {
            if (diff < 60 * 60) {
                timerow = `${Math.round(diff / 60)} m`;
            } else {
                timerow = `${hours} h ${Math.round(diff / 60) - hours * 60} m`;
            }
        }

        return timerow;
    }
