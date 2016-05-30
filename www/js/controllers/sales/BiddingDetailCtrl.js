angular.module('ticflow.controllers')

.controller('BiddingDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadBiddingDetail();
    });

    $scope.loadBiddingDetail = function () {

        var _id = $stateParams._id;

        API.getBidManagementDetail(_id)
            .success(function (bidding) {
                $scope.bidding = bidding;
                if ($scope.bidding.win)
                    $scope.bidding.win_string = "是";
                else 
                    $scope.bidding.win_string = "否";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadBiddingDetail();
    };
});