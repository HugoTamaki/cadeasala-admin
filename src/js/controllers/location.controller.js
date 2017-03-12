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

  .controller('LocationController', ['$scope', '$rootScope', '$state', '$stateParams', 'Course', 'GrowlService', 'usSpinnerService', function($scope, $rootScope, $state, $stateParams, Course, GrowlService, usSpinnerService) {
    $rootScope.currentCourse = null;

    Course.get(
      {
        locationId: $stateParams.locationId
      },
      function(response) {
        $scope.courses = response.courses
        usSpinnerService.stop('courses')
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
        usSpinnerService.stop('courses')
      }
    )

    $scope.goToCourse = function(course) {
      $rootScope.currentCourse = course.name
      $state.go('courseState', {locationId: $stateParams.locationId, courseId: course.id})
    }
  }])