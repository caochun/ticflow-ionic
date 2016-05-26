angular.module('ticflow.controllers')

.controller('ExpenseCtrl', function ($rootScope, $scope, API, $window) {
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

        $scope.loadExpense();
    });

    $scope.loadExpense = function () {

        var query = {saler: API.getId()}, queryV = {saler: API.getId()};
        if ($scope.select.month !== "") {
            query.month = $scope.select.month;
            queryV.month = $scope.select.month;
        }
        API.getTotalExpense(queryV)
            .success(function (totalExpense) {
                $scope.totalExpense = totalExpense;
            })
            .error(function () {
                $rootScope.notify("获取费用总计失败！请检查您的网络！");
            });

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getExpense(query)
            .success(function (expense) {
                $scope.hasNextPage = expense.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                expense.forEach(function (entry) {
                    if (entry.detail == "travel")
                    	entry.detail = "差旅费";
                    else if (entry.detail == "entertainment")
                    	entry.detail = "招待费";
                    else if (entry.detail == "bidding")
                    	entry.detail = "投标费";
                    else if (entry.detail == "brokerage")
                    	entry.detail = "佣金";
                    else if (entry.detail == "others")
                    	entry.detail = "其他";
                    if (entry.comment == "")
                    	entry.comment = "无";
                });
                $scope.expense = expense;
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

        API.getExpense(query)
            .success(function (expense) {
                $scope.hasNextPage = expense.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                expense.forEach(function (entry) {
                    if (entry.detail == "travel")
                    	entry.detail = "差旅费";
                    else if (entry.detail == "entertainment")
                    	entry.detail = "招待费";
                    else if (entry.detail == "bidding")
                    	entry.detail = "投标费";
                    else if (entry.detail == "brokerage")
                    	entry.detail = "佣金";
                    else if (entry.detail == "others")
                    	entry.detail = "其他";
                    if (entry.comment == "")
                    	entry.comment = "无";
                });
                $scope.expense = $scope.expense.concat(expense);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadExpense();
    };
});