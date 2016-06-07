angular.module('ticflow.controllers')

.controller('TracingDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup) {

	$scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadTracingDetail();
    });

    $scope.loadTracingDetail = function () {

        var _id = $stateParams._id;

        API.getTracingDetail(_id)
            .success(function (tracing) {
                $scope.tracing = tracing;

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
        if (!$scope.tracing.year) {
            $rootScope.notify("年份不能为空！");
            return false;
        }

        if (!$scope.tracing.season) {
            $rootScope.notify("季度不能为空！");
            return false;
        }

        if (!$scope.tracing.week) {
            $rootScope.notify("周不能为空！");
            return false;
        }

        if (!$scope.tracing.school) {
            $rootScope.notify("学校不能为空！");
            return false;
        }

        if (!$scope.tracing.department) {
            $rootScope.notify("院系名称不能为空！");
            return false;
        }

        if (!$scope.tracing.name) {
            $rootScope.notify("客户姓名不能为空！");
            return false;
        }

        if (!$scope.tracing.phone) {
            $rootScope.notify("联系方式不能为空！");
            return false;
        }

        if (!$scope.tracing.projectName) {
            $rootScope.notify("项目名称不能为空！");
            return false;
        }

        if (!$scope.tracing.budget) {
            $rootScope.notify("项目预算不能为空！");
            return false;
        }

        if (isNaN($scope.tracing.budget)) {
            $rootScope.notify("项目预算不合法！");
            return false;
        }

        if (!$scope.tracing.fund) {
            $rootScope.notify("项目经费不能为空！");
            return false;
        }

        if (isNaN($scope.tracing.fund)) {
            $rootScope.notify("项目经费不合法！");
            return false;
        }

        if (!$scope.tracing.plan) {
            $rootScope.notify("项目进度不能为空！");
            return false;
        }

        if (!$scope.tracing.percent) {
            $rootScope.notify("中标率不能为空！");
            return false;
        }

        if (!$scope.tracing.product) {
            $rootScope.notify("投标产品不能为空！");
            return false;
        }

        if (!$scope.tracing.competitor) {
            $rootScope.notify("竞争对手不能为空！");
            return false;
        }

        if (!$scope.tracing.overview) {
            $rootScope.notify("各投标价及产品概述不能为空！");
            return false;
        }

        if (!$scope.tracing.summary) {
            $rootScope.notify("项目总结不能为空！");
            return false;
        }
        
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
            title: '确定删除商机管理？',
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