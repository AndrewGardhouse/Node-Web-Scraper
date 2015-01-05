var json2csv = require('json2csv');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs'); 

request('http://www.slate.com/blogs/the_slatest.html', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);

    var headlines = [];
    $('.hed').each(function(){
      headlines.push($(this).text());
    });

    var timestamps = [];
    $('.timestamp').each(function(){
      timestamps.push($(this).text());
    });

    var authors = [];
    $('.byline').each(function(){
      authors.push($(this).text().replace("By ",""))
    });
    
    var stories = [];
    for(i = 0; i < authors.length; i++){
      storyInfo = {
        headline: headlines[i],
        author: authors[i],
        timestamp: timestamps[i]
      };
      stories.push(storyInfo);
    }

    json2csv({data: stories , fields: ['headline', 'author', 'timestamp']}, function(err, csv) {
      if (err) console.log(err);
        fs.appendFile('stories.csv', csv, function(err) {
      if (err) throw err;
        console.log('file saved');
      });
    });
  }  
});
