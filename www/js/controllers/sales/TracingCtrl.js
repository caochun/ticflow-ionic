angular.module('ticflow.controllers')

.controller('TracingCtrl', function ($rootScope, $scope, API, $window, $filter) {
	$scope.select = {
        saler: "",
    };
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.hasNextPage = false;

    $scope.$on('$ionicView.beforeEnter', function () {

    	$scope.isSaler = (API.getRole() == 'saler');

    	var id = API.getId();
        $scope.isSalerAssistant = (id == "周强" || id == "陆珺" || id == "周坚" || id == "汪敏" || API.getRole() == 'salerassistant');

        if ($scope.isSalerAssistant) {
            API.getUsers({role: 'saler'})
                .success(function (salers) {
                    $scope.salers = salers;
                })
                .error(function () {
                    $rootScope.notify("获取销售人员列表失败！请检查您的网络！");
                });
        }

        API.getMonthsTracing()
            .success(function (months) {
                $scope.months = months.sort().reverse();
            })
            .error(function () {
                $rootScope.notify("获取月份列表失败！请检查您的网络！");
            });

        $scope.loadTracing();
    });

    $scope.loadTracing = function () {

        var query = {};
        if ($scope.isSalerAssistant) {
            if ($scope.select.saler !== "") {
                query.saler = $scope.select.saler;
            }
        } else if ($scope.isSaler) {
            query.saler = API.getId();
        }
        if ($scope.select.month !== "") {
            query.month = $scope.select.month;
        }

        $scope.currentPage = 0;
        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getTracing(query)
            .success(function (tracing) {
                $scope.hasNextPage = tracing.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                $scope.noData = false;
                if (tracing.length === 0)
                    $scope.noData = true;

                tracing.forEach(function (entry) {
                	entry.date = $filter('date')(entry.date, "yyyy-MM-dd HH:mm");
                });
                $scope.tracing = tracing;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadMore = function () {

        var query = {};
        if ($scope.isSalerAssistant) {
            if ($scope.select.saler !== "") {
                query.saler = $scope.select.saler;
            }
        } else if ($scope.isSaler) {
        	query.saler = API.getId();
        }

        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getTracing(query)
            .success(function (tracing) {
                $scope.hasNextPage = tracing.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                tracing.forEach(function (entry) {
                	entry.date = $filter('date')(entry.date, "yyyy-MM-dd HH:mm");
                });
                $scope.tracing = $scope.tracing.concat(tracing);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadTracing();
    };
});