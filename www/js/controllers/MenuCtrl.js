angular.module('ticflow.controllers')

.controller('MenuCtrl', function ($rootScope, $scope, API, $window) {

    $scope.isEngineer = function () {
        return API.getRole() == 'engineer';
    };

    $scope.isSaler = function () {
        return API.getRole() == 'saler';
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadData();
    });

    $scope.loadData = function () {
        if (API.getRole() == 'engineer') {
            API.getNumber({engineer: API.getId(), completed: false})
                .success(function (uncompletedNumber) {
                    $scope.uncompletedNumber = uncompletedNumber;
                })
                .error(function () {
                    $rootScope.notify("获取未完成报修单数量失败！请检查您的网络！");
                });
        }

        if (API.getRole() == 'saler') {
            API.getNumber({saler: API.getId(), completed: true, checked: false})
                .success(function (completedNumber) {
                    $scope.completedNumber = completedNumber;
                })
                .error(function () {
                    $rootScope.notify("获取未完成报修单数量失败！请检查您的网络！");
                });
        }
    };

    $scope.isManager = function () {
        return API.getRole() == 'manager';
    };

    $scope.isAdmin = function () {
        return API.getRole() == 'admin';
    };
    
    $scope.logout = function() {
        API.logout();
        $window.location.href = ('#/auth/signin');
    };
});