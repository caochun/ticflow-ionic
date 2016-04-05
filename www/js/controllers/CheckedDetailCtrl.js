angular.module('ticflow.controllers')

.controller('CheckedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $filter, $ionicModal, $ionicPopup) {

    $scope.record = {
        oldValue: "",
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCheckedDetail();
    });

    $scope.loadCheckedDetail = function () {
        $scope.isManager = (API.getRole() == 'manager');
        $scope.isAdmin = (API.getRole() == 'admin');

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy-MM-dd HH:mm");
                $scope.list.completeTime = $filter('date')($scope.list.completeTime, "yyyy-MM-dd HH:mm");
                $scope.list.checkTime = $filter('date')($scope.list.checkTime, "yyyy-MM-dd HH:mm");
                $scope.record.oldValue = $scope.list.value;
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
        if ($scope.list.value !== $scope.record.oldValue) {
            API.modifyList($scope.list._id, $scope.list)
                .success(function (list) {
                    $rootScope.notify("修改成功!");
                    API.newValueChange($scope.record.oldValue, $scope.list.value, API.getId(), $scope.list._id)
                        .success(function (valuechange) {
                            $scope.record.oldValue = $scope.list.value;
                        })
                        .error(function () {
                            $rootScope.notify("新建分值改动信息失败！请检查您的网络！");
                        });
                })
                .error(function () {
                    $rootScope.notify("修改失败！请检查您的网络！");
                });
        } else {
            $rootScope.notify("分值未改动!");
        }
    };

    $ionicModal.fromTemplateUrl('templates/imageModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.imageModal = modal;
    });

    $scope.showImage1 = function () {
        $scope.imageUri = API.getBase() + '/uploads/' + $scope.list.attached1;
        $scope.imageModal.show();
    };

    $scope.showImage2 = function () {
        $scope.imageUri = API.getBase() + '/uploads/' + $scope.list.attached2;
        $scope.imageModal.show();
    };

    $scope.showImage3 = function () {
        $scope.imageUri = API.getBase() + '/uploads/' + $scope.list.attached3;
        $scope.imageModal.show();
    };

    $scope.hideImage = function () {
        $scope.imageModal.hide();
    };

    $scope.remove = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定删除该报修单？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.removeList($scope.list._id)
                    .success(function (list) {
                        $rootScope.notify("删除成功!");
                        $window.location.href = ('#/menu/checked');
                    })
                    .error(function () {
                        $rootScope.notify("删除失败！请检查您的网络！");
                    });
            }
        });
    };

    $scope.callPhone = function () {
        $window.location.href = "tel:" + $scope.list.client.phone_no;
    };
});