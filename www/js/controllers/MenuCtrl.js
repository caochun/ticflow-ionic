angular.module('ticflow.controllers')

.controller('MenuCtrl', function ($rootScope, $scope, API, $window) {
    $scope.logout = function() {
        API.logout();
        $window.location.href = ('#/auth/signin');
    };
    $scope.isManager = function () {
        return API.getRole() == 'manager';
    };
    $scope.showUncompleted = function() {
        var role = API.getRole();
        return role == 'manager' || role == 'saler' || role == 'engineer';
    };
    $scope.showCompleted = function() {
        var role = API.getRole();
        return role == 'manager' || role == 'saler' || role == 'engineer';
    };
    $scope.showChecked = function() {
        var role = API.getRole();
        return role == 'manager' || role == 'saler' || role == 'engineer';
    };
    $scope.isAdmin = function() {
        var role = API.getRole();
        return API.getRole() == 'admin';
    };
});