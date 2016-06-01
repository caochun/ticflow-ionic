angular.module('ticflow.controllers')

.controller('NewTracingCtrl', function ($rootScope, $scope, API, $window) {
	$scope.tracing = {
		year: "",
		season: "",
		week: "",
        saler: "",
		school: "",
		department: "",
		name: "",
		phone: "",
        projectName: "",
		budget: "",
        fund: "",
        plan: "",
        percent: "",
        product: "",
        competitor: "",
        result: "",
        overview: "",
        summary: "",
		comment: "",
	};

	$scope.newTracing = function() {
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

        if (!$scope.tracing.result) {
            $rootScope.notify("招标结果不能为空！");
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

        $scope.tracing.saler = API.getId();

        API.newTracing($scope.tracing)
            .success(function (tracing) {
                $rootScope.notify("创建成功!");
                $window.location.href = ('#/menu/tracing');
            })
            .error(function () {
                $rootScope.notify("创建失败！请检查您的网络！");
            });
    };
});