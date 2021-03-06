'use strict';

//Assume request


angular.module('mentionrApp')
  .factory('dashboardFactory', function ($http) {
    // Service logic
    var populateWordsBar = function(user){
      $http.get('/api/users/'+user).success(function(words){
        return words;
      });
    };

    var postNewWord = function(word,userId){
      $http.post('/api/words', )
    };
    //Get Request for the Word Visualiser - Trigger on Click of Word from Left Bar
    //Returned Object with x array corresponding y array and total length
    var populateVisualizer = function(wordId){
      // return {x:[1,2,3,4,5,6,7], y:[2,4,3,5,4,2,1], all: {}, total: 21}
      return $http.get('/api/words/'+wordId).success(function(stats){
        var collateDates = {};
        var output = {x: [], y: [], all: stats, total: stats.length};
        var dateMin = stats[0].date;
        var dateMax = stats[0].date;
        for (var i = 0; i < stats.length; i++) {
          dateMin = stats[i].date < dateMin ? stats[i].date : dateMin;
          dateMax = stats[i].date > dateMax ? stats[i].date : dateMax;
          var temp = new Date(stats[i].date*1000);
          var dateTime = temp.getMonth() + '/' + temp.getDate() + '/' + temp.getFullYear();
          if (collateDates[dateTime] === undefined) {
            collateDates[dateTime] = {count: 1, urls: [stats[i].url]};
          } else {
            collateDates[dateTime].count++;
            collateDates[dateTime].urls.push(stats[i].url);
          }
        }
      
        var days = (dateMax-dateMin)/(60*60*24);
        
        var array = [];
        
        for (var j = 0; j < Math.ceil(days); j++) {
          var d = dateMin + j*60*60*24;
          var d2 = new Date(d*1000);
          var d3 = d2.getMonth() + '/' + d2.getDate() + '/' + d2.getFullYear();
          if (collateDates[d3] === undefined) {
            array.push({date: d3, data: {count: 0, urls: []}});
          } else {
            array.push({date: d3, data: collateDates[d3]});
          }
        }
        for (var ii = 0; ii < array.length; ii++) {
          output.x.push(array[ii].date);
          output.y.push(array[ii].data.count);
        }
        
        return output;
      });
    
    };
    
    // Public API here
    return {
      populateVisualizer: populateVisualizer,
      populateWordsBar: populateWordsBar,
      postNewWord: postNewWord
      };
  });
