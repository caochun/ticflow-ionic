// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('repairsystem', ['ionic', 'repairsystem.controllers', 'repairsystem.services'])

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

    .state('auth',{
      url: "/auth",
      abstract: true,
      templateUrl: "templates/auth.html",
    })

    .state('auth.signin',{
      url: "/signin",
      views: {
        'auth-signin': {
          templateUrl: "templates/auth-signin.html",
          controller: 'SignInCtrl'
        }
      }
    })

    .state('auth.signup',{
      url: "/signup",
      views: {
        'auth-signup': {
          templateUrl: "templates/auth-signup.html",
          controller: 'SignUpCtrl'
        }
      }
    })

    .state('menu', {
    url: '/menu',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'MenuCtrl'
  })

  .state('menu.homepage', {
    url: '/homepage',
    views: {
      'menuContent': {
        templateUrl: 'templates/menu-homepage.html',
      }
    }
  })

  .state('menu.newlist', {
      url: '/newlist',
      views: {
        'menuContent': {
          templateUrl: 'templates/menu-newlist.html',
          controller: 'NewListCtrl'
        }
      }
    })

    .state('menu.dispatchlists', {
      url: '/dispatchlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/menu-dispatchlists.html',
          controller: 'DispatchListsCtrl',
        }
      }
    })

  .state('menu.workloads', {
    url: '/workloads',
    views: {
      'menuContent': {
        templateUrl: 'templates/menu-workloads.html',
        controller: 'WorkloadsCtrl',
      }
    }
  })

  .state('menu.lists', {
    url: '/lists',
    views: {
      'menuContent': {
        templateUrl: 'templates/menu-lists.html',
        controller: 'ListsCtrl',
      }
    }
  })

  .state('menu.managelists', {
    url: '/managelists',
    views: {
      'menuContent': {
        templateUrl: 'templates/menu-managelists.html',
        controller: 'ManageListsCtrl',
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/auth/signin');
});
