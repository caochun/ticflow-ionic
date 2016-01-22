angular.module('ticflow.controllers')

.controller('UncompletedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadUncompletedDetail();
    });

    $scope.loadUncompletedDetail = function () {
        $scope.isManager = (API.getRole() == 'manager');
        $scope.isEngineer = (API.getRole() == 'engineer');

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

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy/MM/dd HH:mm");
                $scope.list.completed = "未完成";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadUncompletedDetail();
    };

    $scope.modify = function () {
        $scope.list.completed = false;
        API.modifyList($scope.list._id, $scope.list)
            .success(function (list) {
                $rootScope.notify("修改成功!");
            })
            .error(function () {
                $rootScope.notify("修改失败！请检查您的网络！");
            });
    };

    $scope.submit = function () {
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
                            API.modifyList($scope.list._id, {completeTime: (new Date), feedback: $scope.list.feedback, completed: true})
                                .success(function (list) {
                                    $rootScope.notify("提交成功!");
                                    $window.location.href = ('#/menu/uncompleted');
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