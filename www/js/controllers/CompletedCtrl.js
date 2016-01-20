angular.module('ticflow.controllers')

.controller('CompletedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCompleted();
    });
    
    $scope.loadCompleted = function () {
        var query = {completed: true, checked: false};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsCompleted) {
                $scope.noData = false;
                if (listsCompleted.length === 0)
                    $scope.noData = true;
                $scope.listsCompleted = listsCompleted;
                $scope.listsCompleted.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy/MM/dd HH:mm");
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