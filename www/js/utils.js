angular.module('ticflow.utils')

.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    get: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    remove: function(key) {
      return $window.localStorage.removeItem(key);
    }
  };
}]);
