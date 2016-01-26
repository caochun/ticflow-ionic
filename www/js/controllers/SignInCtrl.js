angular.module('ticflow.controllers')

.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {

    $scope.user = {
        id: "",
        password: ""
    };

    $scope.validateUser = function () {

        var id = this.user.id;
        var password = this.user.password;
        if(!id || !password) {
            $rootScope.notify("用户名和密码不能为空！");
            return false;
        }
        
        $rootScope.show('登录中...');
        API.signin(id, password)
            .success(function (user) {
                if (user === null) {
                    $rootScope.hide();
                    $rootScope.notify("用户名或密码错误！");
                    return false;
                }
                API.login(user.id, user.role);
                $rootScope.hide();
                if (user.role == 'manager') {
                    $window.location.href = ('#/menu/newlist');
                }
                else if (user.role == 'saler' || user.role == 'engineer') {
                    $window.location.href = ('#/menu/accepted');
                }
                else {
                    $window.location.href = ('#/menu/users');
                }
            }).error(function () {
                $rootScope.hide();
                $rootScope.notify("登录失败！请检查您的网络！");
            });
        $scope.user.password = "";
    };
 
});