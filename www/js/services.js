angular.module('ticflow.services')
 .factory('API', function ($rootScope, $http, $ionicLoading, $window, $localStorage, $cordovaFileTransfer) {

        var user = $localStorage.get('user');

        //var base = "http://121.42.175.137:3001";
        //var base = "http://114.212.81.8:3001"; //lzl wired network @ room 812
        var base = "http://localhost:3001";

        $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                template: text ? text : 'Loading',
            });
        };
 
        $rootScope.hide = function () {
            $ionicLoading.hide();
        };
 
        $rootScope.notify = function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
              $rootScope.hide();
            }, 999);
        };

        return {
            getBase: function () {
                return base;
            },

            signin: function (id, password) {
                return $http.post(base + '/auth/signin', {
                    id: id,
                    password: password
                });
            },

            login: function (id, password, role, token) {
                $localStorage.set('user', {id: id, password: password, role: role, token: token});
                $localStorage.set('authenticated', true);
                user = $localStorage.get('user');
            },
            logout: function() {
                $localStorage.remove('user');
                $localStorage.set('authenticated', false);
            },
            getId: function() {
                return user.id;
            },
            getPassword: function () {
                return user.password;
            },
            getRole: function() {
                return user.role;
            },


            getUsers: function (query) {
                return $http.get(base + '/users', {
                    params: query
                });
            },
            createUser: function (id, password, role) {
                return $http.post(base + '/users/create', {
                    id: id,
                    password: password,
                    role: role
                });
            },
            removeUser: function (_id) {
                return $http.post(base + '/users/remove/' + _id);
            },
            updateUser: function (_id, user) {
                return $http.post(base + '/users/update/' + _id, user);
            },


            newList: function (list) {
                return $http.post(base + '/lists', list);
            },
            modifyList: function (_id, list) {
                return $http.post(base + '/lists/' + _id, list);
            },
            getLists: function (query) {
                return $http.get(base + '/lists', {
                    params: query
                });
            },
            getList: function (_id) {
                return $http.get(base + '/lists/' + _id);
            },
            removeList: function (_id) {
                return $http.post(base + '/lists/remove/' + _id);
            },
            getTotalValue: function (query) {
                return $http.get(base + '/lists/totalvalue', {
                    params: query
                });
            },
            getMonths: function () { //months in checked lists
                return $http.get(base + '/lists/months');
            },


            newValueChange: function (oldValue, newValue, manager, list_id) {
                return $http.post(base + '/valuechanges/', {
                    oldValue: oldValue,
                    newValue: newValue,
                    manager: manager,
                    list_id: list_id,
                });
            },
            getValueChanges: function (query) {
                return $http.get(base + '/valuechanges', {
                    params: query
                });
            },
            getValueChange: function (_id) {
                return $http.get(base + '/valuechanges/' + _id);
            },
            removeValueChange: function (_id) {
                return $http.post(base + '/valuechanges/remove/' + _id);
            },

            upload: function (uri) {
                var url = base + '/upload';
                var targetpath = uri;
                var options = {
                    fileKey: "photo",
                    chunkedMode: false,
                    mimeType: "image/jpg",
                };
                return $cordovaFileTransfer.upload(url, targetpath, options);
            },

            getMonthsFinance: function () { //months in profits
                return $http.get(base + '/app_profits/months');
            },
            getTotalExpense: function (query) {
                return $http.get(base + '/app_profits/totalexpense', {
                    params: query
                });
            },
            getExpense: function (query) {
                return $http.get(base + '/app_profits/expense', {
                    params: query
                });
            },
            getTotalProfit: function (query) {
                return $http.get(base + '/app_profits/totalprofit', {
                    params: query
                });
            },
            getProfit: function (query) {
                return $http.get(base + '/app_profits/profit', {
                    params: query
                });
            },

            getPrestoreTotal: function (query) {
                return $http.get(base + '/app_prestore/total', {
                    params: query
                });
            },
            getPrestoreDetail: function (query) {
                return $http.get(base + '/app_prestore/detail', {
                    params: query
                });
            },

            getMonthsSalesReport: function (query) { //months in sales report
                return $http.get(base + '/app_salesreport/months');
            },
            getSalesReport: function (query) {
                return $http.get(base + '/app_salesreport', {
                    params: query
                });
            },

            getMonthsBidManagement: function (query) { //months in bid management
                return $http.get(base + '/app_bidmanagement/months');
            },
            getBidManagement: function (query) {
                return $http.get(base + '/app_bidmanagement', {
                    params: query
                });
            },
            getBidManagementDetail: function (_id) {
                return $http.get(base + '/app_bidmanagement/' + _id);
            },

            getVisiting: function (query) {
                return $http.get(base + '/visiting', {
                    params: query
                });
            },
            newVisiting: function (visiting) {
                return $http.post(base + '/visiting', visiting);
            },
            getVisitingDetail: function (_id) {
                return $http.get(base + '/visiting/' + _id);
            },
            updateVisiting: function (_id, visiting) {
                return $http.post(base + '/visiting/' + _id, visiting);
            },
            removeVisiting: function (_id) {
                return $http.post(base + '/visiting/remove/' + _id);
            },
        };
 });

