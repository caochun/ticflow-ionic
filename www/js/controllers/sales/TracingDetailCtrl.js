angular.module('ticflow.controllers')

.controller('TracingDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $filter, $ionicPopup) {

	$scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadTracingDetail();
    });

    $scope.loadTracingDetail = function () {

        var _id = $stateParams._id;

        API.getTracingDetail(_id)
            .success(function (tracing) {
                $scope.tracing = tracing;
                $scope.tracing.date = $filter('date')($scope.tracing.date, "yyyy-MM-dd HH:mm");

                $scope.isCreater = (API.getId() == $scope.tracing.saler)
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadTracingDetail();
    };

    $scope.callPhone = function () {
        $window.location.href = "tel:" + $scope.tracing.phone;
    };

    $scope.update = function () {
    	API.updateTracing($scope.tracing._id, $scope.tracing)
            .success(function (tracing) {
                $rootScope.notify("修改成功!");
            })
            .error(function () {
                $rootScope.notify("删除失败！请检查您的网络！");
            });
    };

    $scope.remove = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定删除项目跟踪？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.removeTracing($scope.tracing._id)
                    .success(function (tracing) {
                        $rootScope.notify("删除成功!");
                        $window.location.href = ('#/menu/tracing');
                    })
                    .error(function () {
                        $rootScope.notify("删除失败！请检查您的网络！");
                    });
            }
        });
    };
});