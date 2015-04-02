'use strict';

/* Directives */

angular.module('myApp.directives', [])
  .directive('appVersion', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  })
  .directive('timer', function ($compile) {
    return  {
      restrict: 'EAC',
      replace: true,
      scope: {
        interval: '='
      },
      template: '<div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar"></div></div>',
      controller: function ($scope, $element, $attrs, $interval) { 
        var seconds = $scope.interval / 1000; 
        var countDown = seconds;
        var stopTime = $interval(function(){
          countDown--;
          $element.find("div").css('width', ((seconds - countDown) / seconds * 100) + "%");
        }, 1000, 0);

        $element.on('$destroy', function() {
          $interval.cancel(stopTime);
        });

        $scope.$on('reset', function (){
          countDown = seconds;
          $element.find("div").css('width', "0%");
        });
      }
    };
  });