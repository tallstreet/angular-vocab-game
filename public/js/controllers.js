'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('GameCtrl', function($scope, Game, GameSettings, $location, $interval) {

    Game.init().then(function() {
      $scope.round = Game.round();
    });

    var nextQuestion = function() {
      $scope.answer(false);
    }

    $scope.interval = GameSettings.answerTime;

    var stop = $interval(nextQuestion, GameSettings.answerTime);
    
    $scope.answer = function(value) {
      Game.answer(value);
      $scope.$broadcast('reset');
      $interval.cancel(stop);
      $scope.score = Game.score();
      if (!Game.over()) {
        $scope.round = Game.round();
        stop = $interval(nextQuestion, GameSettings.answerTime);
      } else {
        $location.path("/submitscore");
      }
    }
  }).controller('ScoreCtrl', function($scope, GameScores) {
    GameScores.get().then(function(scores) {
      $scope.scores = scores.data;
    })
  }).controller('SubmitScoreCtrl', function($scope, Game, GameScores, $location) {
    $scope.score = {};
    $scope.state = {};
    $scope.score.score = Game.score();

    $scope.submit = function(score) {
      $scope.state.processing = true;
      GameScores.submit(score).then(function() {
        $scope.state.processing = false;
        $location.path("/highscore");
      });
    }
  });