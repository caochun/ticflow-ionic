angular.module('ticflow.services', ['ticflow.utils'])
 .factory('API', function ($rootScope, $http, $ionicLoading, $window, $localStorage) {

       var userKey = 'user';
       var authenticatedKey = 'authenticated';
       var user = $localStorage.get(userKey);

       //var base = "http://moon.nju.edu.cn:3000";
       //var base = "http://114.212.86.184:3000"; //lzl wired network @ room 812
       var base = "http://localhost:3000";

       $rootScope.show = function (text) {
            $rootScope.loading = $ionicLoading.show({
                template: text ? text : 'Loading',
            });
        };
 
        $rootScope.hide = function () {
            $ionicLoading.hide();
        };
 
        $rootScope.notify =function(text){
            $rootScope.show(text);
            $window.setTimeout(function () {
              $rootScope.hide();
            }, 999);
        };
 
        /*$rootScope.doRefresh = function (tab) {
            if(tab == 1)
                $rootScope.$broadcast('fetchAll');
            else
                $rootScope.$broadcast('fetchCompleted');
            
            $rootScope.$broadcast('scroll.refreshComplete');
        };*/
 
        /*$rootScope.setToken = function (token) {
            return $window.localStorage.token = token;
        }
 
        $rootScope.getToken = function () {
            return $window.localStorage.token;
        }
 
        $rootScope.isSessionActive = function () {
            return $window.localStorage.token ? true : false;
        }*/

       return {
            signin: function (id, password) {
                return $http.post(base+'/users/signin', {
                    id: id,
                    password: password
                });
            },
            signup: function (id, password) {
                return $http.post(base+'/users/signup', {
                    id: id,
                    password: password
                });
            },
            login: function(id, role) {
                $localStorage.set(userKey,{id: id, role: role});
                $localStorage.set(authenticatedKey, true);
                user = $localStorage.get(userKey);
            },
            logout: function() {
                $localStorage.remove(userKey);
                $localStorage.set(authenticatedKey, false);
            },
            getRole: function() {
                return user.role + "";
            },
            newList: function(list) {
                return $http.post(base+'/lists', {
                    list: list
                });
            },
            getWorkLoads: function() {
                return $http.get(base + '/users/engineers/workloads');
            },
            getLists: function() {
                return $http.get(base+'/lists');
            },
            getListsUndispatched: function() {
                return $http.get(base+'/lists/undispatched');
            },
            getEngineers: function() {
                return $http.get(base+'/users/engineers');
            },
            getListsUncompleted: function() {
                return $http.get(base+'/lists/uncompleted', {
                    params: {
                        id: user.id
                    }
                });
            },
            dispatchList: function(_id, dispatchedEngineer) {
                return $http.post(base+'/lists/'+_id, {engineer: dispatchedEngineer});
            },
            submitList: function(_id) {
                return $http.post(base+'/lists/'+_id, {completed: true});
            }
        };
 });

