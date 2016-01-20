angular.module('ticflow.controllers')

.controller('CheckedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCheckedDetail();
    });

    $scope.loadCheckedDetail = function () {
        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy/MM/dd HH:mm");
                $scope.list.completed = "已完成";
                $scope.list.checked = "已审核";
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
});