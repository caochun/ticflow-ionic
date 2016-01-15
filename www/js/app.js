// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ticflow', ['ionic', 'ticflow.controllers', 'ticflow.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.views.transition('ios');
  $ionicConfigProvider.tabs.style('standard').position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center').positionPrimaryButtons('left');

  $stateProvider

    .state('signin',{
      url: "/signin",
      templateUrl: "templates/signin.html",
      controller: 'SignInCtrl'
    })

    .state('menu', {
      url: '/menu',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'MenuCtrl'
    })

    .state('menu.newlist', { //新建工单
      url: '/newlist',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/newlist.html',
          controller: 'NewListCtrl'
        }
      }
    })

    .state('menu.uncompleted', { //未完成工单
      url: '/uncompleted',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/uncompleted.html',
          controller: 'ListsUncompletedCtrl',
        }
      }
    })

    .state('menu.completed', { //已完成工单
      url: '/completed',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/completed.html',
          controller: 'ListsCompletedCtrl',
        }
      }
    })

    .state('menu.checked', { //已审核工单
      url: '/checked',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/checked.html',
          controller: 'ListsCheckedCtrl',
        }
      }
    })

    .state('menu.list', { //报修单详情
      url: '/list/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/detail.html',
          controller: 'ListDetailCtrl',
        }
      }
    })

    .state('menu.users', { //用户管理
      url: '/users',
      views: {
        'menuContent': {
          templateUrl: 'templates/users/users.html',
          controller: 'UsersCtrl',
        }
      }
    })

    .state('menu.newuser', { //新建用户
      url: '/newuser',
      views: {
        'menuContent': {
          templateUrl: 'templates/users/newuser.html',
          controller: 'NewUserCtrl',
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/signin');
});
