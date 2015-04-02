'use strict';

describe('Service: Game', function () {

  var words = [];
  // load the service module
  beforeEach(module('myApp.services', function($provide) {
    $provide.value('words', words);
  }));

  // instantiate service
  var Game, $rootScope;

  beforeEach(inject(function (_Game_, _$rootScope_) {
    Game = _Game_;
    $rootScope = _$rootScope_;
  }));

  it('should do something', function () {
    expect(!!Game).toBe(true);
  });

  it('show throw an error if not enough words to choose an answer', function() {
    words.push({
      "en": "Young",
      "es": "Joven",
      def: "Having lived or existed for only a short time."
    });
    var game = function () {
      return Game.planGame();
    };

    expect(game).toThrow();
  });

  it('choose 3 rounds of random word from a list of words', function() {
    words.push({
      "en": "House",
      "es": "Casa",
      def: "A building for human habitation."
    }, {
      "en": "Seven",
      "es": "Siete",
      def: "A number equivalent to the sum of three and four."
    });

    Game.init().then(function(game) {
      expect(game.round().question).toBeDefined();
      expect(game.round().question).toMatch(/(House|Young|Seven)/);
      expect(game.round().choices[0]).toBeDefined();
      expect(game.round().choices[0]).toMatch(/(Casa|Siete|Joven)/);
      expect(game.round().choices[1]).toBeDefined();
      expect(game.round().choices[1]).toMatch(/(Casa|Siete|Joven)/);
      expect(game.round().choices[2]).toBeDefined();
      expect(game.round().choices[2]).toMatch(/(Casa|Siete|Joven)/);
      game.answer("Test");
      expect(game.over()).toBeFalsy(); 


      expect(game.round().question).toBeDefined();
      expect(game.round().question).toMatch(/(House|Young|Seven)/);
      expect(game.round().choices[0]).toBeDefined();
      expect(game.round().choices[0]).toMatch(/(Casa|Siete|Joven)/);
      expect(game.round().choices[1]).toBeDefined();
      expect(game.round().choices[1]).toMatch(/(Casa|Siete|Joven)/);
      expect(game.round().choices[2]).toBeDefined();
      expect(game.round().choices[2]).toMatch(/(Casa|Siete|Joven)/);
      game.answer("Test");
      expect(game.over()).toBeFalsy(); 


      expect(game.round().question).toBeDefined();
      expect(game.round().question).toMatch(/(House|Young|Seven)/);
      expect(game.round().choices[0]).toBeDefined();
      expect(game.round().choices[0]).toMatch(/(Casa|Siete|Joven)/);
      expect(game.round().choices[1]).toBeDefined();
      expect(game.round().choices[1]).toMatch(/(Casa|Siete|Joven)/);
      expect(game.round().choices[2]).toBeDefined();
      expect(game.round().choices[2]).toMatch(/(Casa|Siete|Joven)/); 
      game.answer("Test");
      expect(game.over()).toBeTruthy(); 
      expect(game.score()).toEqual("0 / 3"); 

    });
    $rootScope.$digest();
  });


});
