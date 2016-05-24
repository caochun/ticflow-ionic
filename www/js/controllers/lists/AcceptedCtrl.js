angular.module('ticflow.controllers')

.controller('AcceptedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.select = {
        saler: "",
        engineer: "",
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

            API.getUsers({role: 'engineer'})
                .success(function (engineers) {
                    $scope.engineers = engineers;
                })
                .error(function () {
                    $rootScope.notify("获取工程师列表失败！请检查您的网络！");
                });
        }

        $scope.loadAccepted();
    });

    $scope.loadAccepted = function () {
        var query = {accepted: true, completed: false};
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

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getLists(query)
            .success(function (listsAccepted) {
                $scope.hasNextPage = listsAccepted.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                $scope.noData = false;
                if (listsAccepted.length === 0)
                    $scope.noData = true;

                listsAccepted.forEach(function (entry) {
                    entry.acceptTime = $filter('date')(entry.acceptTime, "yyyy-MM-dd HH:mm");
                });

                $scope.listsAccepted = listsAccepted;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {
        var query = {accepted: true, completed: false};
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

        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getLists(query)
            .success(function (listsAccepted) {
                $scope.hasNextPage = listsAccepted.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                listsAccepted.forEach(function (entry) {
                    entry.acceptTime = $filter('date')(entry.acceptTime, "yyyy-MM-dd HH:mm");
                });

                $scope.listsAccepted = $scope.listsAccepted.concat(listsAccepted);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadAccepted();
    };
});