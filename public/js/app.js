'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngRoute'
]).config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'partials/game.html',
    controller: 'GameCtrl'
  }).when('/highscore', {
    templateUrl: 'partials/highscores.html',
    controller: 'ScoreCtrl'
  }).when('/submitscore', {
    templateUrl: 'partials/submitscore.html',
    controller: 'SubmitScoreCtrl'
  }).otherwise({
    redirectTo: '/game'
  });

  $locationProvider.html5Mode(true);
});