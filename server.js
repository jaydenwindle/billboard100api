// server.js
// where your node app starts

// init project
var express = require('express');
var req = require('request');
var cheerio = require('cheerio');
var cors = require('cors');
var app = express();
app.use(cors());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get('/:year', function(request, response) {
  getSongsByYear(request.params.year, function(error, data) {
    if (error) {console.log(error)}
    response.send(data);
  })
});

app.get('/:year/:month', function(request, response) {
  getSongsByMonth(request.params.month, request.params.year, function(error, data) {
    if (error) {console.log(error)}
    response.send(data);
  })
});

app.get('/:year/:month/:day', function(request, response) {
  getSongsByDay(request.params.day, request.params.month, request.params.year, function(error, data) {
    if (error) {console.log(error)}
    response.send(data);
  })
});

function getSongTableRows(year, cb) {
  req('https://en.wikipedia.org/wiki/List_of_Billboard_Hot_100_number-one_singles_of_' + year, function (error, res, body) {
    var data = []
    var $ = cheerio.load(body);
    if (year == new Date().getFullYear()) {
      var rows = $(".wikitable").find("tr");
    } else {
      var rows = $(".wikitable:last-of-type").find("tr");
    }
    
    cb(undefined, rows);
  });
}

function getSongsByYear(year, cb) {
  req('https://en.wikipedia.org/wiki/List_of_Billboard_Hot_100_number-one_singles_of_' + year, function (error, res, body) {
    var data = []
    var $ = cheerio.load(body);
    if (year == new Date().getFullYear()) {
      var rows = $(".wikitable").find("tr");
    } else {
      var rows = $(".wikitable:last-of-type").find("tr");
    }
    rows.each(function(index, element) {
      var cols = $(this).children();
      if (cols.length == 4 && index != 0) {
        var start_date = new Date($(cols[0]).text() + " " + year).toString();
        var song_name = $(cols[1]).text().replace(/"/g, "");
        var song_artist = $(cols[2]).text();
        if (data.length > 0) {
          data[data.length - 1].endDate = start_date;
        }
        if (index == rows.length - 1) {
          data[data.length - 1].endDate = new Date($(cols[0]).text() + " " + year).toString();;
        }
        data.push({
          name: song_name,
          artist: song_artist,
          startDate: start_date,
        });
      }
    });
    cb(undefined, data);
  });
}

function getSongsByMonth(month, year, cb) {
  req('https://en.wikipedia.org/wiki/List_of_Billboard_Hot_100_number-one_singles_of_' + year, function (error, res, body) {
    var data = []
    var $ = cheerio.load(body);
    if (year == new Date().getFullYear()) {
      var rows = $(".wikitable").find("tr");
    } else {
      var rows = $(".wikitable:last-of-type").find("tr");
    }
    rows.each(function(index, element) {
      var cols = $(this).children();
      if (cols.length == 4 && index != 0) {
        var start_date = new Date($(cols[0]).text() + " " + year).toString();
        var song_name = $(cols[1]).text().replace(/"/g, "");
        var song_artist = $(cols[2]).text();
        if (start_date.indexOf(month) != -1) {
          data.push({
          name: song_name,
          artist: song_artist,
        });
        }
      }
    });
    cb(undefined, data);
  });
}

function getSongsByDay(day, month, year, cb) {
  req('https://en.wikipedia.org/wiki/List_of_Billboard_Hot_100_number-one_singles_of_' + year, function (error, res, body) {
    var data = []
    var date = new Date(month + " " + day + " " + year);
    var $ = cheerio.load(body);
    if (year == new Date().getFullYear()) {
      var rows = $(".wikitable").find("tr");
    } else {
      var rows = $(".wikitable:last-of-type").find("tr");
    }
    rows.each(function(index, element) {
      var cols = $(this).children();
      if (cols.length == 4 && index != 0) {
        var start_date = new Date($(cols[0]).text() + " " + year).toString();
        var song_name = $(cols[1]).text().replace(/"/g, "");
        var song_artist = $(cols[2]).text();
        if (data.length > 0) {
          data[data.length - 1].endDate = start_date;
        }
        data.push({
          name: song_name,
          artist: song_artist,
          startDate: start_date,
        });
      }
      if (index == rows.length - 1) {
        data[data.length - 1].endDate = new Date($(cols[0]).text() + " " + year).toString();;
      }
    });
    
    
    var return_data = data[0];
    console.log(data)
    for(var i = 0; i < data.length; i++) {
      var start_date = new Date(data[i].startDate);
      var end_date = new Date(data[i].endDate);
      console.log(date);
      if (date >= start_date && date <= end_date) {
        return_data = data[i];
        break;
      }
    }
    
    cb(undefined, return_data);
  });
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
