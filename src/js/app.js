'use strict';

var format = function(str, data) {
  return str.replace(/{([^{}]+)}/g, function(match, val) {
    var prop = data;
    val.split('.').forEach(function(key) {
      prop = prop[key];
    });

    return prop;
  });
};

String.prototype.format = function(data) {
  return format(this, data);
};

String.prototype.slugify = function() {
  function dasherize(str) {
    return str.trim().replace(/[-_\s]+/g, '-').toLowerCase();
  }

  function clearSpecial(str) {
    var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž',
      to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';
    to = to.split('');
    return str.replace(/.{1}/g, function(c){
      var index = from.indexOf(c);
      return index === -1 ? c : to[index];
    });
  }

  return clearSpecial(dasherize(this));
};

Number.prototype.paddingLeft = function(size, char) {
  if (!char) {
    char = '0'
  }
  var length = this.toString().length;
  if (length >= size) {
    return this.toString();
  }
  var result = [];
  for (var i = length; i < size; i++) {
    result.push(char);
  }
  return result.join('') + this.toString();
};

var cadeasalaAdminServices  = angular.module('cadeasalaAdmin.services', []);
var cadeasalaAdminFactories  = angular.module('cadeasalaAdmin.factories', []);
var cadeasalaAdminResources  = angular.module('cadeasalaAdmin.resources', []);
var cadeasalaAdminDirectives  = angular.module('cadeasalaAdmin.directives', []);

var cadeasalaAdmin = angular.module(
  'cadeasalaAdmin', [
    'ngResource',
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ae-datetimepicker',
    'LocalStorageModule',
    'cadeasalaAdmin.services',
    'cadeasalaAdmin.factories',
    'cadeasalaAdmin.resources',
    'cadeasalaAdmin.directives',

    'cadeasalaAdmin.login',
    'cadeasalaAdmin.home',
    'cadeasalaAdmin.location'
  ]
);

cadeasalaAdmin.constant('appConfig', {
  backendURL: '@@backendURL',
  env: '@@env'
});

cadeasalaAdmin.run(['$rootScope', '$state', '$location', 'appConfig', 'AuthService', function($rootScope, $state, $location, appConfig, AuthService) {
  if (!AuthService.userIsLogged()) {
    $state.go('loginState');
  }
}]);

cadeasalaAdmin.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'localStorageServiceProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('cadeasalaAdmin')
  $urlRouterProvider.otherwise('/')

  $httpProvider.interceptors.push('updateToken')
}]);
