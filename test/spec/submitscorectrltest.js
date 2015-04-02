'use strict';

describe('Controller: SubmitScoreCtrl', function () {
  var scope, $q;
  var createCtrl;

  var GameMock, GameScoresMock;

  // load the controller's module
  beforeEach(module('myApp.controllers'));

  // Initialize the controller
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    GameMock = jasmine.createSpyObj('Game', ['score']);
    GameScoresMock = jasmine.createSpyObj('GameScores', ['submit']);

    createCtrl = function () {
      GameMock.score.and.returnValue('3 / 3');
      GameScoresMock.submit.and.returnValue($q.when({'data': {'success': true}}));
      return $controller('SubmitScoreCtrl', {
        $scope: scope,
        Game: GameMock,
        GameScores: GameScoresMock,
      });
    };
  }));

  it('should load the game score', function() {
    createCtrl();
    scope.$digest();
    expect(GameMock.score).toHaveBeenCalled();
  });


  it('submitting should submit to the game score service', function() {
    createCtrl();
    var score = {'name': 'Gary', 'score': '3 / 3'};
    scope.submit(score);
    scope.$digest();
    expect(GameScoresMock.submit).toHaveBeenCalledWith(score);
  });
});
