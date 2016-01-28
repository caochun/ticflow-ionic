angular.module('ticflow.controllers')

.controller('SignInCtrl', function ($rootScope, $scope, API, $window, $localStorage) {

    $scope.user = {
        id: "",
        password: ""
    };

    $scope.$on('$ionicView.beforeEnter', function () {

        if ($localStorage.get('authenticated')) {
            $rootScope.show("重新登录中...");
            if (API.getRole() == 'manager') {
                $window.location.href = ('#/menu/newlist');
                $rootScope.hide();
            }
            else if (API.getRole() == 'engineer') {
                $window.location.href = ('#/menu/unaccepted');
                $rootScope.hide();
            }
            else if (API.getRole() == 'saler') {
                $window.location.href = ('#/menu/accepted');
                $rootScope.hide();
            }
            else {
                $window.location.href = ('#/menu/valuechange');
                $rootScope.hide();
            }
        } else {
            $scope.user.id = $localStorage.get('username');
        }
    });

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
                else if (user.role == 'engineer') {
                    $window.location.href = ('#/menu/unaccepted');
                }
                else if (user.role == 'saler') {
                    $window.location.href = ('#/menu/accepted');
                }
                else {
                    $window.location.href = ('#/menu/valuechange');
                }
            }).error(function () {
                $rootScope.hide();
                $rootScope.notify("登录失败！请检查您的网络！");
            });
        $scope.user.password = "";
    };
 
});