angular.module('ticflow.controllers')

.controller('UsersCtrl', function ($rootScope, $scope, API, $window, $ionicPopup) {

    $scope.role = {
        selected: ""
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadUsers();
    });

    $scope.loadUsers = function () {
        var query = {};
        if ($scope.role.selected !== "") {
            query.role = $scope.role.selected;
        }
        API.getUsers(query)
            .success(function (users) {
                $scope.users = users;
                $scope.users.forEach(function (entry) {
                    switch (entry.role) {
                        case "manager":
                            entry.role = "派单员";
                            entry.del = false;
                            break;
                        case "saler":
                            entry.role = "销售人员";
                            entry.del = true;
                            break;
                        case "engineer":
                            entry.role = "工程师";
                            entry.del = true;
                            break;
                        case "admin":
                            entry.role = "管理员";
                            entry.del = false;
                            break;
                        case "treasurer":
                            entry.role = "财务";
                            entry.del = false;
                            break;
                        default:
                            entry.role = "未知";
                    }
                });
            })
            .error(function () {
                $rootScope.notify("获取用户列表失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadUsers();
    };

    $scope.removeUser = function (user) {
        if (user.id == API.getId()) {
            $rootScope.notify("不能删除自己！");
            return false;
        }
        
        var confirmPopup = $ionicPopup.confirm({
            title: '确定删除该用户？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.removeUser(user._id)
                    .success(function (user) {
                        $rootScope.notify("删除成功！");
                        $scope.loadUsers();
                    })
                    .error(function () {
                        $rootScope.notify("删除失败！请检查您的网络！");
                    });
            }
        });
    };
});