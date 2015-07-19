var request = require('request'),
    cheerio = require('cheerio'),
    util = require('util');

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    assert = require('assert');


var db = new Db('darbo', new Server('localhost', 27017), {
    safe: false
});

var URL = "http://darbo.lt/darbas/index.php?puslapis=";
var urlIndex = 0;


var count = 0;
db.open(function (err, db) {
    var employer_url = db.collection("employer_url");
    if (err) {
        console.error("Error");
    }
    for (var i = 1; i < 48; i++) {
        console.log(URL + i);
        request(URL + i, function (err, response, html) {
            if (err) {
                console.log(util.inspect(err));
            } else {
                $ = cheerio.load(html);
                $('center table[bgcolor="#ffffff"] tr a').each(function () {
                    console.log(count++ + $(this).attr('href'));
                    employer_url.insertOne({'url': $(this).attr('href')});
                });
            }
        });
    }
});
