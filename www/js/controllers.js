angular.module('ticflow.controllers', ['ticflow.services'])

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
                    $window.location.href = ('#/menu/uncompleted');
                    $rootScope.$broadcast('refreshListsUncompleted');
                }
                else {
                    $window.location.href = ('#/menu/users');
                    $rootScope.$broadcast('refreshUsers');
                }
            }).error(function () {
                $rootScope.hide();
                $rootScope.notify("登录失败！请检查您的网络！");
            });
    };
 
})

.controller('MenuCtrl', function ($rootScope, $scope, API, $window) {
    $scope.logout = function() {
        API.logout();
        $window.location.href = ('#/auth/signin');
    };
    $scope.isManager = function () {
        return API.getRole() == 'manager';
    };
    $scope.showUncompleted = function() {
        var role = API.getRole();
        return role == 'manager' || role == 'saler' || role == 'engineer';
    };
    $scope.showCompleted = function() {
        var role = API.getRole();
        return role == 'manager' || role == 'saler' || role == 'engineer';
    };
    $scope.showChecked = function() {
        var role = API.getRole();
        return role == 'manager' || role == 'saler' || role == 'engineer';
    };
    $scope.isAdmin = function() {
        var role = API.getRole();
        return API.getRole() == 'admin';
    };
})

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
            $rootScope.notify("获取销售列表失败！请检查您的网络！");
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
})

// .controller('WorkloadsCtrl', function ($rootScope, $scope, API, $window) {
//     $rootScope.$on('refreshWorkloads', function() {
//         API.getWorkLoads()
//             .success(function (workloads) {
//                 $rootScope.show("Please wait... Processing");
//                 $scope.workloads = workloads;
//                 $rootScope.hide();
//             })
//             .error(function () {
//                 $rootScope.hide();
//                 $rootScope.notify("Oops something went wrong!! Please try again later");
//             });
//     });

//     $rootScope.$broadcast('refreshWorkloads');
// })

.controller('UncompletedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadUncompleted();
    });

    $scope.loadUncompleted = function () {
        var query = {completed: false};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsUncompleted) {
                $scope.noData = false;
                if (listsUncompleted.length === 0)
                    $scope.noData = true;
                $scope.listsUncompleted = listsUncompleted;
                $scope.listsUncompleted.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy/MM/dd HH:mm");
                });
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadUncompleted();
    };
})

.controller('CompletedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCompleted();
    });
    
    $scope.loadCompleted = function () {
        var query = {completed: true, checked: false};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsCompleted) {
                $scope.noData = false;
                if (listsCompleted.length === 0)
                    $scope.noData = true;
                $scope.listsCompleted = listsCompleted;
                $scope.listsCompleted.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy/MM/dd HH:mm");
                });
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadCompleted();
    };
})

.controller('CheckedCtrl', function ($rootScope, $scope, API, $window, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadChecked();
    });

    $scope.loadChecked = function () {
        var query = {checked: true};
        if (API.getRole() == 'saler')
            query.saler = API.getId();
        else if (API.getRole() == 'engineer')
            query.engineer = API.getId();

        //console.log(JSON.stringify(query));

        API.getLists(query)
            .success(function (listsChecked) {
                $scope.noData = false;
                if (listsChecked.length === 0)
                    $scope.noData = true;
                $scope.listsChecked = listsChecked;
                $scope.listsChecked.forEach(function (entry) {
                    entry.date = $filter('date')(entry.date, "yyyy/MM/dd HH:mm");
                });
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadChecked();
    };
})

.controller('UncompletedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadUncompletedDetail();
    });

    $scope.loadUncompletedDetail = function () {
        $scope.isManager = (API.getRole() == 'manager');
        $scope.isEngineer = (API.getRole() == 'engineer');

        API.getUsers({role: 'saler'})
            .success(function (salers) {
                $scope.salers = salers;
            })
            .error(function () {
                $rootScope.notify("获取销售列表失败！请检查您的网络！");
            });
        API.getUsers({role: 'engineer'})
            .success(function (engineers) {
                $scope.engineers = engineers;
            })
            .error(function () {
                $rootScope.notify("获取工程师列表失败！请检查您的网络！");
            });

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy/MM/dd HH:mm");
                $scope.list.completed = "未完成";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadUncompletedDetail();
    };

    $scope.modify = function () {
        $scope.list.completed = false;
        API.modifyList($scope.list._id, $scope.list)
            .success(function (list) {
                $rootScope.notify("修改成功!");
            })
            .error(function () {
                $rootScope.notify("修改失败！请检查您的网络！");
            });
    };

    $scope.submit = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="list.feedback">',
            title: '请输入提交反馈信息',
            scope: $scope,
            buttons: [
                { text: '<b>取消</b>' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.list.feedback) {
                            e.preventDefault();
                        } else {
                            API.modifyList($scope.list._id, {feedback: $scope.list.feedback, completed: true})
                                .success(function (list) {
                                    $rootScope.notify("提交成功!");
                                    $window.location.href = ('#/menu/uncompleted');
                                })
                                .error(function () {
                                    $rootScope.notify("提交失败！请检查您的网络！");
                                });
                        }
                    }
                }
            ]
        });

        
    };
})

.controller('CompletedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $ionicPopup, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCompletedDetail();
    });

    $scope.loadCompletedDetail = function () {
        $scope.isSaler = (API.getRole() == 'saler');

        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy/MM/dd HH:mm");
                $scope.list.completed = "已完成";
                $scope.list.checked = "未审核";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadCompletedDetail();
    };

    $scope.check = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定审核通过这个订单？',
            cancelText: '<b>取消</b>',
            okText: '<b>确定</b>'
        });

        confirmPopup.then(function(res) {
            if(res) {
                API.modifyList($scope.list._id, {checked: true})
                    .success(function (list) {
                        $rootScope.notify("审核成功!");
                        $window.location.href = ('#/menu/completed');
                    })
                    .error(function () {
                        $rootScope.notify("审核失败！请检查您的网络！");
                    });
            }
        });
    };
})

.controller('CheckedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams, $filter) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.loadCheckedDetail();
    });

    $scope.loadCheckedDetail = function () {
        var _id = $stateParams._id;

        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $filter('date')($scope.list.date, "yyyy/MM/dd HH:mm");
                $scope.list.completed = "已完成";
                $scope.list.checked = "已审核";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        $scope.loadCheckedDetail();
    };
})

.controller('UsersCtrl', function ($rootScope, $scope, API, $window) {

})

.controller('NewUserCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        id: "",
        password: "",
        confirmPassword: "",
        role: "",
    };
 
    $scope.newUser = function () {
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
        
        API.signup($scope.user.id, $scope.user.password, $scope.user.role)
            .success(function (user) {
                $rootScope.notify("新建成功！");
            })
            .error(function () {
                $rootScope.notify("该用户名已存在！");
            });
    };
});

// .controller('DispatchListsCtrl', function ($rootScope, $scope, API, $window) {

//     $rootScope.$on('refreshListsUndispatched', function() {
//         API.getListsUndispatched()
//             .success(function (listsUndispatched) {
//                 $rootScope.show("Please wait... Processing");
//                 $scope.listsUndispatched = listsUndispatched;
//                 $rootScope.hide();
//             })
//             .error(function () {
//                 $rootScope.notify("Oops something went wrong!! Please try again later");
//             });
//         API.getEngineers()
//             .success(function (engineers) {
//                 $rootScope.show("Please wait... Processing");
//                 // $scope.engineers = [{value: "", id: "undispatched"}];
//                 $scope.engineers = engineers;
//                 for (var i = 0; i < data.length; i++) {
//                     $scope.engineers.push({
//                         value: "",
//                         id: data[i]
//                     });
//                 }
//                 $rootScope.hide();
//             })
//             .error(function () {
//                 $rootScope.notify("Oops something went wrong!! Please try again later");
//             });
//     });

//     $rootScope.$broadcast('refreshListsUndispatched');

//     $scope.dispatchLists = function() {
//         var flag = false;
//         $scope.listsUndispatched.forEach(function (listUndispatched) {
//             if (listUndispatched.engineer != "undispatched") {
//                 flag = true;
//                 API.dispatchList(listUndispatched._id, listUndispatched.engineer)
//                     .success(function () {
//                         $rootScope.$broadcast('refreshListsUndispatched');
//                     })
//                     .error(function () {
//                         $rootScope.notify("Oops something went wrong!! Please try again later");
//                     });
//             }
//         });
//         if (!flag) {
//             $rootScope.notify("no list dispatched!!");
//         }
//     };
// })





