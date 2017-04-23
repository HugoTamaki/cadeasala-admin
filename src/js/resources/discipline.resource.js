'use strict';

'use strict';

cadeasalaAdminResources.factory('Discipline', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/admin/disciplines/:disciplineId'.format([appConfig.backendURL]),
    null,
    {
      update: {
        method: 'PUT',
        headers: {'Content-type': 'application/json'}
      }
    }
  );
}]);