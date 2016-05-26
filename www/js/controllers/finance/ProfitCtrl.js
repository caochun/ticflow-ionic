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

        var query = {saler: API.getId()}, queryV = {saler: API.getId()};
        if ($scope.select.month !== "") {
            query.month = $scope.select.month;
            queryV.month = $scope.select.month;
        }
        API.getTotalProfit(queryV)
            .success(function (totalProfit) {
                $scope.totalProfit = totalProfit;
            })
            .error(function () {
                $rootScope.notify("获取费用总计失败！请检查您的网络！");
            });

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getProfit(query)
            .success(function (profit) {
                $scope.hasNextPage = profit.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                profit.forEach(function (entry) {
                    entry.detail = "利润";
                    if (entry.comment == "")
                    	entry.comment = "无";
                });
                $scope.profit = profit;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {

        var query = {saler: API.getId()};
        if ($scope.select.month !== "")
            query.month = $scope.select.month;

        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getProfit(query)
            .success(function (profit) {
                $scope.hasNextPage = profit.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                profit.forEach(function (entry) {
                    entry.detail = "利润";
                    if (entry.comment == "")
                    	entry.comment = "无";
                });
                $scope.profit = $scope.profit.concat(profit);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadProfit();
    };
});