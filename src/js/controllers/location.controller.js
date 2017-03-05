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

  .controller('LocationController', ['$scope', '$rootScope', '$state', '$stateParams', 'Course', 'GrowlService', function($scope, $rootScope, $state, $stateParams, Course, GrowlService) {
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

    $scope.goToCourse = function(course) {
      $state.go('courseState', {locationId: $stateParams.locationId, courseId: course.id})
    }
  }])