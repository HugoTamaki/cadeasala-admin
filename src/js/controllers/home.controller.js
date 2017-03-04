'use strict';

angular.module('cadeasalaAdmin.home', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('homeState', {
      cache: false,
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    })
  }])

  .controller('HomeController', ['$scope', '$state', 'Location', 'GrowlService', function($scope, $state, Location, GrowlService) {
    Location.get(
      null,
      function(response) {
        $scope.locations = response.locations
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
      }
    )

    $scope.goToLocation = function(location) {
      $state.go('locationState', { locationId: location.id })
    }
  }])