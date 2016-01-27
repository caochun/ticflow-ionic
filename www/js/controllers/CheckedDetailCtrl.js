angular.module('ticflow.controllers')

.controller('CheckedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCheckedDetail();
    });

    $scope.loadCheckedDetail = function () {
        $scope.isManager = (API.getRole() == 'manager');

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                console.log(JSON.stringify(list));
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy-MM-dd HH:mm");
                $scope.list.completeTime = $filter('date')($scope.list.completeTime, "yyyy-MM-dd HH:mm");
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadCheckedDetail();
    };

    $scope.modify = function () {
        API.modifyList($scope.list._id, $scope.list)
            .success(function (list) {
                $rootScope.notify("修改成功!");
            })
            .error(function () {
                $rootScope.notify("修改失败！请检查您的网络！");
            });
    };
});