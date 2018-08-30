var app = angular.module('reg', [
  'ui.router',
]);

app
  .config([
    '$httpProvider',
    function($httpProvider){

      // Add auth token to Authorization header
      $httpProvider.interceptors.push('AuthInterceptor');

    }])
  .run([
    'AuthService',
    'Session',
    function(AuthService, Session){

      // Startup, login if there's  a token.
      var token = Session.getToken();
      if (token){
        AuthService.loginWithToken(token);
      }

  }]);


angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'HackAU 2017',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'You should have received an email asking you verify your email. Click the link in the email and you can start your application!',
        INCOMPLETE_TITLE: 'You still need to complete your application!',
        INCOMPLETE: 'If you do not complete your application before the [APP_DEADLINE], you will not be considered for the admissions lottery!',
        SUBMITTED_TITLE: 'Your application has been submitted!',
        SUBMITTED: 'Feel free to edit it at any time. However, once registration is closed, you will not be able to edit it any further.\nAdmissions will be determined by a random lottery. Please make sure your information is accurate before registration is closed!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Unfortunately, registration has closed, and the lottery process has begun.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, you will not be eligible for the lottery process.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: 'You must confirm by [CONFIRM_DEADLINE].',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Your confirmation deadline of [CONFIRM_DEADLINE] has passed.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Although you were accepted, you did not complete your confirmation in time.\nUnfortunately, this means that you will not be able to attend the event, as we must begin to accept other applicants on the waitlist.\nWe hope to see you again next year!',
        CONFIRMED_NOT_PAST_TITLE: 'You can edit your confirmation information until [CONFIRM_DEADLINE]',
        DECLINED: 'We\'re sorry to hear that you won\'t be able to make it to HackMIT 2015! :(\nMaybe next year! We hope you see you again soon.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the lottery with a team.\nHowever, you can still form teams on your own before or during the event!',
    });

angular.module('reg')
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function (
            $stateProvider,
            $urlRouterProvider,
            $locationProvider) {

            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/404");

            // Set up de states
            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: "views/login/login.html",
                    controller: 'LoginCtrl',
                    data: {
                        requireLogin: false
                    },
                    resolve: {
                        'settings': ["SettingsService", function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }]
                    }
                })
                .state('app', {
                    views: {
                        '': {
                            templateUrl: "views/base.html"
                        },
                        'sidebar@app': {
                            templateUrl: "views/sidebar/sidebar.html",
                            controller: 'SidebarCtrl',
                            resolve: {
                                'settings': ["SettingsService", function (SettingsService) {
                                    return SettingsService.getPublicSettings();
                                }]
                            }

                        }
                    },
                    data: {
                        requireLogin: true
                    }
                })
                .state('app.dashboard', {
                    url: "/",
                    templateUrl: "views/dashboard/dashboard.html",
                    controller: 'DashboardCtrl',
                    resolve: {
                        currentUser: ["UserService", function (UserService) {
                            return UserService.getCurrentUser();
                        }],
                        settings: ["SettingsService", function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }]
                    },
                })
                .state('app.guide', {
                    url: "/guide",
                    templateUrl: "views/admin-views/guide/guide.html",
                    controller: 'GuideCtrl'
                })
                .state('app.application', {
                    url: "/application",
                    templateUrl: "views/application/application.html",
                    controller: 'ApplicationCtrl',
                    resolve: {
                        currentUser: ["UserService", function (UserService) {
                            return UserService.getCurrentUser();
                        }],
                        settings: ["SettingsService", function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }]
                    }
                })
                .state('app.confirmation', {
                    url: "/confirmation",
                    templateUrl: "views/confirmation/confirmation.html",
                    controller: 'ConfirmationCtrl',
                    resolve: {
                        currentUser: ["UserService", function (UserService) {
                            return UserService.getCurrentUser();
                        }]
                    }
                })
                .state('app.team', {
                    url: "/team",
                    templateUrl: "views/team/team.html",
                    controller: 'TeamCtrl',
                    data: {
                        requireVerified: true
                    },
                    resolve: {
                        currentUser: ["UserService", function (UserService) {
                            return UserService.getCurrentUser();
                        }],
                        settings: ["SettingsService", function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }]
                    }
                })
                .state('app.teams', {
                    url: "/teams",
                    templateUrl: "views/admin-views/teams/teams.html",
                    controller: 'TeamsCtrl',
                    data: {
                        // requireVerified: true
                    },
                    resolve: {
                        currentUser: ["UserService", function (UserService) {
                            return UserService.getCurrentUser();
                        }],
                        settings: ["SettingsService", function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }]
                    }
                })
                .state('app.admin', {
                    views: {
                        '': {
                            templateUrl: "views/admin-views/admin/admin.html",
                            controller: 'AdminCtrl'
                        }
                    },
                    data: {
                        requireAdmin: true
                    }
                })
                .state('app.admin.stats', {
                    url: "/admin",
                    templateUrl: "views/admin-views/admin/stats/stats.html",
                    controller: 'AdminStatsCtrl'
                })
                .state('app.admin.users', {
                    url: "/admin/users?" +
                    '&page' +
                    '&size' +
                    '&query',
                    templateUrl: "views/admin-views/admin/users/users.html",
                    controller: 'AdminUsersCtrl'
                })
                .state('app.admin.user', {
                    url: "/admin/users/:id",
                    templateUrl: "views/admin-views/admin/user/user.html",
                    controller: 'AdminUserCtrl',
                    resolve: {
                        'user': ["$stateParams", "UserService", function ($stateParams, UserService) {
                            return UserService.get($stateParams.id);
                        }]
                    }
                })
                .state('app.admin.settings', {
                    url: "/admin/settings",
                    templateUrl: "views/admin-views/admin/settings/settings.html",
                    controller: 'AdminSettingsCtrl',
                })
                .state('reset', {
                    url: "/reset/:token",
                    templateUrl: "views/reset/reset.html",
                    controller: 'ResetCtrl',
                    data: {
                        requireLogin: false
                    }
                })
                .state('verify', {
                    url: "/verify/:token",
                    templateUrl: "views/verify/verify.html",
                    controller: 'VerifyCtrl',
                    data: {
                        requireLogin: false
                    }
                })
                .state('404', {
                    url: "/404",
                    templateUrl: "views/404.html",
                    data: {
                        requireLogin: false
                    }
                });

            $locationProvider.html5Mode({
                enabled: true,
            });

        }])
    .run([
        '$rootScope',
        '$state',
        'Session',
        function (
            $rootScope,
            $state,
            Session) {

            $rootScope.$on('$stateChangeSuccess', function () {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var requireLogin = toState.data.requireLogin;
                var requireAdmin = toState.data.requireAdmin;
                var requireVerified = toState.data.requireVerified;

                if (requireLogin && !Session.getToken()) {
                    event.preventDefault();
                    $state.go('login');
                }

                if (requireAdmin && !Session.getUser().admin) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (requireVerified && !Session.getUser().verified) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

            });

        }]);

angular.module('reg')
  .factory('AuthInterceptor', [
    'Session',
    function(Session){
      return {
          request: function(config){
            var token = Session.getToken();
            if (token){
              config.headers['x-access-token'] = token;
            }
            return config;
          }
        };
    }]);
angular.module('reg')
  .service('Session', [
    '$rootScope',
    '$window',
    function($rootScope, $window){

    this.create = function(token, user){
      $window.localStorage.jwt = token;
      $window.localStorage.userId = user._id;
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

    this.destroy = function(onComplete){
      delete $window.localStorage.jwt;
      delete $window.localStorage.userId;
      delete $window.localStorage.currentUser;
      $rootScope.currentUser = null;
      if (onComplete){
        onComplete();
      }
    };

    this.getToken = function(){
      return $window.localStorage.jwt;
    };

    this.getUserId = function(){
      return $window.localStorage.userId;
    };

    this.getUser = function(){
      return JSON.parse($window.localStorage.currentUser);
    };

    this.setUser = function(user){
      $window.localStorage.currentUser = JSON.stringify(user);
      $rootScope.currentUser = user;
    };

  }]);
angular.module('reg')
  .factory('Utils', [
    function(){
      return {
        isRegOpen: function(settings){
          return Date.now() > settings.timeOpen && Date.now() < settings.timeClose;
        },
        isAfter: function(time){
          return Date.now() > time;
        },
        formatTime: function(time){

          if (!time){
            return "Invalid Date";
          }

          date = new Date(time);
          // Hack for timezone
          return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
            " " + date.toTimeString().split(' ')[2];

        }
      };
    }]);
angular.module('reg')
  .factory('AuthService', [
    '$http',
    '$rootScope',
    '$state',
    '$window',
    'Session',
    function($http, $rootScope, $state, $window, Session) {
      var authService = {};

      function loginSuccess(data, cb){
        // Winner winner you get a token
        Session.create(data.token, data.user);

        if (cb){
          cb(data.user);
        }
      }

      function loginFailure(data, cb){
        $state.go('login');
        if (cb) {
          cb(data);
        }
      }

      authService.loginWithPassword = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/login', {
            email: email,
            password: password
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data){
            loginFailure(data, onFailure);
          });
      };

      authService.loginWithToken = function(token, onSuccess, onFailure){
        return $http
          .post('/auth/login', {
            token: token
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data, statusCode){
            if (statusCode === 400){
              Session.destroy(loginFailure);
            }
          });
      };

      authService.logout = function(callback) {
        // Clear the session
        Session.destroy(callback);
        $state.go('login');
      };

      authService.register = function(email, password, onSuccess, onFailure) {
        return $http
          .post('/auth/register', {
            email: email,
            password: password
          })
          .success(function(data){
            loginSuccess(data, onSuccess);
          })
          .error(function(data){
            loginFailure(data, onFailure);
          });
      };

      authService.verify = function(token, onSuccess, onFailure) {
        return $http
          .get('/auth/verify/' + token)
          .success(function(user){
            Session.setUser(user);
            if (onSuccess){
              onSuccess(user);
            }
          })
          .error(function(data){
            if (onFailure) {
              onFailure(data);
            }
          });
      };

      authService.resendVerificationEmail = function(onSuccess, onFailure){
        return $http
          .post('/auth/verify/resend', {
            id: Session.getUserId()
          });
      };

      authService.sendResetEmail = function(email){
        return $http
          .post('/auth/reset', {
            email: email
          });
      };

      authService.resetPassword = function(token, pass, onSuccess, onFailure){
        return $http
          .post('/auth/reset/password', {
            token: token,
            password: pass
          })
          .success(onSuccess)
          .error(onFailure);
      };

      return authService;
    }
  ]);
angular.module('reg')
  .factory('SettingsService', [
  '$http',
  function($http){

    var base = '/api/settings/';

    return {
      getPublicSettings: function(){
        return $http.get(base);
      },
      updateRegistrationTimes: function(open, close){
        return $http.put(base + 'times', {
          timeOpen: open,
          timeClose: close,
        });
      },
      updateConfirmationTime: function(time){
        return $http.put(base + 'confirm-by', {
          time: time
        });
      },
      getWhitelistedEmails: function(){
        return $http.get(base + 'whitelist');
      },
      updateWhitelistedEmails: function(emails){
        return $http.put(base + 'whitelist', {
          emails: emails
        });
      },
      updateWaitlistText: function(text){
        return $http.put(base + 'waitlist', {
          text: text
        });
      },
      updateAcceptanceText: function(text){
        return $http.put(base + 'acceptance', {
          text: text
        });
      },
      updateConfirmationText: function(text){
        return $http.put(base + 'confirmation', {
          text: text
        });
      }
    };

  }
  ]);

angular.module('reg')
    .factory('TeamService', [
        '$http',
        function($http){

            var base = '/api/teams/';

            return {
                getTeams: function(){
                    return $http.get(base);
                },
                createTeam: function(data){
                    return $http.post(base, {team: data});
                },
                deleteTeam: function (teamId) {
                    // console.log("deleted " + teamId);
                }
            };

        }
    ]);

angular.module('reg')
  .factory('UserService', [
  '$http',
  'Session',
  function($http, Session){

    var users = '/api/users';
    var base = users + '/';

    return {

      // ----------------------
      // Basic Actions
      // ----------------------
      getCurrentUser: function(){
        return $http.get(base + Session.getUserId());
      },

      get: function(id){
        return $http.get(base + id);
      },

      getAll: function(){
        return $http.get(base);
      },

      getPage: function(page, size, text){
        return $http.get(users + '?' + $.param(
          {
            text: text,
            page: page ? page : 0,
            size: size ? size : 50
          })
        );
      },

      updateProfile: function(id, profile){
        return $http.put(base + id + '/profile', {
          profile: profile
        });
      },

      updateConfirmation: function(id, confirmation){
        return $http.put(base + id + '/confirm', {
          confirmation: confirmation
        });
      },

      declineAdmission: function(id){
        return $http.post(base + id + '/decline');
      },

      // ------------------------
      // Team
      // ------------------------
      joinOrCreateTeam: function(code){
        return $http.put(base + Session.getUserId() + '/team', {
          code: code
        });
      },

      leaveTeam: function(){
        return $http.delete(base + Session.getUserId() + '/team');
      },

      getMyTeammates: function(){
        return $http.get(base + Session.getUserId() + '/team');
      },

      // -------------------------
      // Admin Only
      // -------------------------

      getStats: function(){
        return $http.get(base + 'stats');
      },

      admitUser: function(id){
        return $http.post(base + id + '/admit');
      },

      checkIn: function(id){
        return $http.post(base + id + '/checkin');
      },

      checkOut: function(id){
        return $http.post(base + id + '/checkout');
      },

      removeUser: function(id) {
        return $http.post(base + id + '/remove');
      }

    };
  }
  ]);

angular.module('reg')
  .controller('AdminCtrl', [
    '$scope',
    'UserService',
    function($scope, UserService){
      $scope.loading = true;
    }]);
angular.module('reg')
    .controller('TeamsCtrl', [
        '$scope',
        'currentUser',
        'settings',
        'Utils',
        'UserService',
        'TeamService',
        'TEAM',
        function ($scope, currentUser, settings, Utils, UserService, TeamService, TEAM) {
            // Get the current user's most recent data.
            var Settings = settings.data;

            $scope.regIsOpen = Utils.isRegOpen(Settings);

            $scope.user = currentUser.data;

            $scope.TEAM = TEAM;
            $scope.teams = [];


            TeamService.getTeams()
                .success( teams => {
                    // console.log(teams);
                    $scope.teams = teams;
                });


            $scope.deleteTeam = function (team) {
                $scope.teams.remove(team);
            }

            $scope.createTeam = function () {

                TeamService.createTeam({title: $scope.teamTitle, description: $scope.teamDesc})
                    .success( ({team}) => {
                        console.log("team created:", team);
                        $scope.teams.push(team);
                    })
            }


        }]);

angular.module('reg')
    .controller('GuideCtrl', [
        '$scope',
        function($scope) {

            // Anchor scrolling
            window.onscroll = function() {
                scrollFunction()
            };

            function scrollFunction() {
                if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                    document.getElementById("myBtn").style.display = "block";
                } else {
                    document.getElementById("myBtn").style.display = "none";
                }
            }

            document.getElementById('myBtn').addEventListener('click', function() {
                $("html, body").animate({
                    scrollTop: 0
                }, "fast");
            });

            $('a[href^="#"]').click(function() {
                $('html, body').animate({
                    scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top
                }, 500);

                return false;
            });

            // Sticky date section
            // $(document).ready(function() {
            //     var sticky_4_to_9_months = $("#months49").offset();
            //     var sticky_4_months = $("#months4").offset();
            //     var sticky_2_months = $("#months2").offset();
            //     var sticky_1_month = $("#month").offset();
            //     var sticky_1_week = $("#week").offset();
            //     var day_of_event = $("#dayofevent").offset();
            //
            //     $(window).scroll(function() {
            //         var scroll = $(window).scrollTop();
            //         if (scroll < sticky_4_to_9_months.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_4_to_9_months.top <= scroll && scroll < sticky_4_months.top) {
            //             $('#months49').addClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_4_months.top <= scroll && scroll < sticky_2_months.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').addClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_2_months.top <= scroll && scroll < sticky_1_month.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').addClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_1_month.top <= scroll && scroll < sticky_1_week.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').addClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_1_week.top <= scroll && scroll < day_of_event.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').addClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (day_of_event.top <= scroll) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').addClass('sticky');
            //         } else {
            //             $('#dayofevent').removeClass('sticky');
            //         }
            //     });
            // });
            setTimeout(function(){
                var stickyHeaders = (function() {
                    var $window = $(window),
                        $stickies;

                    var load = function(stickies) {

                        if (typeof stickies === "object" && stickies instanceof jQuery && stickies.length > 0) {
                            $stickies = stickies.each(function() {
                                var $thisSticky = $(this).wrap('<div class="followWrap" />');

                                $thisSticky
                                    .data('originalPosition', $thisSticky.offset().top)
                                    .data('originalHeight', $thisSticky.outerHeight())
                                    .parent()
                                    .height($thisSticky.outerHeight());
                            });

                            $window.off("scroll.stickies").on("scroll.stickies", function() {
                                _whenScrolling();
                            });
                        }
                    };

                    var _whenScrolling = function() {
                        $stickies.each(function(i) {
                            var $thisSticky = $(this),
                                $stickyPosition = $thisSticky.data('originalPosition');

                            if ($stickyPosition <= $window.scrollTop()) {
                                var $nextSticky = $stickies.eq(i + 1),
                                    $nextStickyPosition = $nextSticky.data('originalPosition') - $thisSticky.data('originalHeight');

                                $thisSticky.addClass("fixed");

                                if ($nextSticky.length > 0 && $thisSticky.offset().top >= $nextStickyPosition) {
                                    $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
                                }

                            } else {
                                var $prevSticky = $stickies.eq(i - 1);

                                $thisSticky.removeClass("fixed");

                                if ($prevSticky.length > 0 && $window.scrollTop() <= $thisSticky.data('originalPosition') - $thisSticky.data('originalHeight')) {
                                    $prevSticky.removeClass("absolute").removeAttr("style");
                                }
                            }
                        });
                    };

                    return {
                        load: load
                    };
                })();

                $(function() {
                    stickyHeaders.load($(".sticky"));
                });
            }, 500);

        }
    ]);

angular.module('reg')
  .controller('AdminSettingsCtrl', [
    '$scope',
    '$sce',
    'SettingsService',
    function($scope, $sce, SettingsService){

      $scope.settings = {};
      SettingsService
        .getPublicSettings()
        .success(function(settings){
          updateSettings(settings);
        });

      function updateSettings(settings){
        $scope.loading = false;
         // Format the dates in settings.
        settings.timeOpen = new Date(settings.timeOpen);
        settings.timeClose = new Date(settings.timeClose);
        settings.timeConfirm = new Date(settings.timeConfirm);

        $scope.settings = settings;
      }

      // Whitelist --------------------------------------

      SettingsService
        .getWhitelistedEmails()
        .success(function(emails){
          $scope.whitelist = emails.join(", ");
        });

      $scope.updateWhitelist = function(){
        SettingsService
          .updateWhitelistedEmails($scope.whitelist.replace(/ /g, '').split(','))
          .success(function(settings){
            swal('Whitelist updated.');
            $scope.whitelist = settings.whitelistedEmails.join(", ");
          });
      };

      // Registration Times -----------------------------

      $scope.formatDate = function(date){
        if (!date){
          return "Invalid Date";
        }

        // Hack for timezone
        return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
          " " + date.toTimeString().split(' ')[2];
      };

      // Take a date and remove the seconds.
      function cleanDate(date){
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        );
      }

      $scope.updateRegistrationTimes = function(){
        // Clean the dates and turn them to ms.
        var open = cleanDate($scope.settings.timeOpen).getTime();
        var close = cleanDate($scope.settings.timeClose).getTime();

        if (open < 0 || close < 0 || open === undefined || close === undefined){
          return swal('Oops...', 'You need to enter valid times.', 'error');
        }
        if (open >= close){
          swal('Oops...', 'Registration cannot open after it closes.', 'error');
          return;
        }

        SettingsService
          .updateRegistrationTimes(open, close)
          .success(function(settings){
            updateSettings(settings);
            swal("Looks good!", "Registration Times Updated", "success");
          });
      };

      // Confirmation Time -----------------------------

      $scope.updateConfirmationTime = function(){
        var confirmBy = cleanDate($scope.settings.timeConfirm).getTime();

        SettingsService
          .updateConfirmationTime(confirmBy)
          .success(function(settings){
            updateSettings(settings);
            swal("Sounds good!", "Confirmation Date Updated", "success");
          });
      };

      // Acceptance / Confirmation Text ----------------

      var converter = new showdown.Converter();

      $scope.markdownPreview = function(text){
        return $sce.trustAsHtml(converter.makeHtml(text));
      };

      $scope.updateWaitlistText = function(){
        var text = $scope.settings.waitlistText;
        SettingsService
          .updateWaitlistText(text)
          .success(function(data){
            swal("Looks good!", "Waitlist Text Updated", "success");
            updateSettings(data);
          });
      };

      $scope.updateAcceptanceText = function(){
        var text = $scope.settings.acceptanceText;
        SettingsService
          .updateAcceptanceText(text)
          .success(function(data){
            swal("Looks good!", "Acceptance Text Updated", "success");
            updateSettings(data);
          });
      };

      $scope.updateConfirmationText = function(){
        var text = $scope.settings.confirmationText;
        SettingsService
          .updateConfirmationText(text)
          .success(function(data){
            swal("Looks good!", "Confirmation Text Updated", "success");
            updateSettings(data);
          });
      };

    }]);
angular.module('reg')
  .controller('AdminStatsCtrl',[
    '$scope',
    'UserService',
    function($scope, UserService){

      UserService
        .getStats()
        .success(function(stats){
          $scope.stats = stats;
          $scope.loading = false;
        });

      $scope.fromNow = function(date){
        return moment(date).fromNow();
      };

    }]);
angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    'user',
    'UserService',
    function($scope, $http, User, UserService){
      $scope.selectedUser = User.data;

      // Populate the school dropdown
      populateSchools();

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){

        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }

          });
      }


      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .success(function(data){
            $selectedUser = data;
            swal("Updated!", "Profile updated.", "success");
          })
          .error(function(){
            swal("Oops, you forgot something.");
          });
      };

    }]);
angular.module('reg')
  .controller('AdminUsersCtrl',[
    '$scope',
    '$state',
    '$stateParams',
    'UserService',
    function($scope, $state, $stateParams, UserService){

      $scope.pages = [];
      $scope.users = [];

      // Semantic-UI moves modal content into a dimmer at the top level.
      // While this is usually nice, it means that with our routing will generate
      // multiple modals if you change state. Kill the top level dimmer node on initial load
      // to prevent this.
      $('.ui.dimmer').remove();
      // Populate the size of the modal for when it appears, with an arbitrary user.
      $scope.selectedUser = {};
      $scope.selectedUser.sections = generateSections({status: '', confirmation: {
        dietaryRestrictions: []
      }, profile: ''});

      function updatePage(data){
        $scope.users = data.users;
        $scope.currentPage = data.page;
        $scope.pageSize = data.size;

        var p = [];
        for (var i = 0; i < data.totalPages; i++){
          p.push(i);
        }
        $scope.pages = p;
      }

      UserService
        .getPage($stateParams.page, $stateParams.size, $stateParams.query)
        .success(function(data){
          updatePage(data);
        });

      $scope.$watch('queryText', function(queryText){
        UserService
          .getPage($stateParams.page, $stateParams.size, queryText)
          .success(function(data){
            updatePage(data);
          });
      });

      $scope.goToPage = function(page){
        $state.go('app.admin.users', {
          page: page,
          size: $stateParams.size || 50
        });
      };

      $scope.goUser = function($event, user){
        $event.stopPropagation();

        $state.go('app.admin.user', {
          id: user._id
        });
      };

      $scope.toggleCheckIn = function($event, user, index) {
        $event.stopPropagation();

        if (!user.status.checkedIn){
          swal({
            title: "Whoa, wait a minute!",
            text: "You are about to check in " + user.profile.name + "!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, check them in.",
            closeOnConfirm: false
            },
            function(){
              UserService
                .checkIn(user._id)
                .success(function(user){
                  $scope.users[index] = user;
                  swal("Checked in", user.profile.name + ' has been checked in.', "success");
                })
                .error(function(err){
                    swal("Not checked in", user.profile.name + ' could not be checked in. ', "error");
                  });
            }
          );
        } else {
          UserService
            .checkOut(user._id)
            .success(function(user){
              $scope.users[index] = user;
              swal("Checked out", user.profile.name + ' has been checked out.', "success");
            })
            .error(function(err){
                    swal("Not checked out", user.profile.name + ' could not be checked out. ', "error");
            });
        }
      };

      $scope.acceptUser = function($event, user, index) {
        $event.stopPropagation();

        // if (!user.status.admitted){
        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to accept " + user.profile.name + "!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, accept them.",
          closeOnConfirm: false
          }, function(){

            swal({
              title: "Are you sure?",
              text: "Your account will be logged as having accepted this user. " +
                "Remember, this power is a privilege.",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, accept this user.",
              closeOnConfirm: false
              }, function(){

                UserService
                  .admitUser(user._id)
                  .success(function(user){
                    $scope.users[index] = user;
                    swal("Accepted", user.profile.name + ' has been admitted.', "success");
                  })
                  .error(function(err){
                    swal("Not admitted", user.profile.name + ' could not be admitted. ', "error");
                  });

              });

          });
        
          // else {
          //     // unadmit user
              
          // }

      };

      // delete User from records
      $scope.removeUser = function($event, user, index) {
        $event.stopPropagation();

        swal({
          title: "Whoa, wait a minute!",
          text: "You are about to delete " + user.profile.name + "!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete user.",
          closeOnConfirm: false
          }, function(){

            swal({
              title: "Are you sure?",
              text: "Your account will be logged as having deleted this user. " +
                "Remember, this power is a privilege.",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete this user.",
              closeOnConfirm: false
              }, function(){

                UserService
                  .removeUser(user._id)
                  .success(function(user){
                    $scope.users.splice(index,1);
                    swal("Deleted", user.profile.name + ' has been deleted.', "success");
                  })
                  .error(function(err){
                    swal("Not deleted", user.profile.name + ' could not be deleted. ', "error");
                  });

              });

          });

      };

      function formatTime(time){
        if (time) {
          return moment(time).format('MMMM Do YYYY, h:mm:ss a');
        }
      }

      $scope.rowClass = function(user) {
        if (user.admin){
          return 'admin';
        }
        if (user.status.confirmed) {
          return 'positive';
        }
        if (user.status.admitted && !user.status.confirmed) {
          return 'warning';
        }
      };

      function selectUser(user){
        $scope.selectedUser = user;
        $scope.selectedUser.sections = generateSections(user);
        $('.long.user.modal')
          .modal('show');
      }

      function generateSections(user){
        return [
          {
            name: 'Basic Info',
            fields: [
              {
                name: 'Created On',
                value: formatTime(user.timestamp)
              },{
                name: 'Last Updated',
                value: formatTime(user.lastUpdated)
              },{
                name: 'Confirm By',
                value: formatTime(user.status.confirmBy) || 'N/A'
              },{
                name: 'Checked In',
                value: formatTime(user.status.checkInTime) || 'N/A'
              },{
                name: 'Email',
                value: user.email
              },{
                name: 'Team',
                value: user.teamCode || 'None'
              }
            ]
          },{
            name: 'Profile',
            fields: [
              {
                name: 'Name',
                value: user.profile.name
              },{
                name: 'Gender',
                value: user.profile.gender
              },{
                name: 'School',
                value: user.profile.school
              },{
                name: 'Graduation Year',
                value: user.profile.graduationYear
              },{
                name: 'Description',
                value: user.profile.description
              },{
                name: 'Essay',
                value: user.profile.essay
              }
            ]
          },{
            name: 'Confirmation',
            fields: [
              {
                name: 'Phone Number',
                value: user.confirmation.phoneNumber
              },{
                name: 'Dietary Restrictions',
                value: user.confirmation.dietaryRestrictions.join(', ')
              },{
                name: 'Shirt Size',
                value: user.confirmation.shirtSize
              },{
                name: 'Major',
                value: user.confirmation.major
              },{
                name: 'Github',
                value: user.confirmation.github
              },{
                name: 'Website',
                value: user.confirmation.website
              },{
                name: 'Needs Hardware',
                value: user.confirmation.needsHardware,
                type: 'boolean'
              },{
                name: 'Hardware Requested',
                value: user.confirmation.hardware
              }
            ]
          },{
            name: 'Hosting',
            fields: [
              {
                name: 'Needs Hosting Friday',
                value: user.confirmation.hostNeededFri,
                type: 'boolean'
              },{
                name: 'Needs Hosting Saturday',
                value: user.confirmation.hostNeededSat,
                type: 'boolean'
              },{
                name: 'Gender Neutral',
                value: user.confirmation.genderNeutral,
                type: 'boolean'
              },{
                name: 'Cat Friendly',
                value: user.confirmation.catFriendly,
                type: 'boolean'
              },{
                name: 'Smoking Friendly',
                value: user.confirmation.smokingFriendly,
                type: 'boolean'
              },{
                name: 'Hosting Notes',
                value: user.confirmation.hostNotes
              }
            ]
          },{
            name: 'Travel',
            fields: [
              {
                name: 'Needs Reimbursement',
                value: user.confirmation.needsReimbursement,
                type: 'boolean'
              },{
                name: 'Received Reimbursement',
                value: user.confirmation.needsReimbursement && user.status.reimbursementGiven
              },{
                name: 'Address',
                value: user.confirmation.address ? [
                  user.confirmation.address.line1,
                  user.confirmation.address.line2,
                  user.confirmation.address.city,
                  ',',
                  user.confirmation.address.state,
                  user.confirmation.address.zip,
                  ',',
                  user.confirmation.address.country,
                ].join(' ') : ''
              },{
                name: 'Additional Notes',
                value: user.confirmation.notes
              }
            ]
          }
        ];
      }

      $scope.selectUser = selectUser;

    }]);












































angular.module('reg')
  .controller('ApplicationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$http',
    'currentUser',
    'settings',
    'Session',
    'UserService',
    function($scope, $rootScope, $state, $http, currentUser, Settings, Session, UserService){

      // Set up the user
      $scope.user = currentUser.data;

      // Is the student from MIT?
      $scope.isMitStudent = $scope.user.email.split('@')[1] == 'mit.edu';

      // If so, default them to adult: true
      if ($scope.isMitStudent){
        $scope.user.profile.adult = true;
      }

      // Populate the school dropdown
      populateSchools();
      _setupForm();

      $scope.regIsClosed = Date.now() > Settings.data.timeClose;

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){

        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.user.email.split('@')[1];

            if (schools[email]){
              $scope.user.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });
      }

      function _updateUser(e){
        UserService
          .updateProfile(Session.getUserId(), $scope.user.profile)
          .success(function(data){
            sweetAlert({
              title: "Awesome!",
              text: "Your application has been saved.",
              type: "success",
              confirmButtonColor: "#e76482"
            }, function(){
              $state.go('app.dashboard');
            });
          })
          .error(function(res){
            sweetAlert("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            name: {
              identifier: 'name',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your name.'
                }
              ]
            },
            school: {
              identifier: 'school',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter your school name.'
                }
              ]
            },
            year: {
              identifier: 'year',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select your graduation year.'
                }
              ]
            },
            gender: {
              identifier: 'gender',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please select a gender.'
                }
              ]
            },
            adult: {
              identifier: 'adult',
              rules: [
                {
                  type: 'checked',
                  prompt: 'You must be an adult, or an MIT student.'
                }
              ]
            }
          }
        });
      }



      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        }
      };

    }]);
angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;

      $scope.pastConfirmation = Date.now() > user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

      // -------------------------------
      // All this just for dietary restriction checkboxes fml

      var dietaryRestrictions = {
        'Vegetarian': false,
        'Vegan': false,
        'Halal': false,
        'Kosher': false,
        'Nut Allergy': false
      };

      if (user.confirmation.dietaryRestrictions){
        user.confirmation.dietaryRestrictions.forEach(function(restriction){
          if (restriction in dietaryRestrictions){
            dietaryRestrictions[restriction] = true;
          }
        });
      }

      $scope.dietaryRestrictions = dietaryRestrictions;

      // -------------------------------

      function _updateUser(e){
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];
        Object.keys($scope.dietaryRestrictions).forEach(function(key){
          if ($scope.dietaryRestrictions[key]){
            drs.push(key);
          }
        });
        confirmation.dietaryRestrictions = drs;

        UserService
          .updateConfirmation(user._id, confirmation)
          .success(function(data){
            sweetAlert({
              title: "Woo!",
              text: "You're confirmed!",
              type: "success",
              confirmButtonColor: "#e76482"
            }, function(){
              $state.go('app.dashboard');
            });
          })
          .error(function(res){
            sweetAlert("Uh oh!", "Something went wrong.", "error");
          });
      }

      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            shirt: {
              identifier: 'shirt',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please give us a shirt size!'
                }
              ]
            },
            phone: {
              identifier: 'phone',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please enter a phone number.'
                }
              ]
            },
            signatureLiability: {
              identifier: 'signatureLiabilityWaiver',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            signaturePhotoRelease: {
              identifier: 'signaturePhotoRelease',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
            signatureCodeOfConduct: {
              identifier: 'signatureCodeOfConduct',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Please type your digital signature.'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        }
      };

    }]);
angular.module('reg')
  .controller('DashboardCtrl', [
    '$rootScope',
    '$scope',
    '$sce',
    'currentUser',
    'settings',
    'Utils',
    'AuthService',
    'UserService',
    'EVENT_INFO',
    'DASHBOARD',
    function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService, DASHBOARD){
      var Settings = settings.data;
      var user = currentUser.data;
      $scope.user = user;

      $scope.DASHBOARD = DASHBOARD;
      
      for (var msg in $scope.DASHBOARD) {
        if ($scope.DASHBOARD[msg].includes('[APP_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[APP_DEADLINE]', Utils.formatTime(Settings.timeClose));
        }
        if ($scope.DASHBOARD[msg].includes('[CONFIRM_DEADLINE]')) {
          $scope.DASHBOARD[msg] = $scope.DASHBOARD[msg].replace('[CONFIRM_DEADLINE]', Utils.formatTime(user.status.confirmBy));
        }
      }

      // Is registration open?
      var regIsOpen = $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Is it past the user's confirmation time?
      var pastConfirmation = $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.dashState = function(status){
        var user = $scope.user;
        switch (status) {
          case 'unverified':
            return !user.verified;
          case 'openAndIncomplete':
            return regIsOpen && user.verified && !user.status.completedProfile;
          case 'openAndSubmitted':
            return regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'closedAndIncomplete':
            return !regIsOpen && !user.status.completedProfile && !user.status.admitted;
          case 'closedAndSubmitted': // Waitlisted State
            return !regIsOpen && user.status.completedProfile && !user.status.admitted;
          case 'admittedAndCanConfirm':
            return !pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'admittedAndCannotConfirm':
            return pastConfirmation &&
              user.status.admitted &&
              !user.status.confirmed &&
              !user.status.declined;
          case 'confirmed':
            return user.status.admitted && user.status.confirmed && !user.status.declined;
          case 'declined':
            return user.status.declined;
        }
        return false;
      };

      $scope.showWaitlist = !regIsOpen && user.status.completedProfile && !user.status.admitted;

      $scope.resendEmail = function(){
        AuthService
          .resendVerificationEmail()
          .then(function(){
            sweetAlert('Your email has been sent.');
          });
      };


      // -----------------------------------------------------
      // Text!
      // -----------------------------------------------------
      var converter = new showdown.Converter();
      $scope.acceptanceText = $sce.trustAsHtml(converter.makeHtml(Settings.acceptanceText));
      $scope.confirmationText = $sce.trustAsHtml(converter.makeHtml(Settings.confirmationText));
      $scope.waitlistText = $sce.trustAsHtml(converter.makeHtml(Settings.waitlistText));


      $scope.declineAdmission = function(){

        swal({
          title: "Whoa!",
          text: "Are you sure you would like to decline your admission? \n\n You can't go back!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, I can't make it.",
          closeOnConfirm: true
          }, function(){

            UserService
              .declineAdmission(user._id)
              .success(function(user){
                $rootScope.currentUser = user;
                $scope.user = user;
              });
        });
      };

    }]);

angular.module('reg')
  .controller('LoginCtrl', [
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    function($scope, $http, $state, settings, Utils, AuthService){

      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login
      $scope.loginState = 'login';

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.login = function(){
        resetError();
        AuthService.loginWithPassword(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.register = function(){
        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

      $scope.setLoginState = function(state) {
        $scope.loginState = state;
      };

      $scope.sendResetEmail = function() {
        var email = $scope.email;
        AuthService.sendResetEmail(email);
        sweetAlert({
          title: "Don't Sweat!",
          text: "An email should be sent to you shortly.",
          type: "success",
          confirmButtonColor: "#e76482"
        });
      };

    }
  ]);

angular.module('reg')
  .controller('ResetCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'AuthService',
    function($scope, $stateParams, $state, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      $scope.changePassword = function(){
        var password = $scope.password;
        var confirm = $scope.confirm;

        if (password !== confirm){
          $scope.error = "Passwords don't match!";
          $scope.confirm = "";
          return;
        }

        AuthService.resetPassword(
          token,
          $scope.password,
          function(message){
            sweetAlert({
              title: "Neato!",
              text: "Your password has been changed!",
              type: "success",
              confirmButtonColor: "#e76482"
            }, function(){
              $state.go('login');
            });
          },
          function(data){
            $scope.error = data.message;
            $scope.loading = false;
          });
      };

    }]);
angular.module('reg')
  .controller('SidebarCtrl', [
    '$rootScope',
    '$scope',
    'settings',
    'Utils',
    'AuthService',
    'Session',
    'EVENT_INFO',
    function($rootScope, $scope, Settings, Utils, AuthService, Session, EVENT_INFO){

      var settings = Settings.data;
      var user = $rootScope.currentUser;

      $scope.EVENT_INFO = EVENT_INFO;

      $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);

      $scope.logout = function(){
        AuthService.logout();
      };

      $scope.showSidebar = false;
      $scope.toggleSidebar = function(){
        $scope.showSidebar = !$scope.showSidebar;
      };

      // oh god jQuery hack
      $('.item').on('click', function(){
        $scope.showSidebar = false;
      });

    }]);

angular.module('reg')
  .controller('TeamCtrl', [
    '$scope',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TEAM',
    function($scope, currentUser, settings, Utils, UserService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;

      function _populateTeammates() {
        UserService
          .getMyTeammates()
          .success(function(users){
            $scope.error = null;
            $scope.teammates = users;
          });
      }

      if ($scope.user.teamCode){
        _populateTeammates();
      }

      $scope.joinTeam = function(){
        UserService
          .joinOrCreateTeam($scope.code)
          .success(function(user){
            $scope.error = null;
            $scope.user = user;
            _populateTeammates();
          })
          .error(function(res){
            $scope.error = res.message;
          });
      };

      $scope.leaveTeam = function(){
        UserService
          .leaveTeam()
          .success(function(user){
            $scope.error = null;
            $scope.user = user;
            $scope.teammates = [];
          })
          .error(function(res){
            $scope.error = res.data.message;
          });
      };

    }]);

angular.module('reg')
  .controller('VerifyCtrl', [
    '$scope',
    '$stateParams',
    'AuthService',
    function($scope, $stateParams, AuthService){
      var token = $stateParams.token;

      $scope.loading = true;

      if (token){
        AuthService.verify(token,
          function(user){
            $scope.success = true;

            $scope.loading = false;
          },
          function(err){

            $scope.loading = false;
          });
      }

    }]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4tdmlld3MvYWRtaW4vYWRtaW5DdHJsLmpzIiwiYWRtaW4tdmlld3MvdGVhbXMvdGVhbXNDdHJsLmpzIiwiYWRtaW4tdmlld3MvZ3VpZGUvZ3VpZGVDdHJsLmpzIiwiYWRtaW4tdmlld3MvYWRtaW4vc2V0dGluZ3MvYWRtaW5TZXR0aW5nc0N0cmwuanMiLCJhZG1pbi12aWV3cy9hZG1pbi9zdGF0cy9hZG1pblN0YXRzQ3RybC5qcyIsImFkbWluLXZpZXdzL2FkbWluL3VzZXIvYWRtaW5Vc2VyQ3RybC5qcyIsImFkbWluLXZpZXdzL2FkbWluL3VzZXJzL2FkbWluVXNlcnNDdHJsLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DdHJsLmpzIiwiY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbkN0cmwuanMiLCJkYXNoYm9hcmQvZGFzaGJvYXJkQ3RybC5qcyIsImxvZ2luL2xvZ2luQ3RybC5qcyIsInJlc2V0L3Jlc2V0Q3RybC5qcyIsInNpZGViYXIvc2lkZWJhckN0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIiwidmVyaWZ5L3ZlcmlmeUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBO0VBQ0E7OztBQUdBO0dBQ0EsT0FBQTtJQUNBO0lBQ0EsU0FBQSxjQUFBOzs7TUFHQSxjQUFBLGFBQUEsS0FBQTs7O0dBR0EsSUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLGFBQUEsUUFBQTs7O01BR0EsSUFBQSxR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QUEsTUFBQTtNQUNBLFFBQUEsYUFBQSxTQUFBLEtBQUE7TUFDQSxRQUFBLGFBQUEsY0FBQSxLQUFBLFVBQUE7TUFDQSxXQUFBLGNBQUE7OztJQUdBLEtBQUEsVUFBQSxTQUFBLFdBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxXQUFBLGNBQUE7TUFDQSxJQUFBLFdBQUE7UUFDQTs7OztJQUlBLEtBQUEsV0FBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsWUFBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsU0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLGNBQUEsS0FBQSxVQUFBO01BQ0EsV0FBQSxjQUFBOzs7O0FDckNBLFFBQUEsT0FBQTtHQUNBLFFBQUEsU0FBQTtJQUNBLFVBQUE7TUFDQSxPQUFBO1FBQ0EsV0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFlBQUEsS0FBQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxTQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQTs7UUFFQSxZQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLENBQUEsS0FBQTtZQUNBLE9BQUE7OztVQUdBLE9BQUEsSUFBQSxLQUFBOztVQUVBLE9BQUEsT0FBQSxNQUFBLE9BQUE7WUFDQSxNQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUE7Ozs7O0FDbkJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxHQUFBOztRQUVBLFFBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLEdBQUE7VUFDQSxHQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLGFBQUEsTUFBQSxHQUFBO1FBQ0EsT0FBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBO1VBQ0EsR0FBQTs7OztNQUlBLFlBQUEsb0JBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOztXQUVBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOzs7O01BSUEsWUFBQSxpQkFBQSxTQUFBLE9BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7O1dBRUEsUUFBQSxTQUFBLEtBQUE7WUFDQSxhQUFBLE1BQUE7O1dBRUEsTUFBQSxTQUFBLE1BQUEsV0FBQTtZQUNBLElBQUEsZUFBQSxJQUFBO2NBQ0EsUUFBQSxRQUFBOzs7OztNQUtBLFlBQUEsU0FBQSxTQUFBLFVBQUE7O1FBRUEsUUFBQSxRQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxZQUFBLFdBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsa0JBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTs7V0FFQSxRQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7V0FFQSxNQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7OztNQUlBLFlBQUEsU0FBQSxTQUFBLE9BQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLElBQUEsa0JBQUE7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLFFBQUEsUUFBQTtZQUNBLElBQUEsVUFBQTtjQUNBLFVBQUE7OztXQUdBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsSUFBQSxXQUFBO2NBQ0EsVUFBQTs7Ozs7TUFLQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUE7V0FDQSxNQUFBOzs7TUFHQSxPQUFBOzs7QUNuSEEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsZ0JBQUE7VUFDQSxNQUFBOzs7Ozs7OztBQzFDQSxRQUFBLE9BQUE7S0FDQSxRQUFBLGVBQUE7UUFDQTtRQUNBLFNBQUEsTUFBQTs7WUFFQSxJQUFBLE9BQUE7O1lBRUEsT0FBQTtnQkFDQSxVQUFBLFVBQUE7b0JBQ0EsT0FBQSxNQUFBLElBQUE7O2dCQUVBLFlBQUEsU0FBQSxLQUFBO29CQUNBLE9BQUEsTUFBQSxLQUFBLE1BQUEsQ0FBQSxNQUFBOztnQkFFQSxZQUFBLFVBQUEsUUFBQTs7Ozs7Ozs7QUNkQSxRQUFBLE9BQUE7R0FDQSxRQUFBLGVBQUE7RUFDQTtFQUNBO0VBQ0EsU0FBQSxPQUFBLFFBQUE7O0lBRUEsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQTs7Ozs7TUFLQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBOzs7TUFHQSxLQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLFFBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOzs7TUFHQSxTQUFBLFNBQUEsTUFBQSxNQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxRQUFBLE1BQUEsRUFBQTtVQUNBO1lBQ0EsTUFBQTtZQUNBLE1BQUEsT0FBQSxPQUFBO1lBQ0EsTUFBQSxPQUFBLE9BQUE7Ozs7O01BS0EsZUFBQSxTQUFBLElBQUEsUUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO1VBQ0EsU0FBQTs7OztNQUlBLG9CQUFBLFNBQUEsSUFBQSxhQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLFlBQUE7VUFDQSxjQUFBOzs7O01BSUEsa0JBQUEsU0FBQSxHQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7TUFNQSxrQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFFBQUEsY0FBQSxTQUFBO1VBQ0EsTUFBQTs7OztNQUlBLFdBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxPQUFBLE9BQUEsUUFBQSxjQUFBOzs7TUFHQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBLGNBQUE7Ozs7Ozs7TUFPQSxVQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7TUFHQSxXQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsU0FBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxP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LE9BQUEsV0FBQTtVQUNBLE9BQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsWUFBQSxDQUFBLEtBQUEsT0FBQSxXQUFBO1VBQ0EsT0FBQTs7OztNQUlBLFNBQUEsV0FBQSxLQUFBO1FBQ0EsT0FBQSxlQUFBO1FBQ0EsT0FBQSxhQUFBLFdBQUEsaUJBQUE7UUFDQSxFQUFBO1dBQ0EsTUFBQTs7O01BR0EsU0FBQSxpQkFBQSxLQUFBO1FBQ0EsT0FBQTtVQUNBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsV0FBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxXQUFBLEtBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGNBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFlBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7O1lBR0E7WUFDQSxNQUFBO1lBQ0EsUUFBQTtjQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxvQkFBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxzQkFBQSxLQUFBLE9BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxVQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsT0FBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBOzs7Ozs7O01BT0EsT0FBQSxhQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUEsVUFBQSxLQUFBLFFBQUEsc0JBQUEsTUFBQSxXQUFBLEtBQUEsT0FBQTs7Ozs7TUFLQSxJQUFBLFlBQUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7O01BR0EsSUFBQSxtQkFBQSxPQUFBLG1CQUFBLE1BQUEsUUFBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxZQUFBLFNBQUEsT0FBQTtRQUNBLElBQUEsT0FBQSxPQUFBO1FBQ0EsUUFBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUEsS0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxZQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQTtjQUNBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQTtjQUNBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUEsWUFBQSxLQUFBLE9BQUEsYUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQTs7UUFFQSxPQUFBOzs7TUFHQSxPQUFBLGVBQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLGNBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxLQUFBLFVBQUE7WUFDQSxXQUFBOzs7Ozs7OztNQVFBLElBQUEsWUFBQSxJQUFBLFNBQUE7TUFDQSxPQUFBLGlCQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsbUJBQUEsS0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQSxlQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTs7O01BR0EsT0FBQSxtQkFBQSxVQUFBOztRQUVBLEtBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxrQkFBQTtVQUNBLG9CQUFBO1VBQ0EsbUJBQUE7VUFDQSxnQkFBQTthQUNBLFVBQUE7O1lBRUE7ZUFDQSxpQkFBQSxLQUFBO2VBQ0EsUUFBQSxTQUFBLEtBQUE7Z0JBQ0EsV0FBQSxjQUFBO2dCQUNBLE9BQUEsT0FBQTs7Ozs7OztBQ3JHQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGFBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsT0FBQSxRQUFBLFVBQUEsT0FBQSxZQUFBOzs7TUFHQSxJQUFBLFdBQUEsU0FBQTtNQUNBLE9BQUEsWUFBQSxNQUFBLFVBQUE7OztNQUdBLE9BQUEsYUFBQTs7TUFFQSxTQUFBLFlBQUE7UUFDQSxPQUFBLEdBQUE7OztNQUdBLFNBQUEsUUFBQSxLQUFBO1FBQ0EsT0FBQSxRQUFBLEtBQUE7OztNQUdBLFNBQUEsWUFBQTtRQUNBLE9BQUEsUUFBQTs7O01BR0EsT0FBQSxRQUFBLFVBQUE7UUFDQTtRQUNBLFlBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxVQUFBLFdBQUE7OztNQUdBLE9BQUEsV0FBQSxVQUFBO1FBQ0E7UUFDQSxZQUFBO1VBQ0EsT0FBQSxPQUFBLE9BQUEsVUFBQSxXQUFBOzs7TUFHQSxPQUFBLGdCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsYUFBQTs7O01BR0EsT0FBQSxpQkFBQSxXQUFBO1FBQ0EsSUFBQSxRQUFBLE9BQUE7UUFDQSxZQUFBLGVBQUE7UUFDQSxXQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUE7VUFDQSxNQUFBO1VBQ0Esb0JBQUE7Ozs7Ozs7QUNwREEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsY0FBQSxRQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsYUFBQTs7TUFFQSxPQUFBLFVBQUE7O01BRUEsT0FBQSxpQkFBQSxVQUFBO1FBQ0EsSUFBQSxXQUFBLE9BQUE7UUFDQSxJQUFBLFVBQUEsT0FBQTs7UUFFQSxJQUFBLGFBQUEsUUFBQTtVQUNBLE9BQUEsUUFBQTtVQUNBLE9BQUEsVUFBQTtVQUNBOzs7UUFHQSxZQUFBO1VBQ0E7VUFDQSxPQUFBO1VBQ0EsU0FBQSxRQUFBO1lBQ0EsV0FBQTtjQUNBLE9BQUE7Y0FDQSxNQUFBO2NBQ0EsTUFBQTtjQUNBLG9CQUFBO2VBQ0EsVUFBQTtjQUNBLE9BQUEsR0FBQTs7O1VBR0EsU0FBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBLEtBQUE7WUFDQSxPQUFBLFVBQUE7Ozs7O0FDcENBLFFBQUEsT0FBQTtHQUNBLFdBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxZQUFBLFFBQUEsVUFBQSxPQUFBLGFBQUEsU0FBQSxXQUFBOztNQUVBLElBQUEsV0FBQSxTQUFBO01BQ0EsSUFBQSxPQUFBLFdBQUE7O01BRUEsT0FBQSxhQUFBOztNQUVBLE9BQUEsbUJBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLFNBQUEsVUFBQTtRQUNBLFlBQUE7OztNQUdBLE9BQUEsY0FBQTtNQUNBLE9BQUEsZ0JBQUEsVUFBQTtRQUNBLE9BQUEsY0FBQSxDQUFBLE9BQUE7Ozs7TUFJQSxFQUFBLFNBQUEsR0FBQSxTQUFBLFVBQUE7UUFDQSxPQUFBLGNBQUE7Ozs7O0FDN0JBLFFBQUEsT0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxhQUFBLFVBQUEsT0FBQSxhQUFBLEtBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7O01BRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7TUFFQSxPQUFBLE9BQUEsWUFBQTs7TUFFQSxPQUFBLE9BQUE7O01BRUEsU0FBQSxxQkFBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsWUFBQTs7OztNQUlBLElBQUEsT0FBQSxLQUFBLFNBQUE7UUFDQTs7O01BR0EsT0FBQSxXQUFBLFVBQUE7UUFDQTtXQUNBLGlCQUFBLE9BQUE7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsT0FBQTtZQUNBOztXQUVBLE1BQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxRQUFBLElBQUE7Ozs7TUFJQSxPQUFBLFlBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7V0FFQSxNQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsUUFBQSxJQUFBLEtBQUE7Ozs7OztBQ3JEQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGNBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsY0FBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLGFBQUE7O01BRUEsT0FBQSxVQUFBOztNQUVBLElBQUEsTUFBQTtRQUNBLFlBQUEsT0FBQTtVQUNBLFNBQUEsS0FBQTtZQUNBLE9BQUEsVUFBQTs7WUFFQSxPQUFBLFVBQUE7O1VBRUEsU0FBQSxJQUFBOztZQUVBLE9BQUEsVUFBQTs7OztRQUlBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgncmVnJywgW1xuICAndWkucm91dGVyJyxcbl0pO1xuXG5hcHBcbiAgLmNvbmZpZyhbXG4gICAgJyRodHRwUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xuXG4gICAgICAvLyBBZGQgYXV0aCB0b2tlbiB0byBBdXRob3JpemF0aW9uIGhlYWRlclxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XG5cbiAgICB9XSlcbiAgLnJ1bihbXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICAnU2Vzc2lvbicsXG4gICAgZnVuY3Rpb24oQXV0aFNlcnZpY2UsIFNlc3Npb24pe1xuXG4gICAgICAvLyBTdGFydHVwLCBsb2dpbiBpZiB0aGVyZSdzICBhIHRva2VuLlxuICAgICAgdmFyIHRva2VuID0gU2Vzc2lvbi5nZXRUb2tlbigpO1xuICAgICAgaWYgKHRva2VuKXtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW5XaXRoVG9rZW4odG9rZW4pO1xuICAgICAgfVxuXG4gIH1dKTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gICAgLmNvbnN0YW50KCdFVkVOVF9JTkZPJywge1xuICAgICAgICBOQU1FOiAnSGFja0FVIDIwMTcnLFxuICAgIH0pXG4gICAgLmNvbnN0YW50KCdEQVNIQk9BUkQnLCB7XG4gICAgICAgIFVOVkVSSUZJRUQ6ICdZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYW4gZW1haWwgYXNraW5nIHlvdSB2ZXJpZnkgeW91ciBlbWFpbC4gQ2xpY2sgdGhlIGxpbmsgaW4gdGhlIGVtYWlsIGFuZCB5b3UgY2FuIHN0YXJ0IHlvdXIgYXBwbGljYXRpb24hJyxcbiAgICAgICAgSU5DT01QTEVURV9USVRMRTogJ1lvdSBzdGlsbCBuZWVkIHRvIGNvbXBsZXRlIHlvdXIgYXBwbGljYXRpb24hJyxcbiAgICAgICAgSU5DT01QTEVURTogJ0lmIHlvdSBkbyBub3QgY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiBiZWZvcmUgdGhlIFtBUFBfREVBRExJTkVdLCB5b3Ugd2lsbCBub3QgYmUgY29uc2lkZXJlZCBmb3IgdGhlIGFkbWlzc2lvbnMgbG90dGVyeSEnLFxuICAgICAgICBTVUJNSVRURURfVElUTEU6ICdZb3VyIGFwcGxpY2F0aW9uIGhhcyBiZWVuIHN1Ym1pdHRlZCEnLFxuICAgICAgICBTVUJNSVRURUQ6ICdGZWVsIGZyZWUgdG8gZWRpdCBpdCBhdCBhbnkgdGltZS4gSG93ZXZlciwgb25jZSByZWdpc3RyYXRpb24gaXMgY2xvc2VkLCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBlZGl0IGl0IGFueSBmdXJ0aGVyLlxcbkFkbWlzc2lvbnMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5IGEgcmFuZG9tIGxvdHRlcnkuIFBsZWFzZSBtYWtlIHN1cmUgeW91ciBpbmZvcm1hdGlvbiBpcyBhY2N1cmF0ZSBiZWZvcmUgcmVnaXN0cmF0aW9uIGlzIGNsb3NlZCEnLFxuICAgICAgICBDTE9TRURfQU5EX0lOQ09NUExFVEVfVElUTEU6ICdVbmZvcnR1bmF0ZWx5LCByZWdpc3RyYXRpb24gaGFzIGNsb3NlZCwgYW5kIHRoZSBsb3R0ZXJ5IHByb2Nlc3MgaGFzIGJlZ3VuLicsXG4gICAgICAgIENMT1NFRF9BTkRfSU5DT01QTEVURTogJ0JlY2F1c2UgeW91IGhhdmUgbm90IGNvbXBsZXRlZCB5b3VyIHByb2ZpbGUgaW4gdGltZSwgeW91IHdpbGwgbm90IGJlIGVsaWdpYmxlIGZvciB0aGUgbG90dGVyeSBwcm9jZXNzLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5fQ09ORklSTV9USVRMRTogJ1lvdSBtdXN0IGNvbmZpcm0gYnkgW0NPTkZJUk1fREVBRExJTkVdLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTV9USVRMRTogJ1lvdXIgY29uZmlybWF0aW9uIGRlYWRsaW5lIG9mIFtDT05GSVJNX0RFQURMSU5FXSBoYXMgcGFzc2VkLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTTogJ0FsdGhvdWdoIHlvdSB3ZXJlIGFjY2VwdGVkLCB5b3UgZGlkIG5vdCBjb21wbGV0ZSB5b3VyIGNvbmZpcm1hdGlvbiBpbiB0aW1lLlxcblVuZm9ydHVuYXRlbHksIHRoaXMgbWVhbnMgdGhhdCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBhdHRlbmQgdGhlIGV2ZW50LCBhcyB3ZSBtdXN0IGJlZ2luIHRvIGFjY2VwdCBvdGhlciBhcHBsaWNhbnRzIG9uIHRoZSB3YWl0bGlzdC5cXG5XZSBob3BlIHRvIHNlZSB5b3UgYWdhaW4gbmV4dCB5ZWFyIScsXG4gICAgICAgIENPTkZJUk1FRF9OT1RfUEFTVF9USVRMRTogJ1lvdSBjYW4gZWRpdCB5b3VyIGNvbmZpcm1hdGlvbiBpbmZvcm1hdGlvbiB1bnRpbCBbQ09ORklSTV9ERUFETElORV0nLFxuICAgICAgICBERUNMSU5FRDogJ1dlXFwncmUgc29ycnkgdG8gaGVhciB0aGF0IHlvdSB3b25cXCd0IGJlIGFibGUgdG8gbWFrZSBpdCB0byBIYWNrTUlUIDIwMTUhIDooXFxuTWF5YmUgbmV4dCB5ZWFyISBXZSBob3BlIHlvdSBzZWUgeW91IGFnYWluIHNvb24uJyxcbiAgICB9KVxuICAgIC5jb25zdGFudCgnVEVBTScse1xuICAgICAgICBOT19URUFNX1JFR19DTE9TRUQ6ICdVbmZvcnR1bmF0ZWx5LCBpdFxcJ3MgdG9vIGxhdGUgdG8gZW50ZXIgdGhlIGxvdHRlcnkgd2l0aCBhIHRlYW0uXFxuSG93ZXZlciwgeW91IGNhbiBzdGlsbCBmb3JtIHRlYW1zIG9uIHlvdXIgb3duIGJlZm9yZSBvciBkdXJpbmcgdGhlIGV2ZW50IScsXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgICAuY29uZmlnKFtcbiAgICAgICAgJyRzdGF0ZVByb3ZpZGVyJyxcbiAgICAgICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgICAgICckbG9jYXRpb25Qcm92aWRlcicsXG4gICAgICAgIGZ1bmN0aW9uIChcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLFxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLFxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgLy8gRm9yIGFueSB1bm1hdGNoZWQgdXJsLCByZWRpcmVjdCB0byAvc3RhdGUxXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiLzQwNFwiKTtcblxuICAgICAgICAgICAgLy8gU2V0IHVwIGRlIHN0YXRlc1xuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2xvZ2luL2xvZ2luLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2Jhc2UuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAYXBwJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3NpZGViYXIvc2lkZWJhci5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZGViYXJDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTG9naW46IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL1wiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZEN0cmwnLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24gKFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5ndWlkZScsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9ndWlkZVwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi12aWV3cy9ndWlkZS9ndWlkZS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdHdWlkZUN0cmwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hcHBsaWNhdGlvbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcHBsaWNhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBcHBsaWNhdGlvbkN0cmwnLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24gKFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmNvbmZpcm1hdGlvbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9jb25maXJtYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb25maXJtYXRpb25DdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uIChVc2VyU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC50ZWFtJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlYW1cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGVhbS90ZWFtLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RlYW1DdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZVZlcmlmaWVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbiAoVXNlclNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAudGVhbXMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVhbXNcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvdGVhbXMvdGVhbXMuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVGVhbXNDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVxdWlyZVZlcmlmaWVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbiAoVXNlclNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYWRtaW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluLXZpZXdzL2FkbWluL2FkbWluLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5DdHJsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlQWRtaW46IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc3RhdHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYWRtaW5cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvYWRtaW4vc3RhdHMvc3RhdHMuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TdGF0c0N0cmwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hZG1pbi51c2VycycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycz9cIiArXG4gICAgICAgICAgICAgICAgICAgICcmcGFnZScgK1xuICAgICAgICAgICAgICAgICAgICAnJnNpemUnICtcbiAgICAgICAgICAgICAgICAgICAgJyZxdWVyeScsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluLXZpZXdzL2FkbWluL3VzZXJzL3VzZXJzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVXNlcnNDdHJsJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYWRtaW4udXNlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycy86aWRcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvYWRtaW4vdXNlci91c2VyLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVXNlckN0cmwnLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlcic6IGZ1bmN0aW9uICgkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zZXR0aW5ncycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hZG1pbi9zZXR0aW5nc1wiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi12aWV3cy9hZG1pbi9zZXR0aW5ncy9zZXR0aW5ncy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblNldHRpbmdzQ3RybCcsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3Jlc2V0Jywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3Jlc2V0Lzp0b2tlblwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9yZXNldC9yZXNldC5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXNldEN0cmwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgndmVyaWZ5Jywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3ZlcmlmeS86dG9rZW5cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdmVyaWZ5L3ZlcmlmeS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdWZXJpZnlDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJzQwNCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi80MDRcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvNDA0Lmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1dKVxuICAgIC5ydW4oW1xuICAgICAgICAnJHJvb3RTY29wZScsXG4gICAgICAgICckc3RhdGUnLFxuICAgICAgICAnU2Vzc2lvbicsXG4gICAgICAgIGZ1bmN0aW9uIChcbiAgICAgICAgICAgICRyb290U2NvcGUsXG4gICAgICAgICAgICAkc3RhdGUsXG4gICAgICAgICAgICBTZXNzaW9uKSB7XG5cbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcykge1xuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlTG9naW4gPSB0b1N0YXRlLmRhdGEucmVxdWlyZUxvZ2luO1xuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlQWRtaW4gPSB0b1N0YXRlLmRhdGEucmVxdWlyZUFkbWluO1xuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlVmVyaWZpZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZVZlcmlmaWVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVMb2dpbiAmJiAhU2Vzc2lvbi5nZXRUb2tlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZUFkbWluICYmICFTZXNzaW9uLmdldFVzZXIoKS5hZG1pbikge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZVZlcmlmaWVkICYmICFTZXNzaW9uLmdldFVzZXIoKS52ZXJpZmllZCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgW1xuICAgICdTZXNzaW9uJyxcbiAgICBmdW5jdGlvbihTZXNzaW9uKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24oY29uZmlnKXtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IFNlc3Npb24uZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIGlmICh0b2tlbil7XG4gICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddID0gdG9rZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5zZXJ2aWNlKCdTZXNzaW9uJywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHdpbmRvdycsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHdpbmRvdyl7XG5cbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKHRva2VuLCB1c2VyKXtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dCA9IHRva2VuO1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkID0gdXNlci5faWQ7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlciA9IEpTT04uc3RyaW5naWZ5KHVzZXIpO1xuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgfTtcblxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKG9uQ29tcGxldGUpe1xuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dDtcbiAgICAgIGRlbGV0ZSAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXI7XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcbiAgICAgIGlmIChvbkNvbXBsZXRlKXtcbiAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmdldFRva2VuID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3Q7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VXNlcklkID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlcik7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0VXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgIH07XG5cbiAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnVXRpbHMnLCBbXG4gICAgZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUmVnT3BlbjogZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gc2V0dGluZ3MudGltZU9wZW4gJiYgRGF0ZS5ub3coKSA8IHNldHRpbmdzLnRpbWVDbG9zZTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNBZnRlcjogZnVuY3Rpb24odGltZSl7XG4gICAgICAgICAgcmV0dXJuIERhdGUubm93KCkgPiB0aW1lO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbih0aW1lKXtcblxuICAgICAgICAgIGlmICghdGltZSl7XG4gICAgICAgICAgICByZXR1cm4gXCJJbnZhbGlkIERhdGVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXRlID0gbmV3IERhdGUodGltZSk7XG4gICAgICAgICAgLy8gSGFjayBmb3IgdGltZXpvbmVcbiAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXG4gICAgICAgICAgICBcIiBcIiArIGRhdGUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVsyXTtcblxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ0F1dGhTZXJ2aWNlJywgW1xuICAgICckaHR0cCcsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICckd2luZG93JyxcbiAgICAnU2Vzc2lvbicsXG4gICAgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUsICRzdGF0ZSwgJHdpbmRvdywgU2Vzc2lvbikge1xuICAgICAgdmFyIGF1dGhTZXJ2aWNlID0ge307XG5cbiAgICAgIGZ1bmN0aW9uIGxvZ2luU3VjY2VzcyhkYXRhLCBjYil7XG4gICAgICAgIC8vIFdpbm5lciB3aW5uZXIgeW91IGdldCBhIHRva2VuXG4gICAgICAgIFNlc3Npb24uY3JlYXRlKGRhdGEudG9rZW4sIGRhdGEudXNlcik7XG5cbiAgICAgICAgaWYgKGNiKXtcbiAgICAgICAgICBjYihkYXRhLnVzZXIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGxvZ2luRmFpbHVyZShkYXRhLCBjYil7XG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9sb2dpbicsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MoZGF0YSwgb25TdWNjZXNzKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGxvZ2luRmFpbHVyZShkYXRhLCBvbkZhaWx1cmUpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoVG9rZW4gPSBmdW5jdGlvbih0b2tlbiwgb25TdWNjZXNzLCBvbkZhaWx1cmUpe1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvbG9naW4nLCB7XG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgbG9naW5TdWNjZXNzKGRhdGEsIG9uU3VjY2Vzcyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzQ29kZSl7XG4gICAgICAgICAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAwKXtcbiAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGxvZ2luRmFpbHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5sb2dvdXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAvLyBDbGVhciB0aGUgc2Vzc2lvblxuICAgICAgICBTZXNzaW9uLmRlc3Ryb3koY2FsbGJhY2spO1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5yZWdpc3RlciA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3JlZ2lzdGVyJywge1xuICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhkYXRhLCBvblN1Y2Nlc3MpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgbG9naW5GYWlsdXJlKGRhdGEsIG9uRmFpbHVyZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS52ZXJpZnkgPSBmdW5jdGlvbih0b2tlbiwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLmdldCgnL2F1dGgvdmVyaWZ5LycgKyB0b2tlbilcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0VXNlcih1c2VyKTtcbiAgICAgICAgICAgIGlmIChvblN1Y2Nlc3Mpe1xuICAgICAgICAgICAgICBvblN1Y2Nlc3ModXNlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZiAob25GYWlsdXJlKSB7XG4gICAgICAgICAgICAgIG9uRmFpbHVyZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLnJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gZnVuY3Rpb24ob25TdWNjZXNzLCBvbkZhaWx1cmUpe1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvdmVyaWZ5L3Jlc2VuZCcsIHtcbiAgICAgICAgICAgIGlkOiBTZXNzaW9uLmdldFVzZXJJZCgpXG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbCA9IGZ1bmN0aW9uKGVtYWlsKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3Jlc2V0Jywge1xuICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5yZXNldFBhc3N3b3JkID0gZnVuY3Rpb24odG9rZW4sIHBhc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3Jlc2V0L3Bhc3N3b3JkJywge1xuICAgICAgICAgICAgdG9rZW46IHRva2VuLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3NcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdWNjZXNzKG9uU3VjY2VzcylcbiAgICAgICAgICAuZXJyb3Iob25GYWlsdXJlKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBhdXRoU2VydmljZTtcbiAgICB9XG4gIF0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnU2V0dGluZ3NTZXJ2aWNlJywgW1xuICAnJGh0dHAnLFxuICBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICB2YXIgYmFzZSA9ICcvYXBpL3NldHRpbmdzLyc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UHVibGljU2V0dGluZ3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlUmVnaXN0cmF0aW9uVGltZXM6IGZ1bmN0aW9uKG9wZW4sIGNsb3NlKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3RpbWVzJywge1xuICAgICAgICAgIHRpbWVPcGVuOiBvcGVuLFxuICAgICAgICAgIHRpbWVDbG9zZTogY2xvc2UsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnY29uZmlybS1ieScsIHtcbiAgICAgICAgICB0aW1lOiB0aW1lXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGdldFdoaXRlbGlzdGVkRW1haWxzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyAnd2hpdGVsaXN0Jyk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlV2hpdGVsaXN0ZWRFbWFpbHM6IGZ1bmN0aW9uKGVtYWlscyl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd3aGl0ZWxpc3QnLCB7XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHNcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlV2FpdGxpc3RUZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3dhaXRsaXN0Jywge1xuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlQWNjZXB0YW5jZVRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnYWNjZXB0YW5jZScsIHtcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnY29uZmlybWF0aW9uJywge1xuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICB9XG4gIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gICAgLmZhY3RvcnkoJ1RlYW1TZXJ2aWNlJywgW1xuICAgICAgICAnJGh0dHAnLFxuICAgICAgICBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICAgICAgICAgIHZhciBiYXNlID0gJy9hcGkvdGVhbXMvJztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRUZWFtczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRlYW06IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlLCB7dGVhbTogZGF0YX0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVsZXRlVGVhbTogZnVuY3Rpb24gKHRlYW1JZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImRlbGV0ZWQgXCIgKyB0ZWFtSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuICAgIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5mYWN0b3J5KCdVc2VyU2VydmljZScsIFtcbiAgJyRodHRwJyxcbiAgJ1Nlc3Npb24nLFxuICBmdW5jdGlvbigkaHR0cCwgU2Vzc2lvbil7XG5cbiAgICB2YXIgdXNlcnMgPSAnL2FwaS91c2Vycyc7XG4gICAgdmFyIGJhc2UgPSB1c2VycyArICcvJztcblxuICAgIHJldHVybiB7XG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEJhc2ljIEFjdGlvbnNcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGdldEN1cnJlbnRVc2VyOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldDogZnVuY3Rpb24oaWQpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XG4gICAgICB9LFxuXG4gICAgICBnZXRBbGw6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XG4gICAgICB9LFxuXG4gICAgICBnZXRQYWdlOiBmdW5jdGlvbihwYWdlLCBzaXplLCB0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCh1c2VycyArICc/JyArICQucGFyYW0oXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgIHBhZ2U6IHBhZ2UgPyBwYWdlIDogMCxcbiAgICAgICAgICAgIHNpemU6IHNpemUgPyBzaXplIDogNTBcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSxcblxuICAgICAgdXBkYXRlUHJvZmlsZTogZnVuY3Rpb24oaWQsIHByb2ZpbGUpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArICcvcHJvZmlsZScsIHtcbiAgICAgICAgICBwcm9maWxlOiBwcm9maWxlXG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uOiBmdW5jdGlvbihpZCwgY29uZmlybWF0aW9uKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyAnL2NvbmZpcm0nLCB7XG4gICAgICAgICAgY29uZmlybWF0aW9uOiBjb25maXJtYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBkZWNsaW5lQWRtaXNzaW9uOiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvZGVjbGluZScpO1xuICAgICAgfSxcblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBUZWFtXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGpvaW5PckNyZWF0ZVRlYW06IGZ1bmN0aW9uKGNvZGUpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy90ZWFtJywge1xuICAgICAgICAgIGNvZGU6IGNvZGVcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBsZWF2ZVRlYW06IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoYmFzZSArIFNlc3Npb24uZ2V0VXNlcklkKCkgKyAnL3RlYW0nKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldE15VGVhbW1hdGVzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy90ZWFtJyk7XG4gICAgICB9LFxuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBBZG1pbiBPbmx5XG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGdldFN0YXRzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyAnc3RhdHMnKTtcbiAgICAgIH0sXG5cbiAgICAgIGFkbWl0VXNlcjogZnVuY3Rpb24oaWQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyAnL2FkbWl0Jyk7XG4gICAgICB9LFxuXG4gICAgICBjaGVja0luOiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvY2hlY2tpbicpO1xuICAgICAgfSxcblxuICAgICAgY2hlY2tPdXQ6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgJy9jaGVja291dCcpO1xuICAgICAgfSxcblxuICAgICAgcmVtb3ZlVXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgJy9yZW1vdmUnKTtcbiAgICAgIH1cblxuICAgIH07XG4gIH1cbiAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FkbWluQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgVXNlclNlcnZpY2Upe1xuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgICAuY29udHJvbGxlcignVGVhbXNDdHJsJywgW1xuICAgICAgICAnJHNjb3BlJyxcbiAgICAgICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAgICAgJ3NldHRpbmdzJyxcbiAgICAgICAgJ1V0aWxzJyxcbiAgICAgICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICAgICAgJ1RlYW1TZXJ2aWNlJyxcbiAgICAgICAgJ1RFQU0nLFxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBVc2VyU2VydmljZSwgVGVhbVNlcnZpY2UsIFRFQU0pIHtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgY3VycmVudCB1c2VyJ3MgbW9zdCByZWNlbnQgZGF0YS5cbiAgICAgICAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG5cbiAgICAgICAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xuXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG5cbiAgICAgICAgICAgICRzY29wZS5URUFNID0gVEVBTTtcbiAgICAgICAgICAgICRzY29wZS50ZWFtcyA9IFtdO1xuXG5cbiAgICAgICAgICAgIFRlYW1TZXJ2aWNlLmdldFRlYW1zKClcbiAgICAgICAgICAgICAgICAuc3VjY2VzcyggdGVhbXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZWFtcyk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50ZWFtcyA9IHRlYW1zO1xuICAgICAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICRzY29wZS5kZWxldGVUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUudGVhbXMucmVtb3ZlKHRlYW0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkc2NvcGUuY3JlYXRlVGVhbSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLmNyZWF0ZVRlYW0oe3RpdGxlOiAkc2NvcGUudGVhbVRpdGxlLCBkZXNjcmlwdGlvbjogJHNjb3BlLnRlYW1EZXNjfSlcbiAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoICh7dGVhbX0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGVhbSBjcmVhdGVkOlwiLCB0ZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50ZWFtcy5wdXNoKHRlYW0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gICAgLmNvbnRyb2xsZXIoJ0d1aWRlQ3RybCcsIFtcbiAgICAgICAgJyRzY29wZScsXG4gICAgICAgIGZ1bmN0aW9uKCRzY29wZSkge1xuXG4gICAgICAgICAgICAvLyBBbmNob3Igc2Nyb2xsaW5nXG4gICAgICAgICAgICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzY3JvbGxGdW5jdGlvbigpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzY3JvbGxGdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPiAyMCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID4gMjApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUJ0blwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlCdG5cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215QnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgICAgfSwgXCJmYXN0XCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJ2FbaHJlZl49XCIjXCJdJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoJ1tuYW1lPVwiJyArICQuYXR0cih0aGlzLCAnaHJlZicpLnN1YnN0cigxKSArICdcIl0nKS5vZmZzZXQoKS50b3BcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFN0aWNreSBkYXRlIHNlY3Rpb25cbiAgICAgICAgICAgIC8vICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gICAgIHZhciBzdGlja3lfNF90b185X21vbnRocyA9ICQoXCIjbW9udGhzNDlcIikub2Zmc2V0KCk7XG4gICAgICAgICAgICAvLyAgICAgdmFyIHN0aWNreV80X21vbnRocyA9ICQoXCIjbW9udGhzNFwiKS5vZmZzZXQoKTtcbiAgICAgICAgICAgIC8vICAgICB2YXIgc3RpY2t5XzJfbW9udGhzID0gJChcIiNtb250aHMyXCIpLm9mZnNldCgpO1xuICAgICAgICAgICAgLy8gICAgIHZhciBzdGlja3lfMV9tb250aCA9ICQoXCIjbW9udGhcIikub2Zmc2V0KCk7XG4gICAgICAgICAgICAvLyAgICAgdmFyIHN0aWNreV8xX3dlZWsgPSAkKFwiI3dlZWtcIikub2Zmc2V0KCk7XG4gICAgICAgICAgICAvLyAgICAgdmFyIGRheV9vZl9ldmVudCA9ICQoXCIjZGF5b2ZldmVudFwiKS5vZmZzZXQoKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdmFyIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYgKHNjcm9sbCA8IHN0aWNreV80X3RvXzlfbW9udGhzLnRvcCkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoczQ5JykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoczQnKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGhzMicpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aCcpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyN3ZWVrJykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI2RheW9mZXZlbnQnKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSBpZiAoc3RpY2t5XzRfdG9fOV9tb250aHMudG9wIDw9IHNjcm9sbCAmJiBzY3JvbGwgPCBzdGlja3lfNF9tb250aHMudG9wKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGhzNDknKS5hZGRDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGhzNCcpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aHMyJykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoJykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI3dlZWsnKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjZGF5b2ZldmVudCcpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIGlmIChzdGlja3lfNF9tb250aHMudG9wIDw9IHNjcm9sbCAmJiBzY3JvbGwgPCBzdGlja3lfMl9tb250aHMudG9wKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGhzNDknKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGhzNCcpLmFkZENsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aHMyJykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoJykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI3dlZWsnKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjZGF5b2ZldmVudCcpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIGlmIChzdGlja3lfMl9tb250aHMudG9wIDw9IHNjcm9sbCAmJiBzY3JvbGwgPCBzdGlja3lfMV9tb250aC50b3ApIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aHM0OScpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aHM0JykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoczInKS5hZGRDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGgnKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjd2VlaycpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNkYXlvZmV2ZW50JykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICB9IGVsc2UgaWYgKHN0aWNreV8xX21vbnRoLnRvcCA8PSBzY3JvbGwgJiYgc2Nyb2xsIDwgc3RpY2t5XzFfd2Vlay50b3ApIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aHM0OScpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aHM0JykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoczInKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGgnKS5hZGRDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjd2VlaycpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNkYXlvZmV2ZW50JykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICB9IGVsc2UgaWYgKHN0aWNreV8xX3dlZWsudG9wIDw9IHNjcm9sbCAmJiBzY3JvbGwgPCBkYXlfb2ZfZXZlbnQudG9wKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGhzNDknKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGhzNCcpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aHMyJykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoJykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI3dlZWsnKS5hZGRDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjZGF5b2ZldmVudCcpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIGlmIChkYXlfb2ZfZXZlbnQudG9wIDw9IHNjcm9sbCkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoczQ5JykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI21vbnRoczQnKS5yZW1vdmVDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjbW9udGhzMicpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyNtb250aCcpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICQoJyN3ZWVrJykucmVtb3ZlQ2xhc3MoJ3N0aWNreScpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgJCgnI2RheW9mZXZlbnQnKS5hZGRDbGFzcygnc3RpY2t5Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAkKCcjZGF5b2ZldmVudCcpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIHN0aWNreUhlYWRlcnMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN0aWNraWVzO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBsb2FkID0gZnVuY3Rpb24oc3RpY2tpZXMpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzdGlja2llcyA9PT0gXCJvYmplY3RcIiAmJiBzdGlja2llcyBpbnN0YW5jZW9mIGpRdWVyeSAmJiBzdGlja2llcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0aWNraWVzID0gc3RpY2tpZXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzU3RpY2t5ID0gJCh0aGlzKS53cmFwKCc8ZGl2IGNsYXNzPVwiZm9sbG93V3JhcFwiIC8+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNTdGlja3lcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKCdvcmlnaW5hbFBvc2l0aW9uJywgJHRoaXNTdGlja3kub2Zmc2V0KCkudG9wKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoJ29yaWdpbmFsSGVpZ2h0JywgJHRoaXNTdGlja3kub3V0ZXJIZWlnaHQoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhlaWdodCgkdGhpc1N0aWNreS5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3aW5kb3cub2ZmKFwic2Nyb2xsLnN0aWNraWVzXCIpLm9uKFwic2Nyb2xsLnN0aWNraWVzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfd2hlblNjcm9sbGluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBfd2hlblNjcm9sbGluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHN0aWNraWVzLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkdGhpc1N0aWNreSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGlja3lQb3NpdGlvbiA9ICR0aGlzU3RpY2t5LmRhdGEoJ29yaWdpbmFsUG9zaXRpb24nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc3RpY2t5UG9zaXRpb24gPD0gJHdpbmRvdy5zY3JvbGxUb3AoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJG5leHRTdGlja3kgPSAkc3RpY2tpZXMuZXEoaSArIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJG5leHRTdGlja3lQb3NpdGlvbiA9ICRuZXh0U3RpY2t5LmRhdGEoJ29yaWdpbmFsUG9zaXRpb24nKSAtICR0aGlzU3RpY2t5LmRhdGEoJ29yaWdpbmFsSGVpZ2h0Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNTdGlja3kuYWRkQ2xhc3MoXCJmaXhlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJG5leHRTdGlja3kubGVuZ3RoID4gMCAmJiAkdGhpc1N0aWNreS5vZmZzZXQoKS50b3AgPj0gJG5leHRTdGlja3lQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNTdGlja3kuYWRkQ2xhc3MoXCJhYnNvbHV0ZVwiKS5jc3MoXCJ0b3BcIiwgJG5leHRTdGlja3lQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkcHJldlN0aWNreSA9ICRzdGlja2llcy5lcShpIC0gMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXNTdGlja3kucmVtb3ZlQ2xhc3MoXCJmaXhlZFwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHByZXZTdGlja3kubGVuZ3RoID4gMCAmJiAkd2luZG93LnNjcm9sbFRvcCgpIDw9ICR0aGlzU3RpY2t5LmRhdGEoJ29yaWdpbmFsUG9zaXRpb24nKSAtICR0aGlzU3RpY2t5LmRhdGEoJ29yaWdpbmFsSGVpZ2h0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwcmV2U3RpY2t5LnJlbW92ZUNsYXNzKFwiYWJzb2x1dGVcIikucmVtb3ZlQXR0cihcInN0eWxlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWQ6IGxvYWRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICAgICAgJChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RpY2t5SGVhZGVycy5sb2FkKCQoXCIuc3RpY2t5XCIpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG5cbiAgICAgICAgfVxuICAgIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pblNldHRpbmdzQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHNjZScsXG4gICAgJ1NldHRpbmdzU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc2NlLCBTZXR0aW5nc1NlcnZpY2Upe1xuXG4gICAgICAkc2NvcGUuc2V0dGluZ3MgPSB7fTtcbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAuZ2V0UHVibGljU2V0dGluZ3MoKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgICAgICAgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3Mpe1xuICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgLy8gRm9ybWF0IHRoZSBkYXRlcyBpbiBzZXR0aW5ncy5cbiAgICAgICAgc2V0dGluZ3MudGltZU9wZW4gPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lT3Blbik7XG4gICAgICAgIHNldHRpbmdzLnRpbWVDbG9zZSA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVDbG9zZSk7XG4gICAgICAgIHNldHRpbmdzLnRpbWVDb25maXJtID0gbmV3IERhdGUoc2V0dGluZ3MudGltZUNvbmZpcm0pO1xuXG4gICAgICAgICRzY29wZS5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgfVxuXG4gICAgICAvLyBXaGl0ZWxpc3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgIC5nZXRXaGl0ZWxpc3RlZEVtYWlscygpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGVtYWlscyl7XG4gICAgICAgICAgJHNjb3BlLndoaXRlbGlzdCA9IGVtYWlscy5qb2luKFwiLCBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUudXBkYXRlV2hpdGVsaXN0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVdoaXRlbGlzdGVkRW1haWxzKCRzY29wZS53aGl0ZWxpc3QucmVwbGFjZSgvIC9nLCAnJykuc3BsaXQoJywnKSlcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgICAgICAgICBzd2FsKCdXaGl0ZWxpc3QgdXBkYXRlZC4nKTtcbiAgICAgICAgICAgICRzY29wZS53aGl0ZWxpc3QgPSBzZXR0aW5ncy53aGl0ZWxpc3RlZEVtYWlscy5qb2luKFwiLCBcIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBSZWdpc3RyYXRpb24gVGltZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgJHNjb3BlLmZvcm1hdERhdGUgPSBmdW5jdGlvbihkYXRlKXtcbiAgICAgICAgaWYgKCFkYXRlKXtcbiAgICAgICAgICByZXR1cm4gXCJJbnZhbGlkIERhdGVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXG4gICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZm9ybWF0KCdkZGRkLCBNTU1NIERvIFlZWVksIGg6bW0gYScpICtcbiAgICAgICAgICBcIiBcIiArIGRhdGUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVsyXTtcbiAgICAgIH07XG5cbiAgICAgIC8vIFRha2UgYSBkYXRlIGFuZCByZW1vdmUgdGhlIHNlY29uZHMuXG4gICAgICBmdW5jdGlvbiBjbGVhbkRhdGUoZGF0ZSl7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShcbiAgICAgICAgICBkYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICAgICAgZGF0ZS5nZXRNb250aCgpLFxuICAgICAgICAgIGRhdGUuZ2V0RGF0ZSgpLFxuICAgICAgICAgIGRhdGUuZ2V0SG91cnMoKSxcbiAgICAgICAgICBkYXRlLmdldE1pbnV0ZXMoKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUudXBkYXRlUmVnaXN0cmF0aW9uVGltZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyBDbGVhbiB0aGUgZGF0ZXMgYW5kIHR1cm4gdGhlbSB0byBtcy5cbiAgICAgICAgdmFyIG9wZW4gPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVPcGVuKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciBjbG9zZSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZUNsb3NlKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgaWYgKG9wZW4gPCAwIHx8IGNsb3NlIDwgMCB8fCBvcGVuID09PSB1bmRlZmluZWQgfHwgY2xvc2UgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgcmV0dXJuIHN3YWwoJ09vcHMuLi4nLCAnWW91IG5lZWQgdG8gZW50ZXIgdmFsaWQgdGltZXMuJywgJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wZW4gPj0gY2xvc2Upe1xuICAgICAgICAgIHN3YWwoJ09vcHMuLi4nLCAnUmVnaXN0cmF0aW9uIGNhbm5vdCBvcGVuIGFmdGVyIGl0IGNsb3Nlcy4nLCAnZXJyb3InKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAudXBkYXRlUmVnaXN0cmF0aW9uVGltZXMob3BlbiwgY2xvc2UpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiUmVnaXN0cmF0aW9uIFRpbWVzIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgLy8gQ29uZmlybWF0aW9uIFRpbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgJHNjb3BlLnVwZGF0ZUNvbmZpcm1hdGlvblRpbWUgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY29uZmlybUJ5ID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lQ29uZmlybSkuZ2V0VGltZSgpO1xuXG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UaW1lKGNvbmZpcm1CeSlcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhzZXR0aW5ncyk7XG4gICAgICAgICAgICBzd2FsKFwiU291bmRzIGdvb2QhXCIsIFwiQ29uZmlybWF0aW9uIERhdGUgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAvLyBBY2NlcHRhbmNlIC8gQ29uZmlybWF0aW9uIFRleHQgLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xuXG4gICAgICAkc2NvcGUubWFya2Rvd25QcmV2aWV3ID0gZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbCh0ZXh0KSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudXBkYXRlV2FpdGxpc3RUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3Mud2FpdGxpc3RUZXh0O1xuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAudXBkYXRlV2FpdGxpc3RUZXh0KHRleHQpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJXYWl0bGlzdCBUZXh0IFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MoZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudXBkYXRlQWNjZXB0YW5jZVRleHQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdGV4dCA9ICRzY29wZS5zZXR0aW5ncy5hY2NlcHRhbmNlVGV4dDtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUFjY2VwdGFuY2VUZXh0KHRleHQpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJBY2NlcHRhbmNlIFRleHQgVXBkYXRlZFwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICB1cGRhdGVTZXR0aW5ncyhkYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuY29uZmlybWF0aW9uVGV4dDtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvblRleHQodGV4dClcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIkNvbmZpcm1hdGlvbiBUZXh0IFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MoZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignQWRtaW5TdGF0c0N0cmwnLFtcbiAgICAnJHNjb3BlJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgVXNlclNlcnZpY2Upe1xuXG4gICAgICBVc2VyU2VydmljZVxuICAgICAgICAuZ2V0U3RhdHMoKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihzdGF0cyl7XG4gICAgICAgICAgJHNjb3BlLnN0YXRzID0gc3RhdHM7XG4gICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICRzY29wZS5mcm9tTm93ID0gZnVuY3Rpb24oZGF0ZSl7XG4gICAgICAgIHJldHVybiBtb21lbnQoZGF0ZSkuZnJvbU5vdygpO1xuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FkbWluVXNlckN0cmwnLFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGh0dHAnLFxuICAgICd1c2VyJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIFVzZXIsIFVzZXJTZXJ2aWNlKXtcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSBVc2VyLmRhdGE7XG5cbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzY2hvb2wgZHJvcGRvd25cbiAgICAgIHBvcHVsYXRlU2Nob29scygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFRPRE86IEpBTksgV0FSTklOR1xuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVNjaG9vbHMoKXtcblxuICAgICAgICAkaHR0cFxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5qc29uJylcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS5zZWxlY3RlZFVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXTtcblxuICAgICAgICAgICAgaWYgKHNjaG9vbHNbZW1haWxdKXtcbiAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcbiAgICAgICAgICAgICAgJHNjb3BlLmF1dG9GaWxsZWRTY2hvb2wgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cblxuICAgICAgJHNjb3BlLnVwZGF0ZVByb2ZpbGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKCRzY29wZS5zZWxlY3RlZFVzZXIuX2lkLCAkc2NvcGUuc2VsZWN0ZWRVc2VyLnByb2ZpbGUpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAkc2VsZWN0ZWRVc2VyID0gZGF0YTtcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIlByb2ZpbGUgdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FkbWluVXNlcnNDdHJsJyxbXG4gICAgJyRzY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyRzdGF0ZVBhcmFtcycsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSl7XG5cbiAgICAgICRzY29wZS5wYWdlcyA9IFtdO1xuICAgICAgJHNjb3BlLnVzZXJzID0gW107XG5cbiAgICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxuICAgICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXG4gICAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxuICAgICAgLy8gdG8gcHJldmVudCB0aGlzLlxuICAgICAgJCgnLnVpLmRpbW1lcicpLnJlbW92ZSgpO1xuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0ge307XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh7c3RhdHVzOiAnJywgY29uZmlybWF0aW9uOiB7XG4gICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnM6IFtdXG4gICAgICB9LCBwcm9maWxlOiAnJ30pO1xuXG4gICAgICBmdW5jdGlvbiB1cGRhdGVQYWdlKGRhdGEpe1xuICAgICAgICAkc2NvcGUudXNlcnMgPSBkYXRhLnVzZXJzO1xuICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XG4gICAgICAgICRzY29wZS5wYWdlU2l6ZSA9IGRhdGEuc2l6ZTtcblxuICAgICAgICB2YXIgcCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEudG90YWxQYWdlczsgaSsrKXtcbiAgICAgICAgICBwLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLnBhZ2VzID0gcDtcbiAgICAgIH1cblxuICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc3RhdGVQYXJhbXMucXVlcnkpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIHVwZGF0ZVBhZ2UoZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKCdxdWVyeVRleHQnLCBmdW5jdGlvbihxdWVyeVRleHQpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgcXVlcnlUZXh0KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgdXBkYXRlUGFnZShkYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuZ29Ub1BhZ2UgPSBmdW5jdGlvbihwYWdlKXtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuYWRtaW4udXNlcnMnLCB7XG4gICAgICAgICAgcGFnZTogcGFnZSxcbiAgICAgICAgICBzaXplOiAkc3RhdGVQYXJhbXMuc2l6ZSB8fCA1MFxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5nb1VzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIpe1xuICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuYWRtaW4udXNlcicsIHtcbiAgICAgICAgICBpZDogdXNlci5faWRcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudG9nZ2xlQ2hlY2tJbiA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGlmICghdXNlci5zdGF0dXMuY2hlY2tlZEluKXtcbiAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2hlY2sgaW4gXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgY2hlY2sgdGhlbSBpbi5cIixcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmNoZWNrSW4odXNlci5faWQpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gdXNlcjtcbiAgICAgICAgICAgICAgICAgIHN3YWwoXCJDaGVja2VkIGluXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBoYXMgYmVlbiBjaGVja2VkIGluLicsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBzd2FsKFwiTm90IGNoZWNrZWQgaW5cIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBjaGVja2VkIGluLiAnLCBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgICAgLmNoZWNrT3V0KHVzZXIuX2lkKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSB1c2VyO1xuICAgICAgICAgICAgICBzd2FsKFwiQ2hlY2tlZCBvdXRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGhhcyBiZWVuIGNoZWNrZWQgb3V0LicsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIk5vdCBjaGVja2VkIG91dFwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgY291bGQgbm90IGJlIGNoZWNrZWQgb3V0LiAnLCBcImVycm9yXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5hY2NlcHRVc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xuICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgLy8gaWYgKCF1c2VyLnN0YXR1cy5hZG1pdHRlZCl7XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGFjY2VwdCBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgYWNjZXB0IHRoZW0uXCIsXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIGFjY2VwdGVkIHRoaXMgdXNlci4gXCIgK1xuICAgICAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGFjY2VwdCB0aGlzIHVzZXIuXCIsXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgICAgIC5hZG1pdFVzZXIodXNlci5faWQpXG4gICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHVzZXI7XG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJBY2NlcHRlZFwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgaGFzIGJlZW4gYWRtaXR0ZWQuJywgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBzd2FsKFwiTm90IGFkbWl0dGVkXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBjb3VsZCBub3QgYmUgYWRtaXR0ZWQuICcsIFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAvLyAgICAgLy8gdW5hZG1pdCB1c2VyXG4gICAgICAgICAgICAgIFxuICAgICAgICAgIC8vIH1cblxuICAgICAgfTtcblxuICAgICAgLy8gZGVsZXRlIFVzZXIgZnJvbSByZWNvcmRzXG4gICAgICAkc2NvcGUucmVtb3ZlVXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGRlbGV0ZSBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgZGVsZXRlIHVzZXIuXCIsXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIGRlbGV0ZWQgdGhpcyB1c2VyLiBcIiArXG4gICAgICAgICAgICAgICAgXCJSZW1lbWJlciwgdGhpcyBwb3dlciBpcyBhIHByaXZpbGVnZS5cIixcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgZGVsZXRlIHRoaXMgdXNlci5cIixcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgICAgICAgICAgLnJlbW92ZVVzZXIodXNlci5faWQpXG4gICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJzLnNwbGljZShpbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIkRlbGV0ZWRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGhhcyBiZWVuIGRlbGV0ZWQuJywgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBzd2FsKFwiTm90IGRlbGV0ZWRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBkZWxldGVkLiAnLCBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9KTtcblxuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gZm9ybWF0VGltZSh0aW1lKXtcbiAgICAgICAgaWYgKHRpbWUpIHtcbiAgICAgICAgICByZXR1cm4gbW9tZW50KHRpbWUpLmZvcm1hdCgnTU1NTSBEbyBZWVlZLCBoOm1tOnNzIGEnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgIGlmICh1c2VyLmFkbWluKXtcbiAgICAgICAgICByZXR1cm4gJ2FkbWluJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodXNlci5zdGF0dXMuY29uZmlybWVkKSB7XG4gICAgICAgICAgcmV0dXJuICdwb3NpdGl2ZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmICF1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcbiAgICAgICAgICByZXR1cm4gJ3dhcm5pbmcnO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBzZWxlY3RVc2VyKHVzZXIpe1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnModXNlcik7XG4gICAgICAgICQoJy5sb25nLnVzZXIubW9kYWwnKVxuICAgICAgICAgIC5tb2RhbCgnc2hvdycpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpe1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdCYXNpYyBJbmZvJyxcbiAgICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NyZWF0ZWQgT24nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIudGltZXN0YW1wKVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTGFzdCBVcGRhdGVkJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLmxhc3RVcGRhdGVkKVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQ29uZmlybSBCeScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSB8fCAnTi9BJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQ2hlY2tlZCBJbicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpIHx8ICdOL0EnXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdFbWFpbCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuZW1haWxcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1RlYW0nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnRlYW1Db2RlIHx8ICdOb25lJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBuYW1lOiAnUHJvZmlsZScsXG4gICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm5hbWVcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0dlbmRlcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1NjaG9vbCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5zY2hvb2xcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0dyYWR1YXRpb24gWWVhcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ncmFkdWF0aW9uWWVhclxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnRGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0Vzc2F5JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmVzc2F5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIG5hbWU6ICdDb25maXJtYXRpb24nLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnUGhvbmUgTnVtYmVyJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ucGhvbmVOdW1iZXJcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0RpZXRhcnkgUmVzdHJpY3Rpb25zJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucy5qb2luKCcsICcpXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdTaGlydCBTaXplJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uc2hpcnRTaXplXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdNYWpvcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm1ham9yXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHaXRodWInLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5naXRodWJcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1dlYnNpdGUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi53ZWJzaXRlXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBIYXJkd2FyZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5lZWRzSGFyZHdhcmUsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdIYXJkd2FyZSBSZXF1ZXN0ZWQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5oYXJkd2FyZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBuYW1lOiAnSG9zdGluZycsXG4gICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBIb3N0aW5nIEZyaWRheScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhvc3ROZWVkZWRGcmksXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBIb3N0aW5nIFNhdHVyZGF5JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaG9zdE5lZWRlZFNhdCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0dlbmRlciBOZXV0cmFsJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uZ2VuZGVyTmV1dHJhbCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NhdCBGcmllbmRseScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmNhdEZyaWVuZGx5LFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnU21va2luZyBGcmllbmRseScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnNtb2tpbmdGcmllbmRseSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0hvc3RpbmcgTm90ZXMnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ob3N0Tm90ZXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgbmFtZTogJ1RyYXZlbCcsXG4gICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBSZWltYnVyc2VtZW50JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ubmVlZHNSZWltYnVyc2VtZW50LFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnUmVjZWl2ZWQgUmVpbWJ1cnNlbWVudCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5lZWRzUmVpbWJ1cnNlbWVudCAmJiB1c2VyLnN0YXR1cy5yZWltYnVyc2VtZW50R2l2ZW5cbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0FkZHJlc3MnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzID8gW1xuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5saW5lMSxcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3MubGluZTIsXG4gICAgICAgICAgICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzLmNpdHksXG4gICAgICAgICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzLnN0YXRlLFxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy56aXAsXG4gICAgICAgICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzLmNvdW50cnksXG4gICAgICAgICAgICAgICAgXS5qb2luKCcgJykgOiAnJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQWRkaXRpb25hbCBOb3RlcycsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5vdGVzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5zZWxlY3RVc2VyID0gc2VsZWN0VXNlcjtcblxuICAgIH1dKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBcHBsaWNhdGlvbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICckaHR0cCcsXG4gICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdTZXNzaW9uJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkaHR0cCwgY3VycmVudFVzZXIsIFNldHRpbmdzLCBTZXNzaW9uLCBVc2VyU2VydmljZSl7XG5cbiAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuXG4gICAgICAvLyBJcyB0aGUgc3R1ZGVudCBmcm9tIE1JVD9cbiAgICAgICRzY29wZS5pc01pdFN0dWRlbnQgPSAkc2NvcGUudXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdID09ICdtaXQuZWR1JztcblxuICAgICAgLy8gSWYgc28sIGRlZmF1bHQgdGhlbSB0byBhZHVsdDogdHJ1ZVxuICAgICAgaWYgKCRzY29wZS5pc01pdFN0dWRlbnQpe1xuICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLmFkdWx0ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNjaG9vbCBkcm9wZG93blxuICAgICAgcG9wdWxhdGVTY2hvb2xzKCk7XG4gICAgICBfc2V0dXBGb3JtKCk7XG5cbiAgICAgICRzY29wZS5yZWdJc0Nsb3NlZCA9IERhdGUubm93KCkgPiBTZXR0aW5ncy5kYXRhLnRpbWVDbG9zZTtcblxuICAgICAgLyoqXG4gICAgICAgKiBUT0RPOiBKQU5LIFdBUk5JTkdcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVTY2hvb2xzKCl7XG5cbiAgICAgICAgJGh0dHBcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuanNvbicpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHZhciBzY2hvb2xzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUudXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdO1xuXG4gICAgICAgICAgICBpZiAoc2Nob29sc1tlbWFpbF0pe1xuICAgICAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcbiAgICAgICAgICAgICAgJHNjb3BlLmF1dG9GaWxsZWRTY2hvb2wgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdXBkYXRlVXNlcihlKXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlUHJvZmlsZShTZXNzaW9uLmdldFVzZXJJZCgpLCAkc2NvcGUudXNlci5wcm9maWxlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dlZXRBbGVydCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkF3ZXNvbWUhXCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBhcHBsaWNhdGlvbiBoYXMgYmVlbiBzYXZlZC5cIixcbiAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjZTc2NDgyXCJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3NldHVwRm9ybSgpe1xuICAgICAgICAvLyBTZW1hbnRpYy1VSSBmb3JtIHZhbGlkYXRpb25cbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hbWUnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzY2hvb2w6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NjaG9vbCcsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHNjaG9vbCBuYW1lLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5ZWFyOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd5ZWFyJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCB5b3VyIGdyYWR1YXRpb24geWVhci4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2VuZGVyOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdnZW5kZXInLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IGEgZ2VuZGVyLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZHVsdDoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnYWR1bHQnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaGVja2VkJyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1lvdSBtdXN0IGJlIGFuIGFkdWx0LCBvciBhbiBNSVQgc3R1ZGVudC4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuXG5cbiAgICAgICRzY29wZS5zdWJtaXRGb3JtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSl7XG4gICAgICAgICAgX3VwZGF0ZVVzZXIoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0NvbmZpcm1hdGlvbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICdjdXJyZW50VXNlcicsXG4gICAgJ1V0aWxzJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBjdXJyZW50VXNlciwgVXRpbHMsIFVzZXJTZXJ2aWNlKXtcblxuICAgICAgLy8gU2V0IHVwIHRoZSB1c2VyXG4gICAgICB2YXIgdXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG4gICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG5cbiAgICAgICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gRGF0ZS5ub3coKSA+IHVzZXIuc3RhdHVzLmNvbmZpcm1CeTtcblxuICAgICAgJHNjb3BlLmZvcm1hdFRpbWUgPSBVdGlscy5mb3JtYXRUaW1lO1xuXG4gICAgICBfc2V0dXBGb3JtKCk7XG5cbiAgICAgICRzY29wZS5maWxlTmFtZSA9IHVzZXIuX2lkICsgXCJfXCIgKyB1c2VyLnByb2ZpbGUubmFtZS5zcGxpdChcIiBcIikuam9pbihcIl9cIik7XG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEFsbCB0aGlzIGp1c3QgZm9yIGRpZXRhcnkgcmVzdHJpY3Rpb24gY2hlY2tib3hlcyBmbWxcblxuICAgICAgdmFyIGRpZXRhcnlSZXN0cmljdGlvbnMgPSB7XG4gICAgICAgICdWZWdldGFyaWFuJzogZmFsc2UsXG4gICAgICAgICdWZWdhbic6IGZhbHNlLFxuICAgICAgICAnSGFsYWwnOiBmYWxzZSxcbiAgICAgICAgJ0tvc2hlcic6IGZhbHNlLFxuICAgICAgICAnTnV0IEFsbGVyZ3knOiBmYWxzZVxuICAgICAgfTtcblxuICAgICAgaWYgKHVzZXIuY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMpe1xuICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zLmZvckVhY2goZnVuY3Rpb24ocmVzdHJpY3Rpb24pe1xuICAgICAgICAgIGlmIChyZXN0cmljdGlvbiBpbiBkaWV0YXJ5UmVzdHJpY3Rpb25zKXtcbiAgICAgICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnNbcmVzdHJpY3Rpb25dID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9ucyA9IGRpZXRhcnlSZXN0cmljdGlvbnM7XG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgZnVuY3Rpb24gX3VwZGF0ZVVzZXIoZSl7XG4gICAgICAgIHZhciBjb25maXJtYXRpb24gPSAkc2NvcGUudXNlci5jb25maXJtYXRpb247XG4gICAgICAgIC8vIEdldCB0aGUgZGlldGFyeSByZXN0cmljdGlvbnMgYXMgYW4gYXJyYXlcbiAgICAgICAgdmFyIGRycyA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cygkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXkpe1xuICAgICAgICAgIGlmICgkc2NvcGUuZGlldGFyeVJlc3RyaWN0aW9uc1trZXldKXtcbiAgICAgICAgICAgIGRycy5wdXNoKGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMgPSBkcnM7XG5cbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uKHVzZXIuX2lkLCBjb25maXJtYXRpb24pXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzd2VldEFsZXJ0KHtcbiAgICAgICAgICAgICAgdGl0bGU6IFwiV29vIVwiLFxuICAgICAgICAgICAgICB0ZXh0OiBcIllvdSdyZSBjb25maXJtZWQhXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI2U3NjQ4MlwiXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICBzd2VldEFsZXJ0KFwiVWggb2ghXCIsIFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIsIFwiZXJyb3JcIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF9zZXR1cEZvcm0oKXtcbiAgICAgICAgLy8gU2VtYW50aWMtVUkgZm9ybSB2YWxpZGF0aW9uXG4gICAgICAgICQoJy51aS5mb3JtJykuZm9ybSh7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzaGlydDoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2hpcnQnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZ2l2ZSB1cyBhIHNoaXJ0IHNpemUhJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBob25lOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdwaG9uZScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciBhIHBob25lIG51bWJlci4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmF0dXJlTGlhYmlsaXR5OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVMaWFiaWxpdHlXYWl2ZXInLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIGRpZ2l0YWwgc2lnbmF0dXJlLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWduYXR1cmVQaG90b1JlbGVhc2U6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NpZ25hdHVyZVBob3RvUmVsZWFzZScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0eXBlIHlvdXIgZGlnaXRhbCBzaWduYXR1cmUuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpZ25hdHVyZUNvZGVPZkNvbmR1Y3Q6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NpZ25hdHVyZUNvZGVPZkNvbmR1Y3QnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIGRpZ2l0YWwgc2lnbmF0dXJlLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnN1Ym1pdEZvcm0gPSBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCgnLnVpLmZvcm0nKS5mb3JtKCdpcyB2YWxpZCcpKXtcbiAgICAgICAgICBfdXBkYXRlVXNlcigpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignRGFzaGJvYXJkQ3RybCcsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzY29wZScsXG4gICAgJyRzY2UnLFxuICAgICdjdXJyZW50VXNlcicsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnVXRpbHMnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgJ0RBU0hCT0FSRCcsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkc2NlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgVXNlclNlcnZpY2UsIERBU0hCT0FSRCl7XG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuXG4gICAgICAkc2NvcGUuREFTSEJPQVJEID0gREFTSEJPQVJEO1xuICAgICAgXG4gICAgICBmb3IgKHZhciBtc2cgaW4gJHNjb3BlLkRBU0hCT0FSRCkge1xuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQVBQX0RFQURMSU5FXScpKSB7XG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tBUFBfREVBRExJTkVdJywgVXRpbHMuZm9ybWF0VGltZShTZXR0aW5ncy50aW1lQ2xvc2UpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJHNjb3BlLkRBU0hCT0FSRFttc2ddLmluY2x1ZGVzKCdbQ09ORklSTV9ERUFETElORV0nKSkge1xuICAgICAgICAgICRzY29wZS5EQVNIQk9BUkRbbXNnXSA9ICRzY29wZS5EQVNIQk9BUkRbbXNnXS5yZXBsYWNlKCdbQ09ORklSTV9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElzIHJlZ2lzdHJhdGlvbiBvcGVuP1xuICAgICAgdmFyIHJlZ0lzT3BlbiA9ICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xuXG4gICAgICAvLyBJcyBpdCBwYXN0IHRoZSB1c2VyJ3MgY29uZmlybWF0aW9uIHRpbWU/XG4gICAgICB2YXIgcGFzdENvbmZpcm1hdGlvbiA9ICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gVXRpbHMuaXNBZnRlcih1c2VyLnN0YXR1cy5jb25maXJtQnkpO1xuXG4gICAgICAkc2NvcGUuZGFzaFN0YXRlID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgICAgICAgdmFyIHVzZXIgPSAkc2NvcGUudXNlcjtcbiAgICAgICAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICAgICAgICBjYXNlICd1bnZlcmlmaWVkJzpcbiAgICAgICAgICAgIHJldHVybiAhdXNlci52ZXJpZmllZDtcbiAgICAgICAgICBjYXNlICdvcGVuQW5kSW5jb21wbGV0ZSc6XG4gICAgICAgICAgICByZXR1cm4gcmVnSXNPcGVuICYmIHVzZXIudmVyaWZpZWQgJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGU7XG4gICAgICAgICAgY2FzZSAnb3BlbkFuZFN1Ym1pdHRlZCc6XG4gICAgICAgICAgICByZXR1cm4gcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuICAgICAgICAgIGNhc2UgJ2Nsb3NlZEFuZEluY29tcGxldGUnOlxuICAgICAgICAgICAgcmV0dXJuICFyZWdJc09wZW4gJiYgIXVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuICAgICAgICAgIGNhc2UgJ2Nsb3NlZEFuZFN1Ym1pdHRlZCc6IC8vIFdhaXRsaXN0ZWQgU3RhdGVcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2FuQ29uZmlybSc6XG4gICAgICAgICAgICByZXR1cm4gIXBhc3RDb25maXJtYXRpb24gJiZcbiAgICAgICAgICAgICAgdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiZcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJlxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XG4gICAgICAgICAgY2FzZSAnYWRtaXR0ZWRBbmRDYW5ub3RDb25maXJtJzpcbiAgICAgICAgICAgIHJldHVybiBwYXN0Q29uZmlybWF0aW9uICYmXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICAgIGNhc2UgJ2NvbmZpcm1lZCc6XG4gICAgICAgICAgICByZXR1cm4gdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiYgdXNlci5zdGF0dXMuY29uZmlybWVkICYmICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcbiAgICAgICAgICBjYXNlICdkZWNsaW5lZCc6XG4gICAgICAgICAgICByZXR1cm4gdXNlci5zdGF0dXMuZGVjbGluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNob3dXYWl0bGlzdCA9ICFyZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XG5cbiAgICAgICRzY29wZS5yZXNlbmRFbWFpbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIEF1dGhTZXJ2aWNlXG4gICAgICAgICAgLnJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsKClcbiAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgc3dlZXRBbGVydCgnWW91ciBlbWFpbCBoYXMgYmVlbiBzZW50LicpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gVGV4dCFcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICB2YXIgY29udmVydGVyID0gbmV3IHNob3dkb3duLkNvbnZlcnRlcigpO1xuICAgICAgJHNjb3BlLmFjY2VwdGFuY2VUZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3MuYWNjZXB0YW5jZVRleHQpKTtcbiAgICAgICRzY29wZS5jb25maXJtYXRpb25UZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3MuY29uZmlybWF0aW9uVGV4dCkpO1xuICAgICAgJHNjb3BlLndhaXRsaXN0VGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLndhaXRsaXN0VGV4dCkpO1xuXG5cbiAgICAgICRzY29wZS5kZWNsaW5lQWRtaXNzaW9uID0gZnVuY3Rpb24oKXtcblxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hIVwiLFxuICAgICAgICAgIHRleHQ6IFwiQXJlIHlvdSBzdXJlIHlvdSB3b3VsZCBsaWtlIHRvIGRlY2xpbmUgeW91ciBhZG1pc3Npb24/IFxcblxcbiBZb3UgY2FuJ3QgZ28gYmFjayFcIixcbiAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXG4gICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBJIGNhbid0IG1ha2UgaXQuXCIsXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IHRydWVcbiAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgICAgICAuZGVjbGluZUFkbWlzc2lvbih1c2VyLl9pZClcbiAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdVdGlscycsXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGUsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2Upe1xuXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgLy8gU3RhcnQgc3RhdGUgZm9yIGxvZ2luXG4gICAgICAkc2NvcGUubG9naW5TdGF0ZSA9ICdsb2dpbic7XG5cbiAgICAgIGZ1bmN0aW9uIG9uU3VjY2VzcygpIHtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoZGF0YSl7XG4gICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVzZXRFcnJvcigpe1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuICAgICAgICByZXNldEVycm9yKCk7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkKFxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRFcnJvcigpO1xuICAgICAgICBBdXRoU2VydmljZS5yZWdpc3RlcihcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zZXRMb2dpblN0YXRlID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSBzdGF0ZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zZW5kUmVzZXRFbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuZW1haWw7XG4gICAgICAgIEF1dGhTZXJ2aWNlLnNlbmRSZXNldEVtYWlsKGVtYWlsKTtcbiAgICAgICAgc3dlZXRBbGVydCh7XG4gICAgICAgICAgdGl0bGU6IFwiRG9uJ3QgU3dlYXQhXCIsXG4gICAgICAgICAgdGV4dDogXCJBbiBlbWFpbCBzaG91bGQgYmUgc2VudCB0byB5b3Ugc2hvcnRseS5cIixcbiAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI2U3NjQ4MlwiXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1cbiAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0Q3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHN0YXRlUGFyYW1zJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcbiAgICAgIHZhciB0b2tlbiA9ICRzdGF0ZVBhcmFtcy50b2tlbjtcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUuY2hhbmdlUGFzc3dvcmQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcGFzc3dvcmQgPSAkc2NvcGUucGFzc3dvcmQ7XG4gICAgICAgIHZhciBjb25maXJtID0gJHNjb3BlLmNvbmZpcm07XG5cbiAgICAgICAgaWYgKHBhc3N3b3JkICE9PSBjb25maXJtKXtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlBhc3N3b3JkcyBkb24ndCBtYXRjaCFcIjtcbiAgICAgICAgICAkc2NvcGUuY29uZmlybSA9IFwiXCI7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgQXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZChcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAkc2NvcGUucGFzc3dvcmQsXG4gICAgICAgICAgZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICBzd2VldEFsZXJ0KHtcbiAgICAgICAgICAgICAgdGl0bGU6IFwiTmVhdG8hXCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBwYXNzd29yZCBoYXMgYmVlbiBjaGFuZ2VkIVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNlNzY0ODJcIlxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc2NvcGUnLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdTZXNzaW9uJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCBTZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBTZXNzaW9uLCBFVkVOVF9JTkZPKXtcblxuICAgICAgdmFyIHNldHRpbmdzID0gU2V0dGluZ3MuZGF0YTtcbiAgICAgIHZhciB1c2VyID0gJHJvb3RTY29wZS5jdXJyZW50VXNlcjtcblxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xuXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcblxuICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gZmFsc2U7XG4gICAgICAkc2NvcGUudG9nZ2xlU2lkZWJhciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5zaG93U2lkZWJhciA9ICEkc2NvcGUuc2hvd1NpZGViYXI7XG4gICAgICB9O1xuXG4gICAgICAvLyBvaCBnb2QgalF1ZXJ5IGhhY2tcbiAgICAgICQoJy5pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignVGVhbUN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdVdGlscycsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICAnVEVBTScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBVc2VyU2VydmljZSwgVEVBTSl7XG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuXG4gICAgICAkc2NvcGUuVEVBTSA9IFRFQU07XG5cbiAgICAgIGZ1bmN0aW9uIF9wb3B1bGF0ZVRlYW1tYXRlcygpIHtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAuZ2V0TXlUZWFtbWF0ZXMoKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXJzKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAgICAgICAkc2NvcGUudGVhbW1hdGVzID0gdXNlcnM7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgkc2NvcGUudXNlci50ZWFtQ29kZSl7XG4gICAgICAgIF9wb3B1bGF0ZVRlYW1tYXRlcygpO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuam9pblRlYW0gPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5qb2luT3JDcmVhdGVUZWFtKCRzY29wZS5jb2RlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgIF9wb3B1bGF0ZVRlYW1tYXRlcygpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXMubWVzc2FnZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5sZWF2ZVRlYW0gPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5sZWF2ZVRlYW0oKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICRzY29wZS50ZWFtbWF0ZXMgPSBbXTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzLmRhdGEubWVzc2FnZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1ZlcmlmeUN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzdGF0ZVBhcmFtcycsXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQXV0aFNlcnZpY2Upe1xuICAgICAgdmFyIHRva2VuID0gJHN0YXRlUGFyYW1zLnRva2VuO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgIGlmICh0b2tlbil7XG4gICAgICAgIEF1dGhTZXJ2aWNlLnZlcmlmeSh0b2tlbixcbiAgICAgICAgICBmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcblxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uKGVycil7XG5cbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9XSk7Il19
