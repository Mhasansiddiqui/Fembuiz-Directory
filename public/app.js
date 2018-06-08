// app.js
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'home.html'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            templateUrl: 'about.html'
            // we'll get to this in a bit       
        })

        .state('blog', {
            url: '/blog',
            templateUrl: 'blog.html'
            // we'll get to this in a bit       
        })

        .state('account', {
            url: '/membership',
            templateUrl: 'membership.html'
            // we'll get to this in a bit       
        })

        .state('supportServices', {
            url: '/supportservice',
            templateUrl: 'supportService.html'
            // we'll get to this in a bit       
        })
});