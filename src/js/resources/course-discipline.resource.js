'use strict';

cadeasalaAdminResources.factory('CourseDiscipline', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/admin/locations/:locationId/courses/:courseId/course_disciplines'.format([appConfig.backendURL])
  );
}]);