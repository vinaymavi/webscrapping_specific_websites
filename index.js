var request = require('request')
  , cheerio = require('cheerio');  

var URL = "https://developers.google.com/products/";

request(URL,function(error,response,html){
  // Error Handling
  if(error){
    console.log("Error Occur");
  }

  $=cheerio.load(html);
  $('ul.alpha-sections>li').each(function(i,elem){
    console.log($('div>h3',this).text());
  }); 
});
