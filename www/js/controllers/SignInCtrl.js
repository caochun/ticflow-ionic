angular.module('ticflow.controllers')

.controller('SignInCtrl', function ($rootScope, $scope, API, $window, $localStorage) {

    $scope.user = {
        id: API.getId(),
        password: ""
    };

    $scope.$on('$ionicView.beforeEnter', function () {

        if ($localStorage.get('authenticated')) {
            API.signin(API.getId(), API.getPassword())
                .success(function (user) {
                    if (user === null) {
                        $rootScope.notify("用户名或密码已失效！");
                        return false;
                    } else if (user.frozen) {
                        $rootScope.notify("用户已被冻结！");
                        return false;
                    }
                    API.login(user.id, user.password, user.role, user.token);
                    if (user.role == 'manager') {
                        $window.location.href = ('#/menu/newlist');
                    }
                    else if (user.role == 'engineer') {
                        $window.location.href = ('#/menu/unaccepted');
                    }
                    else if (user.role == 'saler') {
                        $window.location.href = ('#/menu/accepted');
                    }
                    else if (user.role == 'admin') {
                        $window.location.href = ('#/menu/valuechange');
                    }
                }).error(function () {
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
        
        API.signin(id, password)
            .success(function (user) {
                if (user === null) {
                    $rootScope.notify("用户名或密码错误！");
                    return false;
                } else if (user.frozen) {
                    $rootScope.notify("用户已被冻结！");
                    return false;
                }
                API.login(user.id, user.password, user.role, user.token);
                if (user.role == 'manager') {
                    $window.location.href = ('#/menu/newlist');
                }
                else if (user.role == 'engineer') {
                    $window.location.href = ('#/menu/unaccepted');
                }
                else if (user.role == 'saler') {
                    $window.location.href = ('#/menu/accepted');
                }
                else if (user.role == 'admin') {
                    $window.location.href = ('#/menu/valuechange');
                }
                else if (user.role == 'treasurer') {
                    $window.location.href = ('#/menu/modifypassword');
                }
            }).error(function () {
                $rootScope.notify("登录失败！请检查您的网络！");
            });
        $scope.user.password = "";
    };
 
});