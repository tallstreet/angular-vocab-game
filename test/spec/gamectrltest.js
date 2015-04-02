'use strict';

describe('Controller: GameCtrl', function () {
  var scope, $q;
  var createCtrl;

  var GameMock;

  // load the controller's module
  beforeEach(module('myApp.controllers'));

  // Initialize the controller
  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    GameMock = jasmine.createSpyObj('Game', ['init', 'round', 'score', 'answer', 'over']);

    createCtrl = function () {
      GameMock.init.and.returnValue($q.when(true));
      return $controller('GameCtrl', {
        $scope: scope,
        Game: GameMock,
        GameSettings: {}
      });
    };
  }));

  it('should initialize the game', function() {
    createCtrl();
    scope.$digest();
    expect(GameMock.init).toHaveBeenCalled();
  });


  it('answering a question should submit to game service', function() {
    createCtrl();
    scope.answer(12);
    scope.$digest();
    expect(GameMock.answer).toHaveBeenCalledWith(12);
    expect(GameMock.score).toHaveBeenCalled();
    expect(GameMock.over).toHaveBeenCalled();
  });
});
