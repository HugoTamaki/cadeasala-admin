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

  .controller('HomeController', ['$scope', '$rootScope', '$state', 'Location', 'GrowlService', 'usSpinnerService', function($scope, $rootScope, $state, Location, GrowlService, usSpinnerService) {
    $rootScope.currentLocation = null

    Location.get(
      null,
      function(response) {
        $scope.locations = response.locations
        usSpinnerService.stop('locations')
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
        usSpinnerService.stop('locations')
      }
    )

    $scope.goToLocation = function(location) {
      $state.go('locationState', { locationId: location.id })
    }
  }])