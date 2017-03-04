'use strict';

cadeasalaAdminResources.factory('CourseDisciplineBulkUpdate', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/admin/locations/:locationId/courses/:courseId/course_disciplines/bulk_update'.format([appConfig.backendURL]),
    null,
    {
      update: {
        method: 'PUT',
        headers: {'Content-type': 'application/json'}
      }
    }
  );
}]);