angular.module('ticflow.services')
 .factory('API', function ($rootScope, $http, $ionicLoading, $window, $localStorage, $cordovaFileTransfer) {

        var user = $localStorage.get('user');

        //var base = "http://moon.nju.edu.cn:3000";
        var base = "http://114.212.83.15:3000"; //lzl wired network @ room 812
        //var base = "http://localhost:3000";

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
                return $http.post(base + '/users/signin', {
                    id: id,
                    password: password
                });
            },

            login: function (id, password, role) {
                $localStorage.set('user', {id: id, password: password, role: role});
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
            updateUser: function (_id, form) {
                return $http.post(base + '/users/update/' + _id, form);
            },


            newList: function (list) {
                return $http.post(base + '/lists', list);
            },
            modifyList: function (_id, form) {
                return $http.post(base + '/lists/' + _id, form);
            },
            getLists: function (query) {
                return $http.get(base + '/lists', {
                    params: query
                });
            },
            getList: function (_id) {
                return $http.get(base + '/lists/' + _id);
            },
            getTotalValue: function (query) {
                return $http.get(base + '/lists/totalvalue', {
                    params: query
                });
            },
            getClientInfo: function () {
                return $http.get(base + '/lists/clientinfo');
            },
            getMonths: function () {
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
        };
 });

