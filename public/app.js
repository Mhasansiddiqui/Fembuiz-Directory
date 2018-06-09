// app.js
var routerApp = angular.module('routerApp', ['ui.router', 'toaster', 'ngAnimate']);

routerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: function ($scope) {
                $scope.name = function () {

                }
            }
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
            url: '/account',
            templateUrl: 'account.html'
            // we'll get to this in a bit       
        })



        .state('membership-account-levels', {
            url: '/membership-account-levels',
            templateUrl: 'membership-account-levels.html',
            controller: function ($scope, $state) {

                $scope.business_type = 'service_provider';
                $scope.doSetLevel = function () {
                    $state.go('membership-account-checkout', { level: 3, business_type: $scope.business_type })
                }
            }
            // we'll get to this in a bit       
        })
        .state('search', {
            url: '/search',
            templateUrl: 'search.html',
            controller: function ($scope) {
                $scope.userChoiceHiring = true;

                $scope.doToggle = function () {
                    $scope.userChoiceHiring = !$scope.userChoiceHiring;
                }

            }
        })

        .state('membership-account-checkout', {
            url: '/membership-account-checkout/load?level&business_type',
            templateUrl: 'membership-account-checkout.html',
            controller: function ($scope, $stateParams, $rootScope, $state, $http, toaster) {

                $scope.doCheckOut = function () {
                    $http({
                        method: 'POST',
                        data: {
                            username: $scope.username,
                            password: $scope.password,
                            email: $scope.email,
                            isAdmin: $scope.isAdmin,
                            roll: $stateParams.business_type,
                            membershipLevel: $stateParams.level
                        },
                        url: 'https://fembuiz.herokuapp.com/auth/signup'
                    }).then(function successCallback(response) {
                        toaster.pop({

                            title: 'Success',
                            body: 'User Saved Successfully',
                            onHideCallback: function () {

                                $state.go('search')
                            }

                        });
                    }, function errorCallback(response) {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'Something went wrong',
                            bodyOutputType: 'trustedHtml'
                        });
                    })

                }
            }  // we'll get to this in a bit       
        })
        .state('businessPage', {
            url: '/business',
            templateUrl: 'business.html',
            controller: function ($scope) {
                $scope.postJob = false;
                $scope.doPostJob = function () {
                    $scope.postJob = !$scope.postJob;
                }
            }
            // we'll get to this in a bit       
        })
        .state('supportServices', {
            url: '/supportservice',
            templateUrl: 'supportService.html'
            // we'll get to this in a bit       
        })
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: function ($scope, $stateParams, $rootScope, $state, $http, toaster) {
                $scope.isLoading = false;

                $scope.doLogin = function () {
                    $scope.isLoading = true;
                    $http({
                        method: 'POST',
                        data: {
                            password: $scope.password,
                            email: $scope.email
                        },
                        url: 'https://fembuiz.herokuapp.com/api/authenticate'
                    }).then(function successCallback(response) {
                        $scope.isLoading = false;
                        if (response.data.user) {
                            localStorage.setItem('user', JSON.stringify(response.data.user));
                            $rootScope.isLogin = true;
                            $state.go('search')
                        }
                        else {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: response.data.message,
                                bodyOutputType: 'trustedHtml'
                            });
                        }

                    }, function errorCallback(response) {
                        $scope.isLoading = false;
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: 'Something went wrong',
                            bodyOutputType: 'trustedHtml'
                        });
                    })
                }
            }
            // we'll get to this in a bit       
        })
});
