var request = require('request'),
  cheerio = require('cheerio');

var Db = require('mongodb').Db,
  MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  assert = require('assert');


var db = new Db('cardekho', new Server('localhost', 27017), {
  safe: false
});

var URL = "http://www.cardekho.com/newcars",
  carUrls = [];
db.open(function(err, db) {
  var collection = db.collection("scrapdata");
  console.log("Fetching...............");
  request(URL, function(error, response, html) {
    // Error Handling
    if (error) {
      console.log("Error Occur");
    }

    $ = cheerio.load(html);

    // car name and url
    $('#brandsDiv>ul>li').each(function(i, elem) {
      var carObj = {};
      carObj.href = $('a', this).attr('href');
      carObj.name = $('span.brandtext', this).text();
      if (carObj.href) {
        carUrls.push(carObj);
        console.log(carObj);
      }
    })

    carUrls.forEach(function(carObj) {
      request(carObj.href, function(error, response, html) {
        carObj.prod = [];
        var prodObj = {};
        $ = cheerio.load(html);
        console.log($('div.CommonBlock.BoxModelNew.LatestPrice>ul>li').length);
        $('div.CommonBlock.BoxModelNew.LatestPrice>ul>li').each(function() {
          prodObj.imageUrl = $('div.FloatLeft>a', this).attr('href');
          prodObj.image = $('div.FloatLeft>a img', this).attr('src');
          prodObj.name = $('div.cardekhomain a', this).text();
          prodObj.price = $('span', this).eq(0).text();
          carObj.prod.push(prodObj); 
        });
        collection.insert(carObj);
        console.log(carObj);
      })
    })
  });
});
