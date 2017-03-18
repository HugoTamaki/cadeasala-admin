'use strict'

describe('HomeController', function() {
  var $controller, $state, $scope, $rootScope, $httpBackend, Location, GrowlService, usSpinnerService;

  var locationURL = '@@backendURL/admin/locations'

  var locationResponse = {
    locations: [
      {
        id: 1,
        name: 'Niterói'
      }
    ]
  }

  beforeEach(module('cadeasalaAdmin'));

  beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$httpBackend_, _Location_, _GrowlService_, _usSpinnerService_) {
    $state = _$state_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    Location = _Location_;
    GrowlService = _GrowlService_;
    usSpinnerService = _usSpinnerService_;
    $httpBackend.whenGET(/\.html$/).respond('');
  }));

  it('should have route for home', function() {
    expect($state.href('homeState')).toEqual('#/');
  });

  describe('route configured', function() {
    var state;

    beforeEach(function() {
      state = $state.get('homeState');
    });

    it('should have an url', function() {
      expect(state.url).toEqual('/');
    });

    it('should have a template', function() {
      expect(state.templateUrl).toEqual('templates/home.html');
    });

    it('should have a controller', function() {
      expect(state.controller).toEqual('HomeController');
    });
  });

  describe('resource', function() {
    it('should call api locations url', function() {
      $httpBackend.expectGET(locationURL).respond(200, locationResponse);
      var locations = Location.get();
      $httpBackend.flush();
      expect(locations).toBeTruthy();
    });
  });

  function loadController() {
    $controller('HomeController', { $scope: $scope });
  }

  beforeEach(function() {
    spyOn(usSpinnerService, 'stop');
    spyOn(GrowlService, 'growl');
  })

  describe('when initializing', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expectGET(locationURL).respond(200, locationResponse);
        loadController();
        $httpBackend.flush();
      });

      it('gets locations', function() {
        expect($scope.locations).toEqual(locationResponse.locations);
      });

      it('stops spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalledWith('locations');
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expectGET(locationURL).respond(400, {});
        loadController();
        $httpBackend.flush();
      });

      it('shows error message', function() {
        expect(GrowlService.growl).toHaveBeenCalledWith('Algum problema aconteceu. Tente novamente.');
      });

      it('stops spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalledWith('locations');
      });
    });
  });

  describe('#goToLocation', function() {
    var location = {
      id: 1
    }

    beforeEach(function() {
      spyOn($state, 'go');
      loadController();
      $scope.goToLocation(location);
    });

    it('sends user to location state', function() {
      expect($state.go).toHaveBeenCalledWith('locationState', {locationId: location.id});
    });
  });
});