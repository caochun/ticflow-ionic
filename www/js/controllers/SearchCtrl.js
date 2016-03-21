angular.module('ticflow.controllers')

.controller('SearchCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.select = {
        saler: "",
        client: "",
    };
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.hasNextPage = false;

    $scope.$on('$ionicView.beforeEnter', function () {

        $scope.isManager = (API.getRole() == 'manager');
        $scope.isAdmin = (API.getRole() == 'admin');

        if ($scope.isManager || $scope.isAdmin) {
            API.getUsers({role: 'saler'})
                .success(function (salers) {
                    $scope.salers = salers;
                })
                .error(function () {
                    $rootScope.notify("获取销售人员列表失败！请检查您的网络！");
                });
        }

        $scope.clients = [];
        API.getClientInfo()
            .success(function (lists) {
                lists.forEach(function (list) {
                    if ($scope.clients.indexOf(list.client.name) == -1 )
                        $scope.clients.push(list.client.name);
                });
            })
            .error(function () {
                $rootScope.notify("获取客户列表失败！请检查您的网络！");
            });

        $scope.loadResult();
    });

    $scope.loadResult = function () {
        var query = {};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if ($scope.isManager || $scope.isAdmin) {
            if ($scope.select.saler !== "")
                query.saler = $scope.select.saler;
        }

        if ($scope.select.client !== "")
            query['client.name'] = $scope.select.client;

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getLists(query)
            .success(function (lists) {
                $scope.hasNextPage = lists.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                $scope.noData = false;
                if (lists.length === 0)
                    $scope.noData = true;

                lists.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy-MM-dd HH:mm");
                });

                $scope.lists = lists;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {
        var query = {};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if ($scope.isManager || $scope.isAdmin) {
            if ($scope.select.saler !== "")
                query.saler = $scope.select.saler;
        }

        if ($scope.select.client !== "")
            query['client.name'] = $scope.select.client;

        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getLists(query)
            .success(function (lists) {
                $scope.hasNextPage = lists.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                lists.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy-MM-dd HH:mm");
                });

                $scope.lists = $scope.lists.concat(lists);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadResult();
    };
});