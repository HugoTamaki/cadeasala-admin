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

  .controller('CourseController', ['$scope', '$state', '$stateParams', 'Course', 'GrowlService', 'CourseDiscipline', 'CourseDisciplineBulkUpdate', 'usSpinnerService',  function($scope, $state, $stateParams, Course, GrowlService, CourseDiscipline, CourseDisciplineBulkUpdate, usSpinnerService) {
    CourseDiscipline.get(
      {
        locationId: $stateParams.locationId,
        courseId: $stateParams.courseId
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

    $scope.datetimeOptions = {
      format: 'DD/MM/YYYY HH:mm a'
    }

    $scope.dateOptions = {
      format: 'DD/MM/YYYY'
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
