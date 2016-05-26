angular.module('ticflow.controllers')

.controller('PrestoreDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams) {

    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.hasNextPage = false;

	$scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadPrestoreDetail();
    });

    $scope.loadPrestoreDetail = function () {

        var client = $stateParams.client;
        var contacter = $stateParams.contacter;

        $scope.client = client;
        $scope.contacter = contacter;

        var query = {saler: API.getId(), client: client, contacter: contacter};

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getPrestoreDetail(query)
            .success(function (prestore) {
                $scope.hasNextPage = prestore.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                prestore.forEach(function (entry) {
                    if (entry.detail == "income")
                        entry.detail = "预存";
                    else
                        entry.detail = "冲抵";
                    if (entry.comment == "")
                        entry.comment = "无";
                });

                $scope.prestore = prestore;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {

        var client = $stateParams.client;
        var contacter = $stateParams.contacter;

        var query = {saler: API.getId(), client: client, contacter: contacter};

        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getPrestoreDetail(query)
            .success(function (prestore) {
                $scope.hasNextPage = prestore.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                prestore.forEach(function (entry) {
                    if (entry.detail == "income")
                        entry.detail = "预存";
                    else
                        entry.detail = "冲抵";
                    if (entry.comment == "")
                        entry.comment = "无";
                });

                $scope.prestore = $scope.prestore.concat(prestore);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadPrestoreDetail();
    };
});