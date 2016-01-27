angular.module('ticflow.controllers')

.controller('ValueChangeCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.hasNextPage = false;

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadValueChanges();
    });

    $scope.loadValueChanges = function () {

        var query = {};

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getValueChanges(query)
            .success(function (valuechanges) {
                $scope.hasNextPage = valuechanges.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                $scope.noData = false;
                if (valuechanges.length === 0)
                    $scope.noData = true;

                valuechanges.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy-MM-dd HH:mm");
                });

                $scope.valuechanges = valuechanges;
            })
            .error(function () {
                $rootScope.notify("获取分值改动信息失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {

        var query = {};

        query.page = $scope.currentPage;
        query.limit = $scope.limit;


        API.getValueChanges(query)
            .success(function (valuechanges) {
                $scope.hasNextPage = valuechanges.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                valuechanges.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy-MM-dd HH:mm");
                });
                $scope.valuechanges = $scope.valuechanges.concat(valuechanges);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadValueChanges();
    };

});