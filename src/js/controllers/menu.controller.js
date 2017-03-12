'use strict';

angular.module('cadeasalaAdmin.menu', [])
  .controller('MenuController', ['$scope', '$state', 'AuthService', 'GrowlService', function($scope, $state, AuthService, GrowlService) {
    $scope.logout = function() {
      AuthService.clear()
      $state.go('loginState')
      GrowlService.growl('Deslogado com sucesso.')
    }

    $scope.isLogged = function() {
      return AuthService.userIsLogged()
    }
  }])