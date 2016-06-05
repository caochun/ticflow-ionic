angular.module('ticflow.controllers')

.controller('ProfitCtrl', function ($rootScope, $scope, API, $window) {
	$scope.select = {
	    month: "",
    };
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.hasNextPage = false;

    $scope.$on('$ionicView.beforeEnter', function () {
        API.getMonthsFinance()
            .success(function (months) {
                $scope.months = months.sort().reverse();
            })
            .error(function () {
                $rootScope.notify("获取月份列表失败！请检查您的网络！");
            });

        $scope.loadProfit();
    });

    $scope.loadProfit = function () {

        var query = {saler: API.getId()};
        if ($scope.select.month !== "") {
            query.month = $scope.select.month;
        }
        API.getTotalProfit(query)
            .success(function (totalProfit) {
                $scope.totalProfit = totalProfit;
            })
            .error(function () {
                $rootScope.notify("获取净利润总计失败！请检查您的网络！");
            });
    };

    $scope.doRefresh = function () {
        $scope.loadProfit();
    };
});