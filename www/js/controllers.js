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

    $scope.refreshListsUncompleted = function() {
        $rootScope.$broadcast('refreshListsUncompleted');
    };
    $scope.refreshListsCompleted = function() {
        $rootScope.$broadcast('refreshListsCompleted');
    };
    $scope.refreshListsChecked = function() {
        $rootScope.$broadcast('refreshListsChecked');
    };
    $scope.refreshUsers = function() {
        $rootScope.$broadcast('refreshUsers');
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

    $scope.$on('$ionicView.beforeEnter', function () {
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
    });

    $scope.newList = function() {
        var client_name = this.list.client.name;
        var client_address = this.list.client.address;
        var client_phone_no = this.list.client.phone_no;
        var client_unit = this.list.client.unit;
        var deliver = this.list.deliver;
        var debug = this.list.debug;
        var visit = this.list.visit;
        var install = this.list.install;
        var warehouse = this.list.warehouse;
        var outgoing = this.list.outgoing;
        var serial_no = this.list.serial_no;
        var saler = this.list.saler;
        var value = this.list.value;
        var engineer = this.list.engineer;

        if (!client_name) {
            $rootScope.notify("客户姓名不能为空！");
            return false;
        }

        if (!client_address) {
            $rootScope.notify("客户地址不能为空！");
            return false;
        }

        if (!client_phone_no) {
            $rootScope.notify("客户电话不能为空！");
            return false;
        }

        if (!client_unit) {
            $rootScope.notify("客户单位不能为空！");
            return false;
        }

        if (!saler) {
            $rootScope.notify("销售不能为空！");
            return false;
        }

        if (!value) {
            $rootScope.notify("分值不能为空！");
            return false;
        }

        if (!engineer) {
            $rootScope.notify("工程师不能为空！");
            return false;
        }

        var list = {
            client: {
                name: client_name,
                address: client_address,
                phone_no: client_phone_no,
                unit: client_unit,
            },
            deviver: deliver,
            debug: debug,
            visit: visit,
            install: install,
            warehouse: warehouse,
            outgoing: outgoing,
            serial_no: serial_no,
            saler: saler,
            value: value,
            engineer: engineer,
        };
        
        API.newList(list)
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

.controller('UncompletedCtrl', function ($rootScope, $scope, API, $window) {

    $rootScope.$on('refreshListsUncompleted', function() {
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
                    entry.date = entry.date.substr(0, 10);
                });
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            });
    });

    $rootScope.$broadcast('refreshListsUncompleted');

    // $scope.submitList = function (_id) {
    //     API.submitList(_id)
    //         .success(function (list) {
    //             $rootScope.notify("提交成功!");
    //             $rootScope.$broadcast('refreshListsUncompleted');
    //         })
    //         .error(function () {
    //             $rootScope.notify("提交失败！请检查您的网络！");
    //         });
    // };
})

.controller('CompletedCtrl', function ($rootScope, $scope, API, $window) {
    $rootScope.$on('refreshListsCompleted', function() {
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
                    entry.date = entry.date.substr(0, 10);
                });
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            });
    });

    $rootScope.$broadcast('refreshListsCompleted');
})

.controller('CheckedCtrl', function ($rootScope, $scope, API, $window) {
    $rootScope.$on('refreshListsChecked', function() {
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
                    entry.date = entry.date.substr(0, 10);
                });
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            });
    });

    $rootScope.$broadcast('refreshListsChecked');
})

.controller('UncompletedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams) {

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
        date: "",
        completed: "",
    };

    $scope.isManager = (API.getRole() == 'manager');
    $scope.isEngineer = (API.getRole() == 'engineer');

    $scope.$on('$ionicView.beforeEnter', function () {
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
    });

    var _id = $stateParams._id;

    $scope.$on('$ionicView.beforeEnter', function () {
        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $scope.list.date.substr(0, 10);
                $scope.list.completed = "未完成";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            });
    });
})

.controller('CompletedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams) {

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
        date: "",
        completed: "",
        feedback: "",
        checked: "",
    };

    $scope.isSaler = (API.getRole() == 'saler');

    var _id = $stateParams._id;

    $scope.$on('$ionicView.beforeEnter', function () {
        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $scope.list.date.substr(0, 10);
                $scope.list.completed = "已完成";
                $scope.list.checked = "未审核";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            });
    });
})

.controller('CheckedDetailCtrl', function ($rootScope, $scope, API, $window, $stateParams) {

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
        date: "",
        completed: "",
        feedback: "",
        checked: "",
    };

    var _id = $stateParams._id;

    $scope.$on('$ionicView.beforeEnter', function () {
        API.getList(_id)
            .success(function (list) {
                $scope.list = list;
                $scope.list.date = $scope.list.date.substr(0, 10);
                $scope.list.completed = "已完成";
                $scope.list.checked = "已审核";
            })
            .error(function () {
                $rootScope.notify("网络连接失败！请检查您的网络！");
            });
    });
})

.controller('UsersCtrl', function ($rootScope, $scope, API, $window) {

})

.controller('NewUserCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        id: "",
        password: ""
    };
 
    $scope.createUser = function () {
        var id = this.user.id;
        var password = this.user.password;
        if(!id || !password) {
            $rootScope.notify("Please enter valid data");
            return false;
        }

        $rootScope.show('Please wait.. Registering');
        API.signup(id, password)
            .success(function (user) {
                API.login(user.id, user.role);
                $rootScope.hide();
                $window.location.href = ('#/menu/homepage');
            })
            .error(function () {
                $rootScope.hide();
                $rootScope.notify("A user with this id already exists");
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





