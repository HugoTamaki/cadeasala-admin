'use strict'

describe('LocationController', function() {
  var $controller, $state, $scope, $rootScope, $httpBackend, Location, Course,  GrowlService, usSpinnerService;

  var locationURL = '@@backendURL/admin/locations/1'
  var coursesURL = '@@backendURL/admin/locations/1/courses'

  var locationResponse = {
    location: {
      id: 1,
      name: 'Niterói'
    }
  }

  var coursesResponse = {
    courses: [
      {
        id: 1,
        name: 'Tecnologia'
      }
    ]
  }

  beforeEach(module('cadeasalaAdmin'));

  beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$httpBackend_, _Location_, _Course_, _GrowlService_, _usSpinnerService_) {
    $state = _$state_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    Location = _Location_;
    Course = _Course_;
    GrowlService = _GrowlService_;
    usSpinnerService = _usSpinnerService_;
    $httpBackend.whenGET(/\.html$/).respond('');
  }));

  it('should have route for location', function() {
    expect($state.href('locationState')).toEqual('#/locations/');
  });

  describe('route configured', function() {
    var state;

    beforeEach(function() {
      state = $state.get('locationState');
    });

    it('should have an url', function() {
      expect(state.url).toEqual('/locations/:locationId');
    });

    it('should have a template', function() {
      expect(state.templateUrl).toEqual('templates/location.html');
    });

    it('should have a controller', function() {
      expect(state.controller).toEqual('LocationController');
    });
  });

  describe('resource', function() {
    it('should call api location url', function() {
      $httpBackend.expectGET(locationURL).respond(200, locationResponse);
      var locations = Location.get({locationId: 1});
      $httpBackend.flush();
      expect(locations).toBeTruthy();
    });

    it('should call api courses url', function() {
      $httpBackend.expectGET(coursesURL).respond(200, coursesResponse);
      var courses = Course.get({locationId: 1});
      $httpBackend.flush();
      expect(courses).toBeTruthy();
    });
  });

  function loadController() {
    $controller('LocationController', { $scope: $scope, $stateParams: {locationId: 1} });
  }

  beforeEach(function() {
    spyOn(usSpinnerService, 'stop');
    spyOn(GrowlService, 'growl');
  })

  describe('when initializing', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expectGET(locationURL).respond(200, locationResponse);
        $httpBackend.expectGET(coursesURL).respond(200, coursesResponse);
        loadController();
        $httpBackend.flush();
      });

      it('get location', function() {
        expect($scope.currentLocation).toEqual(locationResponse.location);
      });

      it('get courses', function() {
        expect($scope.courses).toEqual(coursesResponse.courses);
      });

      it('stops spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalledWith('courses');
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expectGET(locationURL).respond(400, {});
        $httpBackend.expectGET(coursesURL).respond(400, {});
        loadController();
        $httpBackend.flush();
      });

      it('shows error message', function() {
        expect(GrowlService.growl).toHaveBeenCalledWith('Algum problema aconteceu. Tente novamente.');
      });

      it('stops spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalledWith('courses');
      });
    });
  });

  describe('#goToCourse', function() {
    var course = {
      id: 1,
      name: 'Tecnologia'
    }

    beforeEach(function() {
      spyOn($state, 'go');
      loadController();
      $scope.goToCourse(course);
    });

    it('sets currentCourse', function() {
      expect($rootScope.currentCourse).toEqual('Tecnologia');
    });

    it('sends user to course state', function() {
      expect($state.go).toHaveBeenCalledWith('courseState', {locationId: locationResponse.location.id, courseId: course.id});
    });
  });
});