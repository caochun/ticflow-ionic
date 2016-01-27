angular.module('ticflow.controllers')

.controller('CheckedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.select = {
        saler: "",
        engineer: "",
        month: "",
    };
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.hasNextPage = false;

    $scope.$on('$ionicView.beforeEnter', function () {

        $scope.isManager = (API.getRole() == 'manager');
        $scope.isAdmin = (API.getRole() == 'admin');
        $scope.isSaler = (API.getRole() == 'saler');
        $scope.isEngineer = (API.getRole() == 'engineer');

        //$scope.select.month = $filter('date')(new Date(), "yyyy-MM");

        if ($scope.isManager || $scope.isAdmin) {
            API.getUsers({role: 'saler'})
                .success(function (salers) {
                    $scope.salers = salers;
                })
                .error(function () {
                    $rootScope.notify("获取销售人员列表失败！请检查您的网络！");
                });

            API.getUsers({role: 'engineer'})
                .success(function (engineers) {
                    $scope.engineers = engineers;
                })
                .error(function () {
                    $rootScope.notify("获取工程师列表失败！请检查您的网络！");
                });
        }

        API.getMonths()
            .success(function (months) {
                //months.push($scope.select.month);
                $scope.months = months.sort().reverse();
            })
            .error(function () {
                $rootScope.notify("获取月份列表失败！请检查您的网络！");
            });

        $scope.loadChecked();
    });

    $scope.loadChecked = function () {

        var query = {checked: true}, queryV = {checked: true};
        if ($scope.isSaler) {
            query.saler = API.getId();
            queryV.saler = API.getId();
        }
        else if ($scope.isEngineer) {
            query.engineer = API.getId();
            queryV.engineer = API.getId();
        }
        else if ($scope.isManager || $scope.isAdmin) {
            if ($scope.select.saler !== "") {
                query.saler = $scope.select.saler;
                queryV.saler = $scope.select.saler;
            }
            if ($scope.select.engineer !== "") {
                query.engineer = $scope.select.engineer;
                queryV.engineer = $scope.select.engineer;
            }
        }
        if ($scope.select.month !== "") {
            query.checkMonth = $scope.select.month;
            queryV.checkMonth = $scope.select.month;
        }
        API.getTotalValue(queryV)
            .success(function (totalValue) {
                $scope.totalValue = totalValue;
            })
            .error(function () {
                $rootScope.notify("获取已审核报修单总分失败！请检查您的网络！");
            });

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsChecked) {
                $scope.hasNextPage = listsChecked.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                listsChecked.forEach(function (entry) {
                    entry.checkTime = $filter('date')(entry.checkTime, "yyyy-MM-dd HH:mm");
                });
                $scope.listsChecked = listsChecked;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {

        var query = {checked: true};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();
        else if ($scope.isManager || $scope.isAdmin) {
            if ($scope.select.saler !== "")
                query.saler = $scope.select.saler;
            if ($scope.select.engineer !== "")
                query.engineer = $scope.select.engineer;
        }
        if ($scope.select.month !== "")
            query.checkMonth = $scope.select.month;

        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsChecked) {
                $scope.hasNextPage = listsChecked.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                listsChecked.forEach(function (entry) {
                    entry.checkTime = $filter('date')(entry.checkTime, "yyyy-MM-dd HH:mm");
                });
                $scope.listsChecked = $scope.listsChecked.concat(listsChecked);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadChecked();
    };
});