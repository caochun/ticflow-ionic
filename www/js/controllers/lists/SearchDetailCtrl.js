angular.module('ticflow.controllers')

.controller('SearchDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter, $ionicModal) {

    $scope.list_local = {
        state: "",
        completed: false,
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadSearchDetail();
    });

    $scope.loadSearchDetail = function (list_id) {
        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy-MM-dd HH:mm");
                if ($scope.list.accepted === false)
                    $scope.list_local.state = "未接";
                else if ($scope.list.completed === false)
                    $scope.list_local.state = "已接";
                else if ($scope.list.checked === false) {
                    $scope.list_local.state = "已完成";
                    $scope.list_local.completed = true;
                }
                else {
                    $scope.list_local.state = "已审核";
                    $scope.list_local.completed = true;
                }
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadValueChangeDetail();
    };

    $ionicModal.fromTemplateUrl('templates/imageModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.imageModal = modal;
    });

    $scope.showImage1 = function () {
        $scope.imageUri = API.getBase() + '/uploads/' + $scope.list.attached1;
        $scope.imageModal.show();
    };

    $scope.showImage2 = function () {
        $scope.imageUri = API.getBase() + '/uploads/' + $scope.list.attached2;
        $scope.imageModal.show();
    };

    $scope.showImage3 = function () {
        $scope.imageUri = API.getBase() + '/uploads/' + $scope.list.attached3;
        $scope.imageModal.show();
    };

    $scope.hideImage = function () {
        $scope.imageModal.hide();
    };
});