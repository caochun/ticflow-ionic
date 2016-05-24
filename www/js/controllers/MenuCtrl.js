angular.module('ticflow.controllers')

.controller('MenuCtrl', function ($rootScope, $scope, API, $window) {

    $scope.submenu = {
        list: false,
        sale: false,
        finance: false
    };

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
            case 'treasurer':
                $scope.username = API.getId() + "(财务员)";
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

    $scope.isEngineer = function () {
        return API.getRole() == 'engineer';
    };

    $scope.isManager = function () {
        return API.getRole() == 'manager';
    };

    $scope.isAdmin = function () {
        return API.getRole() == 'admin';
    };

    $scope.isTreasurer = function () {
        return API.getRole() == 'treasurer';
    };

    $scope.isSalerAssistant = function () {
        var id = API.getId();
        return id == "周强" || id == "陆珺" || id == "周坚" || id == "王敏";
    };
    
    $scope.logout = function() {
        API.logout();
        $window.location.href = ('#/signin');
    };

    $scope.toggleList = function() {
        $scope.submenu.list = !$scope.submenu.list;
    };

    $scope.toggleSale = function() {
        $scope.submenu.sale = !$scope.submenu.sale;
    };

    $scope.toggleFinance = function() {
        $scope.submenu.finance = !$scope.submenu.finance;
    };
});