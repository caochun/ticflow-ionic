angular.module('ticflow.controllers')

.controller('CompletedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.select = {
        saler: "",
        engineer: "",
    };
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.hasNextPage = false;

    $scope.$on('$ionicView.beforeEnter', function () {

        $scope.isManager = (API.getRole() == 'manager');
        $scope.isEngineer = (API.getRole() == 'engineer');

        if ($scope.isManager) {
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

        if ($scope.isEngineer) {
            var query = {completed: true, checked: false, engineer: API.getId()};
            API.getTotalValue(query)
                .success(function (totalValue) {
                    $scope.totalValue = totalValue;
                })
                .error(function () {
                    $rootScope.notify("获取已完成报修单总分失败！请检查您的网络！");
                });
        }

        $scope.loadCompleted();
    });
    
    $scope.loadCompleted = function () {
        
        var query = {completed: true, checked: false};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();
        else if ($scope.isManager) {
            if ($scope.select.saler !== "")
                query.saler = $scope.select.saler;
            if ($scope.select.engineer !== "")
                query.engineer = $scope.select.engineer;
        }

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsCompleted) {
                $scope.hasNextPage = listsCompleted.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                $scope.noData = false;
                if (listsCompleted.length === 0)
                    $scope.noData = true;

                listsCompleted.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy/MM/dd HH:mm");
                });
                $scope.listsCompleted = listsCompleted;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {

        var query = {completed: true, checked: false};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();
        else if ($scope.isManager) {
            if ($scope.select.saler !== "")
                query.saler = $scope.select.saler;
            if ($scope.select.engineer !== "")
                query.engineer = $scope.select.engineer;
        }

        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsCompleted) {
                $scope.hasNextPage = listsCompleted.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                listsCompleted.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy/MM/dd HH:mm");
                });
                $scope.listsCompleted = $scope.listsCompleted.concat(listsCompleted);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadCompleted();
    };
});