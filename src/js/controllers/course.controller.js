'use strict';

angular.module('cadeasalaAdmin.course', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('courseState', {
      cache: false,
      url: '/locations/:locationId/courses/:courseId',
      templateUrl: 'templates/course.html',
      controller: 'CourseController'
    })
  }])

  .controller('CourseController', ['$scope', '$state', '$stateParams', '$rootScope', 'Location', 'Course', 'GrowlService', 'CourseDiscipline', 'CourseDisciplineBulkUpdate', 'usSpinnerService',  function($scope, $state, $stateParams, $rootScope, Location, Course, GrowlService, CourseDiscipline, CourseDisciplineBulkUpdate, usSpinnerService) {
    Location.get(
      {
        locationId: $stateParams.locationId || $rootScope.locationId
      },
      function(response) {
        $scope.currentLocation = response.location
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
      }
    )

    Course.get(
      {
        locationId: $stateParams.locationId || $rootScope.locationId,
        courseId: $stateParams.courseId || $rootScope.courseId
      },
      function(response) {
        $scope.currentCourse = response.course
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
      }
    )

    CourseDiscipline.get(
      {
        locationId: $stateParams.locationId || $rootScope.locationId,
        courseId: $stateParams.courseId || $rootScope.courseId
      },
      function(response) {
        $scope.courseDisciplines = response.course_disciplines
        usSpinnerService.stop('disciplines')
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
        usSpinnerService.stop('disciplines')
      }
    )

    $rootScope.locationId = null
    $rootScope.courseId = null

    $scope.datetimeOptions = {
      format: 'DD/MM/YYYY HH:mm a'
    }

    $scope.dateOptions = {
      format: 'DD/MM/YYYY'
    }

    $scope.goToLocation = function(location) {
      $state.go('locationState', { locationId: location.id })
    }

    $scope.editDiscipline = function(courseDiscipline) {
      $rootScope.locationId = $stateParams.locationId
      $rootScope.courseId = $stateParams.courseId
      $state.go('disciplineState', {disciplineId: courseDiscipline.discipline_id})
    }

    $scope.updateCourseDisciplines = function() {
      usSpinnerService.spin('disciplines')

      CourseDisciplineBulkUpdate.update(
        {
          locationId: $stateParams.locationId,
          courseId: $stateParams.courseId
        },
        {
          course_discipline: {
            data: $scope.courseDisciplines
          }
        },
        function(response) {
          $scope.courseDisciplines = response.course_disciplines
          GrowlService.growl('Dados atualizados.')
          usSpinnerService.stop('disciplines')
        },
        function(err) {
          GrowlService.growl('Algum problema aconteceu. Tente novamente.')
          usSpinnerService.stop('disciplines')
        }
      )
    }

    $scope.eraseCourseDisciplinesData = function() {
      _.each($scope.courseDisciplines, function(courseDiscipline) {
        courseDiscipline.ap1_local = null
        courseDiscipline.ap1_date = null
        courseDiscipline.ap2_local = null
        courseDiscipline.ap2_date = null
        courseDiscipline.ap3_local = null
        courseDiscipline.ap3_date = null
        courseDiscipline.ad1_deadline = null
        courseDiscipline.ad2_deadline = null
        courseDiscipline.presencial_tutor = null
        courseDiscipline.tutorship_room = null
        courseDiscipline.tutorship_time = null
        courseDiscipline.tutorship_weekday = null
      })
    }
  }])
