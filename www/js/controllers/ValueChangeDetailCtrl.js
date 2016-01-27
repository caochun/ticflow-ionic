angular.module('ticflow.controllers')

.controller('ValueChangeDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter) {

    $scope.list_local = {
        state: "",
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadValueChangeDetail();
    });

    $scope.loadValueChangeDetail = function () {

        var _id = $stateParams._id;

        API.getValueChange(_id)
            .success(function (valuechange) {
                $scope.loadListDetail(valuechange.list_id);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            });
    };

    $scope.loadListDetail = function (list_id) {
        API.getList(list_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy-MM-dd HH:mm");
                if ($scope.list.accepted === false)
                    $scope.list_local.state = "未接";
                else if ($scope.list.completed === false)
                    $scope.list_local.state = "已接";
                else if ($scope.list.checked === false)
                    $scope.list_local.state = "已完成";
                else
                    $scope.list_local.state = "已审核";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadValueChangeDetail();
    };

    $scope.remove = function () {

        var _id = $stateParams._id;

        API.removeValueChange(_id)
            .success(function (valuechange) {
                $rootScope.notify("删除成功！");
                $window.location.href = ('#/menu/valuechange');
            })
            .error(function () {
                $rootScope.notify("删除失败！请检查您的网络！");
            });
    };
});