'use strict';

angular.module('cadeasalaAdmin.discipline', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('disciplineState', {
      cache: false,
      url: '/disciplines/:disciplineId',
      templateUrl: 'templates/discipline.html',
      controller: 'DisciplineController'
    })
  }])

  .controller('DisciplineController', ['$scope', '$state', '$stateParams', '$rootScope', 'Discipline', 'usSpinnerService', 'GrowlService',  function($scope, $state, $stateParams, $rootScope, Discipline, usSpinnerService, GrowlService) {
    Discipline.get(
      {
        disciplineId: $stateParams.disciplineId
      },
      function(response) {
        $scope.discipline = response.discipline
        usSpinnerService.stop('discipline')
      },
      function(err) {
        GrowlService.growl('Algum problema aconteceu. Tente novamente.')
        usSpinnerService.stop('discipline')
      }
    )

    $scope.updateDiscipline = function() {
      Discipline.update(
        {
          disciplineId: $scope.discipline.id
        },
        {
          name: $scope.discipline.name
        },
        function() {
          $state.go('courseState', { locationId: $rootScope.locationId, courseId: $rootScope.courseId })
          GrowlService.growl('Disciplina atualizada com sucesso.')
        },
        function() {
          GrowlService.growl('Algum problema aconteceu. Tente novamente.')
        }
      )
    }
  }])
