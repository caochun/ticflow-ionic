angular.module('ticflow.controllers')

.controller('FormsCtrl', function ($rootScope, $scope, API, $window) {
	$scope.select = {
        saler: "",
        month: "",
    };
    $scope.currentPage = 0;
    $scope.limit = 5;
    $scope.hasNextPage = false;

    $scope.$on('$ionicView.beforeEnter', function () {

    	$scope.isSaler = (API.getRole() == 'saler');

    	var id = API.getId();
        $scope.isSalerAssistant = (id == "周强" || id == "陆珺" || id == "周坚" || id == "汪敏");

        if ($scope.isSalerAssistant) {
            API.getUsers({role: 'saler'})
                .success(function (salers) {
                    $scope.salers = salers;
                })
                .error(function () {
                    $rootScope.notify("获取销售人员列表失败！请检查您的网络！");
                });
        }

        API.getMonthsSalesReport()
            .success(function (months) {
                $scope.months = months.sort().reverse();
            })
            .error(function () {
                $rootScope.notify("获取月份列表失败！请检查您的网络！");
            });

        $scope.loadForms();
    });

    $scope.loadForms = function () {

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

        API.getSalesReport(query)
            .success(function (forms) {
                $scope.hasNextPage = forms.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                $scope.noData = false;
                if (forms.length === 0)
                    $scope.noData = true;

                forms.forEach(function (entry) {
                    entry.percent = (entry.complete * 100 / entry.task).toFixed(1) + "\%";
                    if (entry.comment == "")
                    	entry.comment = "无";
                });
                $scope.forms = forms;
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
        if ($scope.select.month !== "") {
            query.month = $scope.select.month;
        }

        query.page = $scope.currentPage;
        query.limit = $scope.limit;

        API.getSalesReport(query)
            .success(function (forms) {
                $scope.hasNextPage = forms.length >= $scope.limit;
                if ($scope.hasNextPage)
                    $scope.currentPage ++;

                forms.forEach(function (entry) {
                    entry.percent = (entry.complete * 100 / entry.task).toFixed(1) + "\%";
                    if (entry.comment == "")
                    	entry.comment = "无";
                });
                $scope.forms = $scope.forms.concat(forms);
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadForms();
    };
});