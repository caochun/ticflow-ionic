// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ticflow', ['ionic', 'ngCordova', 'ticflow.controllers', 'ticflow.services'])

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  $ionicConfigProvider.views.transition('ios');
  $ionicConfigProvider.tabs.style('standard').position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center').positionPrimaryButtons('left');

  $httpProvider.interceptors.push(function ($localStorage) {
    return {
      'request': function (config) {
        config.headers = config.headers || {};
        if ($localStorage.get('authenticated')) {
          var user = $localStorage.get('user');
          config.headers.token = user.token;
        }
        return config;
      },
    };
  });

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

    .state('menu.newlist', { //新建报修单
      url: '/newlist',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/newlist.html',
          controller: 'NewListCtrl'
        }
      }
    })

    .state('menu.valuechange', { //分值改动
      url: '/valuechange',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/valuechange.html',
          controller: 'ValueChangeCtrl'
        }
      }
    })

    .state('menu.unaccepted', { //未接报修单
      url: '/unaccepted',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/unaccepted.html',
          controller: 'UnacceptedCtrl',
        }
      }
    })

    .state('menu.accepted', { //已接报修单
      url: '/accepted',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/accepted.html',
          controller: 'AcceptedCtrl',
        }
      }
    })

    .state('menu.completed', { //已完成报修单
      url: '/completed',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/completed.html',
          controller: 'CompletedCtrl',
        }
      }
    })

    .state('menu.checked', { //已审核报修单
      url: '/checked',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/checked.html',
          controller: 'CheckedCtrl',
        }
      }
    })

    .state('menu.search', { //报修单搜索
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/search.html',
          controller: 'SearchCtrl',
        }
      }
    })

    .state('menu.valuechange_detail', { //分值改动详情
      url: '/valuechange/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/valuechange_detail.html',
          controller: 'ValueChangeDetailCtrl',
        }
      }
    })

    .state('menu.unaccepted_detail', { //未接报修单详情
      url: '/unaccepted/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/unaccepted_detail.html',
          controller: 'UnacceptedDetailCtrl',
        }
      }
    })

    .state('menu.accepted_detail', { //已接报修单详情
      url: '/accepted/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/accepted_detail.html',
          controller: 'AcceptedDetailCtrl',
        }
      }
    })

    .state('menu.completed_detail', { //已完成报修单详情
      url: '/completed/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/completed_detail.html',
          controller: 'CompletedDetailCtrl',
        }
      }
    })

    .state('menu.checked_detail', { //已审核报修单详情
      url: '/checked/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/checked_detail.html',
          controller: 'CheckedDetailCtrl',
        }
      }
    })

    .state('menu.search_detail', { //报修单搜索详情
      url: '/search/:_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/lists/search_detail.html',
          controller: 'SearchDetailCtrl',
        }
      }
    })

    .state('menu.visiting', { //客户拜访
      url: '/visiting',
      views: {
        'menuContent': {
          templateUrl: 'templates/sales/visiting.html',
          controller: 'VisitingCtrl',
        }
      }
    })

    .state('menu.tracing', { //项目跟踪
      url: '/tracing',
      views: {
        'menuContent': {
          templateUrl: 'templates/sales/tracing.html',
          controller: 'TracingCtrl',
        }
      }
    })

    .state('menu.bidding', { //投标管理
      url: '/bidding',
      views: {
        'menuContent': {
          templateUrl: 'templates/sales/bidding.html',
          controller: 'BiddingCtrl',
        }
      }
    })

    .state('menu.forms', { //销售报表
      url: '/forms',
      views: {
        'menuContent': {
          templateUrl: 'templates/sales/forms.html',
          controller: 'FormsCtrl',
        }
      }
    })

    .state('menu.expense', { //费用统计
      url: '/expense',
      views: {
        'menuContent': {
          templateUrl: 'templates/finance/expense.html',
          controller: 'ExpenseCtrl',
        }
      }
    })

    .state('menu.profit', { //利润统计
      url: '/profit',
      views: {
        'menuContent': {
          templateUrl: 'templates/finance/profit.html',
          controller: 'ProfitCtrl',
        }
      }
    })

    .state('menu.prestore', { //预存记录
      url: '/prestore',
      views: {
        'menuContent': {
          templateUrl: 'templates/finance/prestore.html',
          controller: 'PrestoreCtrl',
        }
      }
    })

    .state('menu.prestore_detail', { //预存记录详情
      url: '/prestore/:client/:contacter',
      views: {
        'menuContent': {
          templateUrl: 'templates/finance/prestore_detail.html',
          controller: 'PrestoreDetailCtrl',
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
    })

    .state('menu.modifypassword', { //修改密码
      url: '/modifypassword',
      views: {
        'menuContent': {
          templateUrl: 'templates/users/modifypassword.html',
          controller: 'ModifyPasswordCtrl',
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/signin');
});

angular.module('ticflow.controllers', ['ticflow.services']);

angular.module('ticflow.services', ['ticflow.utils']);

angular.module('ticflow.utils', []);
