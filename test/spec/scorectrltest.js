'use strict';

describe('Controller: ScoreCtrl', function () {
  var scope, $q;
  var createCtrl;

  var scores = {'data': [{
      'name': 'Gary',
      'score': '3 / 3'
    }
  ]};

  var GameScoreMock;

  // load the controller's module
  beforeEach(module('myApp.controllers'));

  // Initialize the controller
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    GameScoreMock = jasmine.createSpyObj('GameScores', ['get']);

    createCtrl = function () {
      GameScoreMock.get.and.returnValue($q.when(scores));
      return $controller('ScoreCtrl', {
        $scope: scope,
        GameScores: GameScoreMock
      });
    };
  }));

  it('should load scores', function() {
    createCtrl();
    scope.$digest();
    expect(scope.scores).toEqual(scores.data);
  });
});
