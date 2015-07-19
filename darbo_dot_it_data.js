var request = require('request'),
    cheerio = require('cheerio'),
    util = require('util'),
    fs = require('fs');

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    assert = require('assert');


var db = new Db('darbo', new Server('localhost', 27017), {
    safe: false
});

var URL = [];
var urlIndex = 0;
var reqCount = 0;
db.open(function (err, db) {
    var employer_url = db.collection("employer_url");
    var data_col = db.collection("data");
    employer_url.distinct('url', function (err, docs) {
        if (err) {
            console.error("Error");
        }
        for (var i = 0; i < 50; i++) {
            getData(docs[urlIndex]);
            urlIndex++;
            reqCount++;
        }
        function getData(url) {
            if (reqCount <= 51) {
                reqCount++;
                request(url, function (error, response, html) {
                    // Error Handling
                    if (error) {
                        console.log("Error Occur");
                        console.log(util.inspect(error));

                    } else {
                        var obj = {};
                        obj.url = docs[urlIndex];
                        console.log(urlIndex, reqCount, obj.url);
                        $ = cheerio.load(html);
                        obj.categoty = $('font[color="#114433"] b').text();
                        var para = $('p[align="justify"]').html();
                        if (para) {
                            var brs = para.split("<br>");

                            $ = cheerio.load("<p>" + brs[brs.length - 6] + "</p>")
                            obj.salary = $('p').text().split(':')[1];

                            $ = cheerio.load("<p>" + brs[brs.length - 5] + "</p>")
                            obj.company = $('p').text().split(':')[1];

                            $ = cheerio.load("<p>" + brs[brs.length - 4] + "</p>")
                            obj.city = $('p').text().split(':')[1];

                            $ = cheerio.load("<p>" + brs[brs.length - 3] + "</p>")
                            obj.contacts = $('p').text().split(':')[1];
                            $ = cheerio.load("<p>" + brs[brs.length - 2] + "</p>")

                            obj.addDate = $('p').text().split(':')[1];
                            console.log(obj);
                            data_col.insertOne(obj);
                        } else {
                            fs.appendFile('skip_url.log', docs[urlIndex] + "\n");
                        }
                        urlIndex++;
                        reqCount--;
                        if (urlIndex < docs.length) {
                            getData(docs[urlIndex]);
                        } else {
                            console.log("NO MORE DOCUMENT");
                        }

                    }
                });
            }
            return;
        }
    });
    console.log("Fetching...............");
});
