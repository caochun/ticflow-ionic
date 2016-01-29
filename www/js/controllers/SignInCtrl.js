angular.module('ticflow.controllers')

.controller('SignInCtrl', function ($rootScope, $scope, API, $window, $localStorage) {

    $scope.user = {
        id: "",
        password: ""
    };

    $scope.$on('$ionicView.beforeEnter', function () {

        if ($localStorage.get('authenticated')) {
            $rootScope.show("重新登录中...");
            API.signin(API.getId(), API.getPassword())
                .success(function (user) {
                    if (user === null) {
                        $rootScope.hide();
                        $rootScope.notify("用户名或密码已失效！");
                        return false;
                    }
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
                    else if (API.getRole() == 'admin') {
                        $window.location.href = ('#/menu/valuechange');
                    }
                    else {
                        $window.location.href = ('#/signin');
                        $scope.user.id = "";
                        $scope.user.password = "";
                    }
                }).error(function () {
                    $rootScope.hide();
                    $rootScope.notify("重新登录失败！请检查您的网络！");
                });
        } else {
            $scope.user.password = "";
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
                API.login(user.id, user.password, user.role);
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
                else if (API.getRole() == 'admin') {
                    $window.location.href = ('#/menu/valuechange');
                }
            }).error(function () {
                $rootScope.hide();
                $rootScope.notify("登录失败！请检查您的网络！");
            });
        $scope.user.password = "";
    };
 
});