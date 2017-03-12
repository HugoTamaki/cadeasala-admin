'use strict';

cadeasalaAdminResources.factory('Course', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/admin/locations/:locationId/courses/:courseId'.format([appConfig.backendURL])
  );
}]);