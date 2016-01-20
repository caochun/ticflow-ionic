angular.module('ticflow.controllers')

.controller('ModifyPasswordCtrl', function ($rootScope, $scope, API, $window, $filter) {
    $scope.user = {
        oldPassword: "",
        password: "",
        confirmPassword: "",
    };

    $scope.modifyPassword = function () {
        if (!$scope.user.oldPassword) {
            $rootScope.notify("请输入旧密码！");
            return false;
        }
        if (!$scope.user.password) {
            $rootScope.notify("请输入新密码！");
            return false;
        }
        if ($scope.user.confirmPassword !== $scope.user.password) {
            $rootScope.notify("确认密码不匹配！");
            return false;
        }

        var id = API.getId();
        API.signin(id, $scope.user.oldPassword)
          .success(function (user) {
              if (user === null) {
                  $rootScope.notify("密码错误！请重新输入！");
                  return false;
              }
              API.updateUser(user._id, {password: $scope.user.password})
                  .success(function (user) {
                      $rootScope.notify("修改成功！请重新登录系统！");
                      $window.location.href = ('#/signin');
                  })
                  .error(function () {
                      $rootScope.notify("修改失败！请检查您的网络！");
                  });
          })
          .error(function () {
              $rootScope.notify("密码验证失败！请检查您的网络！");
          });
    };

});