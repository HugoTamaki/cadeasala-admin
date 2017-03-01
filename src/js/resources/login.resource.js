'use strict';

cadeasalaAdminResources.factory('Login', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/users/sign_in'.format([appConfig.backendURL]),
    null,
    {
      save: {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        transformResponse: function (data, headers) {
          data = JSON.parse(data);

          data.headers = {
            'XSRF-TOKEN': headers('xsrf-token')
          };

          return data
        }
      }
    }
  );
}]);