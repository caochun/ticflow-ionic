angular.module('ticflow.controllers')

.controller('NewVisitingCtrl', function ($rootScope, $scope, API, $window) {
	$scope.visiting = {
		year: "",
		season: "",
		week: "",
        saler: "",
		school: "",
		client_sort: "",
		new: "",
		department: "",
		name: "",
		phone: "",
		result: "",
		opportunity: "",
		money: "",
		comment: "",
	};

	$scope.newVisiting = function() {
        if (!$scope.visiting.year) {
            $rootScope.notify("年份不能为空！");
            return false;
        }

        if (!$scope.visiting.season) {
            $rootScope.notify("季度不能为空！");
            return false;
        }

        if (!$scope.visiting.week) {
            $rootScope.notify("周不能为空！");
            return false;
        }

        if (!$scope.visiting.school) {
            $rootScope.notify("学校不能为空！");
            return false;
        }

        if (!$scope.visiting.client_sort) {
            $rootScope.notify("客户分类不能为空！");
            return false;
        }

        if (!$scope.visiting.new) {
            $rootScope.notify("新/老客户不能为空！");
            return false;
        }

        if (!$scope.visiting.department) {
            $rootScope.notify("院系名称不能为空！");
            return false;
        }

        if (!$scope.visiting.name) {
            $rootScope.notify("客户姓名不能为空！");
            return false;
        }

        if (!$scope.visiting.phone) {
            $rootScope.notify("联系方式不能为空！");
            return false;
        }

        if (!$scope.visiting.result) {
            $rootScope.notify("拜访结果不能为空！");
            return false;
        }

        if (!$scope.visiting.opportunity) {
            $rootScope.notify("有/无商机不能为空！");
            return false;
        }

        if (!$scope.visiting.money) {
            $rootScope.notify("预算金额不能为空！");
            return false;
        }

        if (isNaN($scope.visiting.money)) {
            $rootScope.notify("预算金额不合法！");
            return false;
        }

        $scope.visiting.saler = API.getId();

        API.newVisiting($scope.visiting)
            .success(function (visiting) {
                $rootScope.notify("创建成功!");
                $window.location.href = ('#/menu/visiting');
            })
            .error(function () {
                $rootScope.notify("创建失败！请检查您的网络！");
            });
    };
});