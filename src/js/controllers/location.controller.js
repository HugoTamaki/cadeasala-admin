'use strict';

angular.module('cadeasalaAdmin.location', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('locationState', {
      cache: false,
      url: '/locations/:locationId',
      templateUrl: 'templates/location.html',
      controller: 'LocationController'
    })
  }])

  .controller('LocationController', ['$scope', '$stateParams', 'Course', 'GrowlService', function($scope, $stateParams, Course, GrowlService) {
    Course.get(
      {
        locationId: $stateParams.locationId
      },
      function(response) {
        $scope.courses = response.courses
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
      }
    )
  }])