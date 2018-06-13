// app.js
var routerApp = angular.module('routerApp', ['ui.router', 'toaster', 'ngAnimate']);

routerApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/home');
    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: function ($scope, $rootScope) {

                $rootScope.isLogin = false;
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
            templateUrl: 'account.html',
            controller: function ($scope, $http, toaster) {

                $scope.user = ''
                $scope.moreDetail = false;

                $scope.data = {
                    business_type: '',
                    state: '',
                    zip: '',
                    country: '',
                    phoneNumber: ''
                }


                $scope.doAddMoreDetail = function () {
                    $scope.moreDetail = !$scope.moreDetail;
                }

                $scope.doSaveAccount = function () {

                    $http({
                        method: 'POST',
                        data: {
                            data: $scope.data
                        },
                        url: '/api/updateOtherInfo'
                    }).then(function successCallback(response) {
                        toaster.pop({

                            title: 'Success',
                            body: 'User Info Saved Successfully',
                            onHideCallback: function () {
                                $scope.user = response.data.users.data
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
                $http.get("/api/SingleUser").then(function (response) {

                    $scope.user = response.data.users.data

                });
            }
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
        .state('hiring', {
            url: '/hiring/load?obj&userHired',
            templateUrl: 'Hiring.html',

            controller: function ($scope, $http, $stateParams, toaster) {
                let ps = JSON.parse($stateParams.obj);
                $scope.posts = ps.data.data.user;


                $scope.doConfirm = function (_id) {

                    $scope.isLoading = true;                   
                    $http({
                        method: 'POST',
                        data: {
                            josStatus: 'in_progress',
                            _id: _id,
                            userHired: $stateParams.userHired,
                            userStatus: 'user_hired'
                        },
                        url: '/api/ConfirmHire'
                    }).then(function successCallback(response) {
                        $scope.isLoading = false;
                        console.log(response)

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
        })
        .state('search', {
            url: '/search',
            templateUrl: 'search.html',
            controller: function ($scope, $http, $state) {

                var business_type = ["HairDresser", "HouseCleaner", "Housesitter", "IndependentTourGuide"
                    , "MassageTherapist", "MealPlanningExpert", "MusicInstructor", "NurseCaseWorker"];

                $scope.userChoiceHiring = true;

                $scope.doToggle = function () {
                    $scope.userChoiceHiring = !$scope.userChoiceHiring;
                }

                $scope.toHire = function (userid, experties) {

                    $http.get("/api/toHire?exprty=" + experties)
                        .then(function (response) {
                            $state.go('hiring', { obj: JSON.stringify(response), userHired: userid });
                        })
                }

                $http.get("/api/getServiceProvider")
                    .then(function (response) {
                        //  $scope.users = response.data.data.user;
                        $scope.SHairDresser = [];
                        $scope.SHouseCleaner = [];
                        $scope.SMealPlanningExpert = [];
                        $scope.SHousesitter = [];
                        $scope.SIndependentTourGuide = [];
                        $scope.SMassageTherapist = [];
                        $scope.SMusicInstructor = [];
                        $scope.SNurseCaseWorker = [];

                        var i = response.data.data.user;
                        i.forEach(item => {
                            if (item.business_type == "HairDresser") {
                                $scope.SHairDresser.push(item)
                            }
                            if (item.business_type == "HouseCleaner") {
                                $scope.SHouseCleaner.push(item)
                            }
                            if (item.business_type == "Housesitter") {
                                $scope.SHousesitter.push(item)
                            }
                            if (item.business_type == "IndependentTourGuide") {
                                $scope.SIndependentTourGuide.push(item)
                            }
                            if (item.business_type == "MassageTherapist") {
                                $scope.SMassageTherapist.push(item)
                            }
                            if (item.business_type == "MealPlanningExpert") {
                                $scope.SMealPlanningExpert.push(item)
                            }
                            if (item.business_type == "MusicInstructor") {
                                $scope.SMusicInstructor.push(item)
                            }
                            if (item.business_type == "NurseCaseWorker") {
                                $scope.SNurseCaseWorker.push(item)
                            }
                        })
                    })

                $http.get("/api/AllJustPostedJob").then(function (response) {

                    $scope.HairDresser = [];
                    $scope.HouseCleaner = [];
                    $scope.MealPlanningExpert = [];
                    $scope.Housesitter = [];
                    $scope.IndependentTourGuide = [];
                    $scope.MassageTherapist = [];
                    $scope.MusicInstructor = [];
                    $scope.NurseCaseWorker = [];

                    var i = response.data.data.user;
                    i.forEach(item => {
                        if (item.business_type == "HairDresser") {
                            $scope.HairDresser.push(item)
                        }
                        if (item.business_type == "HouseCleaner") {
                            $scope.HouseCleaner.push(item)
                        }
                        if (item.business_type == "Housesitter") {
                            $scope.Housesitter.push(item)
                        }
                        if (item.business_type == "IndependentTourGuide") {
                            $scope.IndependentTourGuide.push(item)
                        }
                        if (item.business_type == "MassageTherapist") {
                            $scope.MassageTherapist.push(item)
                        }
                        if (item.business_type == "MealPlanningExpert") {
                            $scope.MealPlanningExpert.push(item)
                        }
                        if (item.business_type == "MusicInstructor") {
                            $scope.MusicInstructor.push(item)
                        }
                        if (item.business_type == "NurseCaseWorker") {
                            $scope.NurseCaseWorker.push(item)
                        }
                    })
                });
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
                        url: '/auth/signup'
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
        .state('logout', {
            url: '/logout',
            controller: function ($rootScope, $state) {
                $rootScope.isLogin = true;
                $state.go('home')
            }
        })
        .state('jobdetail', {
            url: '/jobdetail/load?obj',
            templateUrl: 'complete.html',
            controller: function ($stateParams, $scope, $http) {
                $scope.user = JSON.parse($stateParams.obj)

                $scope.comments = '';
                let postid = $scope.user._id;
                $scope.status = false;
                let noOfStars = 0;
                $scope.star = function (i) {

                    if (i == '1') {
                        $scope.status1 = '1';
                        noOfStars = 1;
                    }
                    if (i == '2') {
                        $scope.status1 = '1';
                        $scope.status2 = '2';
                        noOfStars = 2;
                    }
                    if (i == '3') {
                        $scope.status1 = '1';
                        $scope.status2 = '2';
                        $scope.status3 = '3';
                        noOfStars = 3;
                    }

                    if (i == '4') {
                        $scope.status1 = '1';
                        $scope.status2 = '2';
                        $scope.status3 = '3';
                        $scope.status4 = '4';
                        noOfStars = 4;
                    }

                    if (i == '5') {
                        $scope.status1 = '1';
                        $scope.status2 = '2';
                        $scope.status3 = '3';
                        $scope.status4 = '4';
                        $scope.status5 = '5';
                        noOfStars = 5;
                    }



                }

                $scope.doSaveComments = function () {

                    console.log({
                        postid: postid,
                        noOfStars: noOfStars,
                        comments: $scope.comments,
                        josStatus: 'completed'
                    })
                    $http({
                        method: 'POST',
                        data: {
                            postid: postid,
                            noOfStars: noOfStars,
                            comments: $scope.comments,
                            josStatus: 'completed'
                        },
                        url: '/api/SaveReview'
                    }).then(function successCallback(response) {
                        $scope.isLoading = false;
                        console.log(response);

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
        })
        .state('businessPage', {
            url: '/business',
            templateUrl: 'business.html',
            controller: function ($scope, $state, $http, toaster) {

                $scope.jobDetail = function (item) {
                    $state.go('jobdetail', { obj: JSON.stringify(item) })
                }
                $scope.data = {
                    business_type: '',
                    state: '',
                    zip: '',
                    country: '',
                    phoneNumber: '',
                    jobDescription: '',
                    duration: '',
                    budget: '',

                }
                $scope.postJob = false;
                $scope.doPostJob = function () {
                    $scope.postJob = !$scope.postJob;

                }
                $scope.doSaveJob = function () {
                    $scope.isLoading = true;

                    $http({
                        method: 'POST',
                        data: $scope.data,
                        url: '/api/SavePost'
                    }).then(function successCallback(response) {
                        $scope.isLoading = false;

                        $http.get("/api/UserPost").then(function (response) {

                            $scope.jobs = response.data.data.user;

                        });


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

                $http.get("/api/UserPost").then(function (response) {

                    $scope.jobs = response.data.data.user;

                });





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
                        url: '/api/authenticate'
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
}).factory("httpInterceptor", function () {
    return {
        request: function (config) {

            //console.log("a http request is intersepted");

            var auth = JSON.parse(localStorage.getItem("user"));

            if (auth) {
                var token = auth.token
                var id = auth._id;

            }
            config.headers.Authorization = "Bearer " + token;



            if (token) {
                config.url = config.url + "?_id=" + id;
            }


            return config;
        }
    }
})

