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

  .controller('CourseController', ['$scope', '$state', '$stateParams', 'Course', 'GrowlService', 'CourseDiscipline', 'CourseDisciplineBulkUpdate', function($scope, $state, $stateParams, Course, GrowlService, CourseDiscipline, CourseDisciplineBulkUpdate) {
    CourseDiscipline.get(
      {
        locationId: $stateParams.locationId,
        courseId: $stateParams.courseId
      },
      function(response) {
        $scope.courseDisciplines = response.course_disciplines
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
      }
    )

    $scope.updateCourseDisciplines = function() {
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
        },
        function(err) {
          GrowlService.growl('Algum problema aconteceu. Tente novamente.')
        }
      )
    }
  }])