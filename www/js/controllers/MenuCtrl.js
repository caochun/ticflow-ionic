angular.module('ticflow.controllers')

.controller('MenuCtrl', function ($rootScope, $scope, API, $window) {

    $scope.$on('$ionicView.beforeEnter', function () {
        switch (API.getRole()) {
            case 'manager':
                $scope.username = API.getId() + "(派单员)";
                break;
            case 'saler':
                $scope.username = API.getId() + "(销售人员)";
                break;
            case 'engineer':
                $scope.username = API.getId() + "(工程师)";
                break;
            case 'admin':
                $scope.username = API.getId() + "(管理员)";
                break;
            default:
                API.logout();
                $window.location.href = ('#/signin');
        }
    });

    // $scope.isEngineer = function () {
    //     return API.getRole() == 'engineer';
    // };

    $scope.isSaler = function () {
        return API.getRole() == 'saler';
    };

    $scope.isManager = function () {
        return API.getRole() == 'manager';
    };

    $scope.isAdmin = function () {
        return API.getRole() == 'admin';
    };
    
    $scope.logout = function() {
        API.logout();
        $window.location.href = ('#/signin');
    };
});