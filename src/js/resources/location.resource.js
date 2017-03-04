'use strict';

cadeasalaAdminResources.factory('Location', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/admin/locations'.format([appConfig.backendURL])
  );
}]);