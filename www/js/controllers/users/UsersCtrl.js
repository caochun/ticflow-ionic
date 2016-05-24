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
                            entry.isManager = true;
                            break;
                        case "saler":
                            entry.role = "销售人员";
                            entry.isSaler = true;
                            break;
                        case "engineer":
                            entry.role = "工程师";
                            entry.isEngineer = true;
                            break;
                        case "admin":
                            entry.role = "管理员";
                            entry.isAdmin = true;
                            break;
                        case "treasurer":
                            entry.role = "财务";
                            entry.isTreasurer = true;
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

    $scope.resetPassword = function (user) {
        var confirmPasswordPopup = $ionicPopup.prompt({
            title: '请输入您的密码',
            inputType: 'password',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        }).then(function (res) {
            if (res === undefined) {

            } else if (res === "") {
                $rootScope.notify("密码不能为空！");
            } else if (res !== API.getPassword()) {
                $rootScope.notify("密码不正确！");
            } else {
                var newPasswordPopup = $ionicPopup.prompt({
                    title: '请输入新密码',
                    inputType: 'password',
                    cancelText: '<b>取消</b>',
                    okText: '<b>确定</b>'
                }).then(function (res) {
                    if (res === undefined) {

                    } else if (res === "") {
                        $rootScope.notify("新密码不能为空！");
                    } else {
                        API.updateUser(user._id, {password: res})
                            .success(function (user) {
                                $rootScope.notify("重置密码成功！");
                                $scope.loadUsers();
                            })
                            .error(function () {
                                $rootScope.notify("重置密码失败！请检查您的网络！");
                            });
                    }
                });
            }
        });
    };

    $scope.freeze = function (user) {
        var confirmPasswordPopup = $ionicPopup.prompt({
            title: '请输入您的密码',
            inputType: 'password',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        }).then(function (res) {
            if (res === undefined) {

            } else if (res === "") {
                $rootScope.notify("密码不能为空！");
            } else if (res !== API.getPassword()) {
                $rootScope.notify("密码不正确！");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: '确定冻结该用户？',
                    cancelText: '<b>取消</b>',
                    okText: '<b>确定</b>'
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        API.updateUser(user._id, {frozen: true})
                            .success(function (user) {
                                $rootScope.notify("冻结用户成功！");
                                $scope.loadUsers();
                            })
                            .error(function () {
                                $rootScope.notify("冻结用户失败！请检查您的网络！");
                            });
                    }
                });
            }
        });
    };

    $scope.unfreeze = function (user) {
        var confirmPasswordPopup = $ionicPopup.prompt({
            title: '请输入您的密码',
            inputType: 'password',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        }).then(function (res) {
            if (res === undefined) {

            } else if (res === "") {
                $rootScope.notify("密码不能为空！");
            } else if (res !== API.getPassword()) {
                $rootScope.notify("密码不正确！");
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: '确定解冻该用户？',
                    cancelText: '<b>取消</b>',
                    okText: '<b>确定</b>'
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        API.updateUser(user._id, {frozen: false})
                            .success(function (user) {
                                $rootScope.notify("解冻用户成功！");
                                $scope.loadUsers();
                            })
                            .error(function () {
                                $rootScope.notify("解冻用户失败！请检查您的网络！");
                            });
                    }
                });
            }
        });
    };

    $scope.removeUser = function (user) {
        var confirmPasswordPopup = $ionicPopup.prompt({
            title: '请输入您的密码',
            inputType: 'password',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        }).then(function (res) {
            if (res === undefined) {

            } else if (res === "") {
                $rootScope.notify("密码不能为空！");
            } else if (res !== API.getPassword()) {
                $rootScope.notify("密码不正确！");
            } else {
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
            }
        });
    };
});