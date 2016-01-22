angular.module('ticflow.controllers')

.controller('NewListCtrl', function ($rootScope, $scope, API, $window) {

    $scope.list = {
        client: {
            name: "",
            address: "",
            phone_no: "",
            unit: "",
        },
        deliver: "",
        debug: "",
        visit: "",
        install: "",
        warehouse: "",
        outgoing: "",
        serial_no: "",
        saler: "",
        value: "",
        engineer: "",
    };

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

    $scope.newList = function() {
        if (!$scope.list.client.name) {
            $rootScope.notify("客户姓名不能为空！");
            return false;
        }

        if (!$scope.list.client.address) {
            $rootScope.notify("客户地址不能为空！");
            return false;
        }

        if (!$scope.list.client.phone_no) {
            $rootScope.notify("客户电话不能为空！");
            return false;
        }

        if (!$scope.list.client.unit) {
            $rootScope.notify("客户单位不能为空！");
            return false;
        }

        if (!$scope.list.saler) {
            $rootScope.notify("销售不能为空！");
            return false;
        }

        if (!$scope.list.value) {
            $rootScope.notify("分值不能为空！");
            return false;
        }

        if (isNaN($scope.list.value)) {
            $rootScope.notify("分值必须为纯数字！");
            return false;
        }

        if (!$scope.list.engineer) {
            $rootScope.notify("工程师不能为空！");
            return false;
        }
        
        API.newList($scope.list)
            .success(function (list) {
                $rootScope.notify("创建成功!");
            })
            .error(function () {
                $rootScope.notify("创建失败！请检查您的网络！");
            });
    };
});