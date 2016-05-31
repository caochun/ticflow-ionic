angular.module('ticflow.controllers')

.controller('VisitingDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $filter, $ionicPopup) {

	$scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadVisitingDetail();
    });

    $scope.loadVisitingDetail = function () {

        var _id = $stateParams._id;

        API.getVisitingDetail(_id)
            .success(function (visiting) {
                $scope.visiting = visiting;
                $scope.visiting.date = $filter('date')($scope.visiting.date, "yyyy-MM-dd HH:mm");

                $scope.isCreater = (API.getId() == $scope.visiting.saler)
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadVisitingDetail();
    };

    $scope.callPhone = function () {
        $window.location.href = "tel:" + $scope.visiting.phone;
    };

    $scope.update = function () {
    	API.updateVisiting($scope.visiting._id, $scope.visiting)
            .success(function (visiting) {
                $rootScope.notify("修改成功!");
            })
            .error(function () {
                $rootScope.notify("删除失败！请检查您的网络！");
            });
    };

    $scope.remove = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定删除该拜访记录？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.removeVisiting($scope.visiting._id)
                    .success(function (visiting) {
                        $rootScope.notify("删除成功!");
                        $window.location.href = ('#/menu/visiting');
                    })
                    .error(function () {
                        $rootScope.notify("删除失败！请检查您的网络！");
                    });
            }
        });
    };
});