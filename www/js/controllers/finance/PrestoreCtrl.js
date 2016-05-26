angular.module('ticflow.controllers')

.controller('PrestoreCtrl', function ($rootScope, $scope, API, $window) {

	$scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadPrestore();
    });

    $scope.loadPrestore = function () {

        var query = {saler: API.getId()};

        API.getPrestoreTotal(query)
            .success(function (prestore_total) {
            	$scope.noData = false;
            	if (prestore_total.length === 0)
                    $scope.noData = true;   
                $scope.prestore_total = prestore_total;
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadPrestore();
    };
});