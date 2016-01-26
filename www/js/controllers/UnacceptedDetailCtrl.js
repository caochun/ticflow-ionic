angular.module('ticflow.controllers')

.controller('UnacceptedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadUnacceptedDetail();
    });

    $scope.loadUnacceptedDetail = function () {
        $scope.isManager = (API.getRole() == 'manager');
        $scope.isEngineer = (API.getRole() == 'engineer');

        if ($scope.isManager) {
            API.getUsers({role: 'saler'})
                .success(function (salers) {
                    $scope.salers = salers;
                })
                .error(function () {
                    $rootScope.notify("获取销售列表失败！请检查您的网络！");
                });
            API.getUsers({role: 'engineer'})
                .success(function (engineers) {
                    $scope.engineers = engineers;
                })
                .error(function () {
                    $rootScope.notify("获取工程师列表失败！请检查您的网络！");
                });
        }

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy/MM/dd HH:mm");
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadUnacceptedDetail();
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

    $scope.accept = function () {
        if (!$scope.list.serveTime) {
            $rootScope.notify("请选择上门时间！");
            return false;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '确定接单？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.modifyList($scope.list._id, {accepted: true, acceptTime: new Date(), serveTime: $scope.list.serveTime})
                    .success(function (list) {
                        $rootScope.notify("接单成功!");
                        $window.location.href = ('#/menu/unaccepted');
                    })
                    .error(function () {
                        $rootScope.notify("接单失败！请检查您的网络！");
                    });
            }
        });

    };
});