angular.module('ticflow.controllers')

.controller('NewUserCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        id: "",
        password: "",
        confirmPassword: "",
        role: "",
    };
 
    $scope.createUser = function () {
        if(!$scope.user.role) {
            $rootScope.notify("请选择角色！");
            return false;
        }

        if(!$scope.user.id) {
            $rootScope.notify("请输入用户名！");
            return false;
        }

        if(!$scope.user.password) {
            $rootScope.notify("请输入密码！");
            return false;
        }

        if($scope.user.confirmPassword !== $scope.user.password) {
            $rootScope.notify("确认密码不匹配！");
            return false;
        }
        
        API.createUser($scope.user.id, $scope.user.password, $scope.user.role)
            .success(function (user) {
                $rootScope.notify("新建成功！");
                $window.location.href = ('#/menu/users');
            })
            .error(function () {
                $rootScope.notify("该用户名已存在！");
            });
    };
});