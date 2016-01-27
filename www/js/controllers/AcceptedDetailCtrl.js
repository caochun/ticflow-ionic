angular.module('ticflow.controllers')

.controller('AcceptedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadAcceptedDetail();
    });

    $scope.loadAcceptedDetail = function () {
        $scope.isManager = (API.getRole() == 'manager');
        $scope.isEngineer = (API.getRole() == 'engineer');

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy-MM-dd HH:mm");
                $scope.list.serveTime = $filter('date')($scope.list.serveTime, "yyyy-MM-dd HH:mm");
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadAcceptedDetail();
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

    $scope.submit = function () {
        if (!$scope.list.serial_no) {
            $rootScope.notify("请输入序列号！");
            return false;
        }

        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="list.feedback">',
            title: '请输入提交反馈信息',
            scope: $scope,
            buttons: [
                { text: '<b>取消</b>' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.list.feedback) {
                            e.preventDefault();
                        } else {
                            API.modifyList($scope.list._id, {serial_no: $scope.list.serial_no, completed: true, completeTime: new Date(), feedback: $scope.list.feedback})
                                .success(function (list) {
                                    $rootScope.notify("提交成功!");
                                    $window.location.href = ('#/menu/accepted');
                                })
                                .error(function () {
                                    $rootScope.notify("提交失败！请检查您的网络！");
                                });
                        }
                    }
                }
            ]
        });
    };
});