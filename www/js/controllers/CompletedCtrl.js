angular.module('ticflow.controllers')

.controller('CompletedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.select = {
        saler: "",
        engineer: "",
    };

    $scope.$on('$ionicView.beforeEnter', function () {

        $scope.isManager = (API.getRole() == 'manager');

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

        $scope.loadCompleted();
    });
    
    $scope.loadCompleted = function () {
        $scope.isEngineer = (API.getRole() == 'engineer');

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

        $scope.totalValue = 0;

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsCompleted) {
                $scope.noData = false;
                if (listsCompleted.length === 0)
                    $scope.noData = true;
                $scope.listsCompleted = listsCompleted;
                $scope.listsCompleted.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy/MM/dd HH:mm");
                    $scope.totalValue += entry.value;
                });
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadCompleted();
    };
});