'use strict';

angular.module('cadeasalaAdmin.login', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('loginState', {
      cache: false,
      url: '/',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })
  }])

  .controller('LoginController', ['$scope', 'Login', 'AuthService', 'GrowlService', function($scope, Login, AuthService, GrowlService) {
    $scope.login = {
      email: null,
      password: null
    }

    $scope.authenticate = function(form) {
      Login.save(
        {
          user: $scope.login
        },
        function(response) {
          AuthService.updateToken(response.headers['XSRF-TOKEN'])
          GrowlService.growl('Login realizado com sucesso.')
        },
        function(response) {
          GrowlService.growl('Algo aconteceu de errado. Tente novamente.')
        }
      )
    }
  }])