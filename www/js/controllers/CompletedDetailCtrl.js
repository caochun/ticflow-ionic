angular.module('ticflow.controllers')

.controller('CompletedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter) {

    $scope.record = {
        oldValue: "",
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCompletedDetail();
    });

    $scope.loadCompletedDetail = function () {
        $scope.isManager = (API.getRole() == 'manager');
        $scope.isSaler = (API.getRole() == 'saler');

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy-MM-dd HH:mm");
                $scope.list.completeTime = $filter('date')($scope.list.completeTime, "yyyy-MM-dd HH:mm");
                $scope.record.oldValue = $scope.list.value;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadCompletedDetail();
    };

    $scope.modify = function () {
        if ($scope.list.value !== $scope.record.oldValue) {
            API.modifyList($scope.list._id, $scope.list)
                .success(function (list) {
                    $rootScope.notify("修改成功!");
                })
                .error(function () {
                    $rootScope.notify("修改失败！请检查您的网络！");
                });
            API.newValueChange($scope.record.oldValue, $scope.list.value, API.getId(), $scope.list._id)
                .success(function (valuechange) {
                    $scope.record.oldValue = $scope.list.value;
                    console.log(JSON.stringify(valuechange));
                })
                .error(function () {
                    $rootScope.notify("新建分值改动信息失败！请检查您的网络！");
                });
        } else {
            $rootScope.notify("分值未改动!");
        }
    };

    $scope.check = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定审核通过这个订单？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.modifyList($scope.list._id, {checked: true, checkTime: new Date(), checkMonth: $filter('date')(new Date(), "yyyy-MM")})
                    .success(function (list) {
                        $rootScope.notify("审核成功!");
                        $window.location.href = ('#/menu/completed');
                    })
                    .error(function () {
                        $rootScope.notify("审核失败！请检查您的网络！");
                    });
            }
        });
    };
});