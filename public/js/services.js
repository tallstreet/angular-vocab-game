'use strict';

/* Services */


angular.module('myApp.services', [])
  .value('words', [{
    "en": "Good morning",
    "es": "Buenos días",
    def: "A conventional expression of greeting or farewell used in the morning."
  }, {
    "en": "Apple",
    "es": "Manzana",
    def: "The round fruit of an apple tree, which typically has thin green or red skin."
  }, {
    "en": "Brother",
    "es": "Hermano",
    def: "A man or boy in relation to other sons and daughters of his parents."
  }, {
    "en": "Red",
    "es": "Rojo",
    def: "The colour of blood, fire, or rubies."
  }, {
    "en": "Germany",
    "es": "Alemania",
    def: "A country in central Europe whose capital is Berlin. "
  }, {
    "en": "Seven",
    "es": "Siete",
    def: "A number equivalent to the sum of three and four."
  }, {
    "en": "Learn",
    "es": "Aprender",
    def: "Gain or acquire knowledge in something by study, experience, or being taught."
  }, {
    "en": "Sun",
    "es": "Sol",
    def: "The star round which the earth orbits."
  }, {
    "en": "House",
    "es": "Casa",
    def: "A building for human habitation."
  }, {
    "en": "Young",
    "es": "Joven",
    def: "Having lived or existed for only a short time."
  }, {
    "en": "Friendly",
    "es": "Amigable",
    def: "Kind and pleasant."
  }])

  .constant('GameSettings', {
    'choices': 3,
    'rounds': 3,
    'answerTime': 30000
  })

  .service('Game', function(GameSettings, $q, words) {

    var questions = [];
    var choices = [];
    var answers = [];
    var round = 0;
    var score = 0;

    function shuffle(array) {
        var counter = array.length, temp, index;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }


    return {
      /*
        Plans a game state.

        Made this return a promise as this could potentially require server side execution
        Although right now it doesn't
      */
      'init': function() {
        var deferred = $q.defer();

        if (words.length < GameSettings.choices || words.length < GameSettings.rounds) {
          throw "Not Enough Words";
        }

        questions = [];
        choices = [];
        answers = [];
        round = 0;
        score = 0;

        // Choose 3 random words to quiz on
        var question_ids = [];
        var r = 0;
        while (question_ids.length < GameSettings.rounds) {
          var number = Math.floor(Math.random()*words.length);
          var choice_ids = [];
          if (question_ids.indexOf(number) == -1) {
            question_ids.push(number);
            questions.push(words[number].en);
            answers.push(words[number].es);
            choice_ids.push(number);
            choices[r] = [];
            choices[r].push(words[number].es);
            // Choose 2 incorrect choices as options
            while (choice_ids.length < GameSettings.choices) {
              var number = Math.floor(Math.random()*words.length);
              if (choice_ids.indexOf(number) == -1) {
                choice_ids.push(number);
                choices[r].push(words[number].es);
              }
            }
            r++;
          }
        }
        deferred.resolve(this);
        return deferred.promise;
      },

      'round': function() {
        return {
          question: questions[round],
          choices: shuffle(choices[round])
        }
      }, 

      'over': function() {
        return round >= GameSettings.rounds;
      }, 

      'answer': function(value) {
        if (value === answers[round]) {
          score++;
        }
        round++;
      }, 

      'score': function() {
        return score + " / " + round
      }
    }
  })

  .service('GameScores', function($http) {
    return {
      'submit': function(score) {
        return $http({
          method: 'POST',
          url: '/api/scores',
          data: score
        })
      },

      'get': function() {
        return $http({
          method: 'GET',
          url: '/api/scores'
        })
      }
    }
  });