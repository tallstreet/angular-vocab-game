'use strict';

describe('Service: GameScores', function () {

  // load the service module
  beforeEach(module('myApp.services'));

  // instantiate service
  var GameScores, $scope, $httpBackend;

  beforeEach(inject(function (_GameScores_, _$rootScope_, _$httpBackend_) {
    GameScores = _GameScores_;
    $scope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));


  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should do something', function () {
    expect(!!GameScores).toBe(true);
  });

  it('should make an http request to get scores', function() {
    var res = {
      'status': 'success'
    };
    $httpBackend.expectGET('/api/scores').respond(200, res);
    GameScores.get();

    // Serve pending HTTP requests
    $httpBackend.flush();
    // Make sure promise moves to resolved state
    $scope.$apply();

  });


  it('should make an http request to get scores', function() {
    var res = {
      'status': 'success',
    };
    $httpBackend.expectPOST('/api/scores').respond(200, res);
    GameScores.submit({'name': 'Gary', 'score': '1 / 3'});

    // Serve pending HTTP requests
    $httpBackend.flush();
    // Make sure promise moves to resolved state
    $scope.$apply();

  });

});
