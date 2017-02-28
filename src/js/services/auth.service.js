'use strict';

cadeasalaAdminServices.service('AuthService', ['$rootScope', function($rootScope) {
    this.token = null;
    this.user = null;

    this.updateToken = function(token) {
      if (token) {
        localStorage.setItem('XSRF-TOKEN', token);
      }

      this.token = localStorage.getItem('XSRF-TOKEN');
      $rootScope.userLogged = this.userIsLogged();
    };

    this.updateUser = function(user) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));

        this.user = JSON.parse(localStorage.getItem('user'))
      }
    }

    this.userIsLogged = function() {
      return localStorage.getItem('XSRF-TOKEN') != null;
    };

    this.clear = function() {
      localStorage.removeItem('XSRF-TOKEN');
      localStorage.removeItem('user');
      this.updateToken();
      this.updateUser();
    };

    this.getToken = function() {
      return localStorage.getItem('XSRF-TOKEN')
    };

    this.getUser = function() {
      return JSON.parse(localStorage.getItem('user'));
    };
  }]);