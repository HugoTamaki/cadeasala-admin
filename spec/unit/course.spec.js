'use strict'

describe('CourseController', function() {
  var $controller, $state, $scope, $rootScope, $httpBackend, Location, Course, CourseDiscipline, GrowlService, usSpinnerService;

  var locationURL = '@@backendURL/admin/locations/1'
  var courseURL = '@@backendURL/admin/locations/1/courses/1'
  var courseDisciplinesURL = '@@backendURL/admin/locations/1/courses/1/course_disciplines'
  var bulkUpdateURL = '@@backendURL/admin/locations/1/courses/1/course_disciplines/bulk_update'

  var locationResponse = {
    location: {
      id: 1,
      name: 'Niterói'
    }
  }

  var courseResponse = {
    course: {
      id: 1,
      name: 'Tecnologia'
    }
  }

  var courseDisciplinesResponse = {
    course_disciplines: [
      {
        id: 1,
        name: 'Discipline name',
        ap1_local: 'Teste',
        ap1_date: 'Teste',
        ap2_local: 'Teste',
        ap2_date: 'Teste',
        ap3_local: 'Teste',
        ap3_date: 'Teste',
        ad1_deadline: 'Teste',
        ad2_deadline: 'Teste',
        presencial_tutor: 'Teste',
        tutorship_room: 'Teste',
        tutorship_time: 'Teste',
        tutorship_weekday: 'Teste'
      }
    ]
  }

  beforeEach(module('cadeasalaAdmin'));

  beforeEach(inject(function(_$controller_, _$state_, _$rootScope_, _$httpBackend_, _Location_, _Course_, _CourseDiscipline_, _GrowlService_, _usSpinnerService_) {
    $state = _$state_;
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    Location = _Location_;
    Course = _Course_;
    CourseDiscipline = _CourseDiscipline_;
    GrowlService = _GrowlService_;
    usSpinnerService = _usSpinnerService_;
    $httpBackend.whenGET(/\.html$/).respond('');
  }));

  it('should have route for course', function() {
    expect($state.href('courseState', {locationId: 1, courseId: 1})).toEqual('#/locations/1/courses/1');
  });

  describe('route configured', function() {
    var state;

    beforeEach(function() {
      state = $state.get('courseState', {locationId: 1, courseId: 1});
    });

    it('should have an url', function() {
      expect(state.url).toEqual('/locations/:locationId/courses/:courseId');
    });

    it('should have a template', function() {
      expect(state.templateUrl).toEqual('templates/course.html');
    });

    it('should have a controller', function() {
      expect(state.controller).toEqual('CourseController');
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
      $httpBackend.expectGET(courseURL).respond(200, courseResponse);
      var courses = Course.get({locationId: 1, courseId: 1});
      $httpBackend.flush();
      expect(courses).toBeTruthy();
    });

    it('should call api courseDisciplines url', function() {
      $httpBackend.expectGET(courseDisciplinesURL).respond(200, courseDisciplinesResponse);
      var courseDisciplines = CourseDiscipline.get({locationId: 1, courseId: 1});
      $httpBackend.flush();
      expect(courseDisciplines).toBeTruthy();
    });
  });

  function loadController() {
    $controller('CourseController', { $scope: $scope, $stateParams: {locationId: 1, courseId: 1} });
  }

  beforeEach(function() {
    spyOn(usSpinnerService, 'stop');
    spyOn(usSpinnerService, 'spin');
    spyOn(GrowlService, 'growl');
  })

  describe('when initializing', function() {
    describe('success', function() {
      beforeEach(function() {
        $httpBackend.expectGET(locationURL).respond(200, locationResponse);
        $httpBackend.expectGET(courseURL).respond(200, courseResponse);
        $httpBackend.expectGET(courseDisciplinesURL).respond(200, courseDisciplinesResponse);
        loadController();
        $httpBackend.flush();
      });

      it('get location', function() {
        expect($scope.currentLocation).toEqual(locationResponse.location);
      });

      it('get course', function() {
        expect($scope.currentCourse).toEqual(courseResponse.course);
      });

      it('get courseDisciplines', function() {
        expect($scope.courseDisciplines).toEqual(courseDisciplinesResponse.course_disciplines);
      });

      it('stops spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalledWith('disciplines');
      });

      it('sets datetimeOptions', function() {
        expect($scope.datetimeOptions).toEqual({
          format: 'DD/MM/YYYY HH:mm a'
        });
      });

      it('sets dateOptions', function() {
        expect($scope.dateOptions).toEqual({
          format: 'DD/MM/YYYY'
        });
      });
    });

    describe('failure', function() {
      beforeEach(function() {
        $httpBackend.expectGET(locationURL).respond(400, {});
        $httpBackend.expectGET(courseURL).respond(400, {});
        $httpBackend.expectGET(courseDisciplinesURL).respond(400, {});
        loadController();
        $httpBackend.flush();
      });

      it('shows error message', function() {
        expect(GrowlService.growl).toHaveBeenCalledWith('Algum problema aconteceu. Tente novamente.');
      });

      it('stops spinner', function() {
        expect(usSpinnerService.stop).toHaveBeenCalledWith('disciplines');
      });
    });

    describe('#goToLocation', function() {
      var location = {
        id: 1,
        name: 'Niteroi'
      }

      beforeEach(function() {
        spyOn($state, 'go');
        loadController();
        $scope.goToLocation(location);
      });

      it('sends user to course state', function() {
        expect($state.go).toHaveBeenCalledWith('locationState', {locationId: locationResponse.location.id});
      });
    });

    describe('#updateCourseDisciplines', function() {
      describe('success', function() {
        beforeEach(function() {
          $httpBackend.expectGET(locationURL).respond(200, locationResponse);
          $httpBackend.expectGET(courseURL).respond(200, courseResponse);
          $httpBackend.expectGET(courseDisciplinesURL).respond(200, courseDisciplinesResponse);
          loadController();
          $httpBackend.flush();
          $httpBackend.expectPUT(bulkUpdateURL).respond(200, courseDisciplinesResponse);
          $scope.updateCourseDisciplines();
          $httpBackend.flush();
        })

        it('spins spinner', function() {
          expect(usSpinnerService.spin).toHaveBeenCalledWith('disciplines');
        });

        it('shows success message', function() {
          expect(GrowlService.growl).toHaveBeenCalledWith('Dados atualizados.');
        });

        it('stops spinner', function() {
          expect(usSpinnerService.stop).toHaveBeenCalledWith('disciplines');
        });

        it('sets courseDisciplines', function() {
          expect($scope.courseDisciplines).toEqual(courseDisciplinesResponse.course_disciplines);
        });
      });

      describe('failure', function() {
        beforeEach(function() {
          $httpBackend.expectGET(locationURL).respond(200, locationResponse);
          $httpBackend.expectGET(courseURL).respond(200, courseResponse);
          $httpBackend.expectGET(courseDisciplinesURL).respond(200, courseDisciplinesResponse);
          loadController();
          $httpBackend.flush();
          $httpBackend.expectPUT(bulkUpdateURL).respond(400, {});
          $scope.updateCourseDisciplines();
          $httpBackend.flush();
        })

        it('spins spinner', function() {
          expect(usSpinnerService.spin).toHaveBeenCalledWith('disciplines');
        });

        it('shows success message', function() {
          expect(GrowlService.growl).toHaveBeenCalledWith('Algum problema aconteceu. Tente novamente.');
        });

        it('stops spinner', function() {
          expect(usSpinnerService.stop).toHaveBeenCalledWith('disciplines');
        });
      });
    });

    describe('#eraseCourseDisciplinesData', function() {
      beforeEach(function() {
        $httpBackend.expectGET(locationURL).respond(200, locationResponse);
        $httpBackend.expectGET(courseURL).respond(200, courseResponse);
        $httpBackend.expectGET(courseDisciplinesURL).respond(200, courseDisciplinesResponse);
        loadController();
        $httpBackend.flush();
      });

      it('erases data from all $scope.courseDisciplines', function() {
        expect($scope.courseDisciplines.toString()).toEqual({
          id: 1,
          name: 'Discipline name',
          ap1_local: 'Teste',
          ap1_date: 'Teste',
          ap2_local: 'Teste',
          ap2_date: 'Teste',
          ap3_local: 'Teste',
          ap3_date: 'Teste',
          ad1_deadline: 'Teste',
          ad2_deadline: 'Teste',
          presencial_tutor: 'Teste',
          tutorship_room: 'Teste',
          tutorship_time: 'Teste',
          tutorship_weekday: 'Teste'
        }.toString());

        $scope.eraseCourseDisciplinesData();

        expect($scope.courseDisciplines.toString()).toEqual({
          id: 1,
          name: 'Discipline name',
          ap1_local: null,
          ap1_date: null,
          ap2_local: null,
          ap2_date: null,
          ap3_local: null,
          ap3_date: null,
          ad1_deadline: null,
          ad2_deadline: null,
          presencial_tutor: null,
          tutorship_room: null,
          tutorship_time: null,
          tutorship_weekday: null
        }.toString());
      });
    });
  });
});