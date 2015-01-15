var request = require('request')
  , cheerio = require('cheerio');  

var URL = "http://www.cardekho.com/newcars",
    carUrls=[];

request(URL,function(error,response,html){
  // Error Handling
  if(error){
    console.log("Error Occur");
  }

  $=cheerio.load(html);
  
  $('#brandsDiv>ul>li').each(function(i,elem){
    var carObj={};
    carObj.href = $('a',this).attr('href');
    carObj.name = $('a>span',this)[1].attr('href');
    carUrls.push(carObj);
    console.log(carObj);
  })  

});
