angular.module('ticflow.controllers')

.controller('CheckedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadChecked();
    });

    $scope.loadChecked = function () {
        var query = {checked: true};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsChecked) {
                $scope.noData = false;
                if (listsChecked.length === 0)
                    $scope.noData = true;
                $scope.listsChecked = listsChecked;
                $scope.listsChecked.forEach(function (entry) {
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
        $scope.loadChecked();
    };
});