'use strict';

angular.module('cadeasalaAdmin.login', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('loginState', {
      cache: false,
      url: '/',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    });
  }])

  .controller('LoginController', ['$scope', function($scope) {
    $scope.login = {
      email: null,
      password: null
    };

    $scope.authenticate = function(form) {
      
    };
  }]);