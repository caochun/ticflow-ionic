angular.module('repairsystem.controllers', ['repairsystem.services'])

.controller('SignInCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        id: "",
        password: ""
    };
 
    $scope.validateUser = function () {
        var id = this.user.id;
        var password = this.user.password;
        if(!id || !password) {
            $rootScope.notify("Please enter valid data");
            return false;
        }
        
        $rootScope.show('Please wait.. Authenticating');
        API.signin(id, password)
            .success(function (user) {
                API.login(user.id, user.role);
                $rootScope.hide();
                $window.location.href = ('#/menu/homepage');
            }).error(function () {
                $rootScope.hide();
                $rootScope.notify("Invalid username or password");
            });
    };
 
})

.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
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
})

.controller('MenuCtrl', function ($rootScope, $scope, API, $window) {
    $scope.logout = function() {
        API.logout();
        $window.location.href = ('#/auth/signin');
    };
    $scope.showMenuNew = function() {
        return API.getRole() == "saler" || API.getRole() == "admin";
    };
    $scope.showMenuDispatch = function() {
        return API.getRole() == "manager";
    };
    $scope.showMenuWorkloads = function() {
        return API.getRole() == "admin";
    };
    $scope.showMenuLists = function() {
        return API.getRole() == "admin";
    };
    $scope.showMenuManage = function() {
        return API.getRole() == "engineer";
    };
    $scope.refreshLists = function() {
        $rootScope.$broadcast('refreshLists');
    };
    $scope.refreshWorkloads = function() {
        $rootScope.$broadcast('refreshWorkloads');
    };
    $scope.refreshListsUndispatched = function() {
        $rootScope.$broadcast('refreshListsUndispatched');
    };
    $scope.refreshListsUncompleted = function() {
        $rootScope.$broadcast('refreshListsUncompleted');
    };
})

.controller('NewListCtrl', function ($rootScope, $scope, API, $window) {

    $scope.list = {
        clientName: "",
        clientAddress: "",
        clientPhoneNumber: "",
        clientUnit: "",
        machineType: "",
        fixType: "",
        servicesType: "",
        reporter: ""
    };

    $scope.newList = function() {
        var clientName = this.list.clientName;
        var clientAddress = this.list.clientAddress;
        var clientPhoneNumber = this.list.clientPhoneNumber;
        var clientUnit = this.list.clientUnit;
        var machineType = this.list.machineType;
        var fixType = this.list.fixType;
        var serviceType = this.list.serviceType;
        var reporter = this.list.reporter;

        if (!clientName || !clientAddress || !clientPhoneNumber || !clientUnit ||
            !machineType || !fixType || !serviceType || !reporter) {
            $rootScope.notify("Please enter valid data");
            return false;
        }

        var list = {
            clientName: clientName,
            clientAddress: clientAddress,
            clientPhoneNumber: clientPhoneNumber,
            clientUnit: clientUnit,
            machineType: machineType,
            fixType: fixType,
            serviceType: serviceType,
            reporter: reporter,
        };
        
        API.newList(list)
            .success(function (list) {
                $rootScope.notify("创建成功!");
            })
            .error(function () {
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
})

.controller('WorkloadsCtrl', function ($rootScope, $scope, API, $window) {
    $rootScope.$on('refreshWorkloads', function() {
        API.getWorkLoads()
            .success(function (workloads) {
                $rootScope.show("Please wait... Processing");
                $scope.workloads = workloads;
                $rootScope.hide();
            })
            .error(function () {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    });

    $rootScope.$broadcast('refreshWorkloads');
})

.controller('ListsCtrl', function ($rootScope, $scope, API, $window) {
    $rootScope.$on('refreshLists', function() {
        API.getLists()
            .success(function (lists) {
                $rootScope.show("Please wait... Processing");
                $scope.lists_uncompleted = [];
                $scope.lists_completed = [];
                $scope.lists_undispatched = [];
                for (var i = 0; i < lists.length; i++) {
                    if (lists[i].engineer == "undispatched")
                        $scope.lists_undispatched.push(lists[i]);
                    else if (lists[i].completed === false)
                        $scope.lists_uncompleted.push(lists[i]);
                    else
                        $scope.lists_completed.push(lists[i]);
                }
                $rootScope.hide();
            })
            .error(function () {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    });

    $rootScope.$broadcast('refreshLists');
})

.controller('DispatchListsCtrl', function ($rootScope, $scope, API, $window) {

    $rootScope.$on('refreshListsUndispatched', function() {
        API.getListsUndispatched()
            .success(function (listsUndispatched) {
                $rootScope.show("Please wait... Processing");
                $scope.listsUndispatched = listsUndispatched;
                $rootScope.hide();
            })
            .error(function () {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
        API.getEngineers()
            .success(function (engineers) {
                $rootScope.show("Please wait... Processing");
                // $scope.engineers = [{value: "", id: "undispatched"}];
                $scope.engineers = engineers;
                /*for (var i = 0; i < data.length; i++) {
                    $scope.engineers.push({
                        value: "",
                        id: data[i]
                    });
                }*/
                $rootScope.hide();
            })
            .error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    });

    $rootScope.$broadcast('refreshListsUndispatched');

    $scope.dispatchLists = function() {
        var flag = false;
        $scope.listsUndispatched.forEach(function (listUndispatched) {
            if (listUndispatched.engineer != "undispatched") {
                flag = true;
                API.dispatchList(listUndispatched._id, listUndispatched.engineer)
                    .success(function () {
                        $rootScope.$broadcast('refreshListsUndispatched');
                    })
                    .error(function () {
                        $rootScope.notify("Oops something went wrong!! Please try again later");
                    });
            }
        });
        if (!flag) {
            $rootScope.notify("no list dispatched!!");
        }
    };
})

.controller('ManageListsCtrl', function ($rootScope, $scope, API, $window) {
    $rootScope.$on('refreshListsUncompleted', function() {
        API.getListsUncompleted()
            .success(function (listsUncompleted) {
                $rootScope.show("Please wait... Processing");
                $scope.lists_uncompleted = listsUncompleted;
                $rootScope.hide();
            })
            .error(function () {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    });

    $rootScope.$broadcast('refreshListsUncompleted');

    $scope.submitList = function(_id) {
        API.submitList(_id)
            .success(function (list) {
                $rootScope.show("Please wait... Processing");
                $rootScope.$broadcast('refreshListsUncompleted');
                $rootScope.hide();
            })
            .error(function () {
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
});



