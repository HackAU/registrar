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
        DECLINED: 'We\'re sorry to hear that you won\'t be able to make it to HackAU 2018! :(\nMaybe next year! We hope you see you again soon.',
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

            var base = '/api/teams';

            return {
                getTeams: function(){
                    return $http.get(base);
                },
                createTeam: function(data){
                    return $http.post(base, {team: data});
                },
                updateTeam: function(teamId, data){
                    return $http.put(base + "/" + teamId, {team: data});
                },
                deleteTeam: function (teamId) {
                    return $http.delete(base + "/" + teamId);
                }
            };

        }
    ]);

angular.module('reg')
  .factory('UserService', [
      '$http',
      'Session',
      function ($http, Session) {

          var users = '/api/users';
          var base = users + '/';

          return {

              // ----------------------
              // Basic Actions
              // ----------------------
              getCurrentUser: function () {
                  return $http.get(base + Session.getUserId());
              },

              get: function (id) {
                  return $http.get(base + id);
              },

              getAll: function () {
                  return $http.get(base);
              },

              getPage: function (page, size, text) {
                  return $http.get(users + '?' + $.param(
                    {
                        text: text,
                        page: page ? page : 0,
                        size: size ? size : 50
                    })
                  );
              },

              updateProfile: function (id, profile) {
                  return $http.put(base + id + '/profile', {
                      profile: profile
                  });
              },

              updateConfirmation: function (id, confirmation) {
                  return $http.put(base + id + '/confirm', {
                      confirmation: confirmation
                  });
              },

              declineAdmission: function (id) {
                  return $http.post(base + id + '/decline');
              },

              // ------------------------
              // Team
              // ------------------------
              joinOrCreateTeam: function (code) {
                  return $http.put(base + Session.getUserId() + '/team', {
                      code: code,
                      teamId: code
                  });
              },

              leaveTeam: function () {
                  return $http.delete(base + Session.getUserId() + '/team');
              },

              getMyTeammates: function () {
                  return $http.get(base + Session.getUserId() + '/team');
              },

              // -------------------------
              // Admin Only
              // -------------------------

              getStats: function () {
                  return $http.get(base + 'stats');
              },

              admitUser: function (id) {
                  return $http.post(base + id + '/admit');
              },

              checkIn: function (id) {
                  return $http.post(base + id + '/checkin');
              },

              checkOut: function (id) {
                  return $http.post(base + id + '/checkout');
              },

              removeUser: function (id) {
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

          console.log(currentUser);
          $scope.regIsOpen = Utils.isRegOpen(Settings);

          $scope.user = currentUser.data;

          $scope.TEAM = TEAM;
          $scope.teams = [];


          TeamService.getTeams()
            .success(teams => {
                $scope.teams = teams;
                console.log(teams[0]);
            });

          $scope.deleteTeam = function (team, index) {
              TeamService.deleteTeam(team._id)
                .success(({team}) => {
                    $scope.teams.splice(index, 1);
                })
          }

          $scope.joinTeam = function (team, index) {
              UserService.joinOrCreateTeam(team._id)
                .success((user) => {
                    TeamService.getTeams()
                      .success(teams => {
                          $scope.teams = teams;
                      });
                    $scope.user = user;

                })
          }

          $scope.saveTeam = function (team) {
              if(!team) return;

              TeamService.updateTeam(team._id, team)
                .success((team) => {
                  $scope.team = team;
                })
          };




          $scope.leaveTeam = function (team, index) {
              UserService.joinOrCreateTeam()
                .success((user) => {
                    TeamService.getTeams()
                      .success(teams => {
                          $scope.teams = teams;
                      });

                    console.log("updated user", user);

                    $scope.user = user;
                })
          }

          $scope.backToList = function () {
              $scope.editMode = false;
          };

          $scope.editTeam = function (team) {
              if(!$scope.currentUser.admin) return;
              $scope.editMode = true;
              $scope.team = team;

          };

          $scope.createTeam = function () {
              if ($scope.teamTitle == null || $scope.teamDesc == null || $scope.teamTitle == "" || $scope.teamDesc == "") {
                  alert("Please fill in a title and description.")
              } else {
                  TeamService.createTeam({
                      title: $scope.teamTitle,
                      description: $scope.teamDesc
                  })
                    .success(({team}) => {
                        console.log("team created:", team);
                        $scope.teams.push(team);
                    })
              }
          }


      }
  ]);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4tdmlld3MvYWRtaW4vYWRtaW5DdHJsLmpzIiwiYWRtaW4tdmlld3MvZ3VpZGUvZ3VpZGVDdHJsLmpzIiwiYWRtaW4tdmlld3MvdGVhbXMvdGVhbXNDdHJsLmpzIiwiYWRtaW4tdmlld3MvYWRtaW4vc3RhdHMvYWRtaW5TdGF0c0N0cmwuanMiLCJhZG1pbi12aWV3cy9hZG1pbi91c2VyL2FkbWluVXNlckN0cmwuanMiLCJhZG1pbi12aWV3cy9hZG1pbi91c2Vycy9hZG1pblVzZXJzQ3RybC5qcyIsImFkbWluLXZpZXdzL2FkbWluL3NldHRpbmdzL2FkbWluU2V0dGluZ3NDdHJsLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DdHJsLmpzIiwiY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbkN0cmwuanMiLCJkYXNoYm9hcmQvZGFzaGJvYXJkQ3RybC5qcyIsImxvZ2luL2xvZ2luQ3RybC5qcyIsInJlc2V0L3Jlc2V0Q3RybC5qcyIsInNpZGViYXIvc2lkZWJhckN0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIiwidmVyaWZ5L3ZlcmlmeUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBO0VBQ0E7OztBQUdBO0dBQ0EsT0FBQTtJQUNBO0lBQ0EsU0FBQSxjQUFBOzs7TUFHQSxjQUFBLGFBQUEsS0FBQTs7O0dBR0EsSUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLGFBQUEsUUFBQTs7O01BR0EsSUFBQSxR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QUEsTUFBQTtNQUNBLFFBQUEsYUFBQSxTQUFBLEtBQUE7TUFDQSxRQUFBLGFBQUEsY0FBQSxLQUFBLFVBQUE7TUFDQSxXQUFBLGNBQUE7OztJQUdBLEtBQUEsVUFBQSxTQUFBLFdBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxXQUFBLGNBQUE7TUFDQSxJQUFBLFdBQUE7UUFDQTs7OztJQUlBLEtBQUEsV0FBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsWUFBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsU0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLGNBQUEsS0FBQSxVQUFBO01BQ0EsV0FBQSxjQUFBOzs7O0FDckNBLFFBQUEsT0FBQTtHQUNBLFFBQUEsU0FBQTtJQUNBLFVBQUE7TUFDQSxPQUFBO1FBQ0EsV0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFlBQUEsS0FBQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxTQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQTs7UUFFQSxZQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLENBQUEsS0FBQTtZQUNBLE9BQUE7OztVQUdBLE9BQUEsSUFBQSxLQUFBOztVQUVBLE9BQUEsT0FBQSxNQUFBLE9BQUE7WUFDQSxNQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUE7Ozs7O0FDbkJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxHQUFBOztRQUVBLFFBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLEdBQUE7VUFDQSxHQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLGFBQUEsTUFBQSxHQUFBO1FBQ0EsT0FBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBO1VBQ0EsR0FBQTs7OztNQUlBLFlBQUEsb0JBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOztXQUVBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOzs7O01BSUEsWUFBQSxpQkFBQSxTQUFBLE9BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7O1dBRUEsUUFBQSxTQUFBLEtBQUE7WUFDQSxhQUFBLE1BQUE7O1dBRUEsTUFBQSxTQUFBLE1BQUEsV0FBQTtZQUNBLElBQUEsZUFBQSxJQUFBO2NBQ0EsUUFBQSxRQUFBOzs7OztNQUtBLFlBQUEsU0FBQSxTQUFBLFVBQUE7O1FBRUEsUUFBQSxRQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxZQUFBLFdBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsa0JBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTs7V0FFQSxRQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7V0FFQSxNQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7OztNQUlBLFlBQUEsU0FBQSxTQUFBLE9BQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLElBQUEsa0JBQUE7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLFFBQUEsUUFBQTtZQUNBLElBQUEsVUFBQTtjQUNBLFVBQUE7OztXQUdBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsSUFBQSxXQUFBO2NBQ0EsVUFBQTs7Ozs7TUFLQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUE7V0FDQSxNQUFBOzs7TUFHQSxPQUFBOzs7QUNuSEEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsZ0JBQUE7VUFDQSxNQUFBOzs7Ozs7OztBQzFDQSxRQUFBLE9BQUE7S0FDQSxRQUFBLGVBQUE7UUFDQTtRQUNBLFNBQUEsTUFBQTs7WUFFQSxJQUFBLE9BQUE7O1lBRUEsT0FBQTtnQkFDQSxVQUFBLFVBQUE7b0JBQ0EsT0FBQSxNQUFBLElBQUE7O2dCQUVBLFlBQUEsU0FBQSxLQUFBO29CQUNBLE9BQUEsTUFBQSxLQUFBLE1BQUEsQ0FBQSxNQUFBOztnQkFFQSxZQUFBLFNBQUEsUUFBQSxLQUFBO29CQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsTUFBQSxRQUFBLENBQUEsTUFBQTs7Z0JBRUEsWUFBQSxVQUFBLFFBQUE7b0JBQ0EsT0FBQSxNQUFBLE9BQUEsT0FBQSxNQUFBOzs7Ozs7O0FDbEJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtNQUNBO01BQ0E7TUFDQSxVQUFBLE9BQUEsU0FBQTs7VUFFQSxJQUFBLFFBQUE7VUFDQSxJQUFBLE9BQUEsUUFBQTs7VUFFQSxPQUFBOzs7OztjQUtBLGdCQUFBLFlBQUE7a0JBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBOzs7Y0FHQSxLQUFBLFVBQUEsSUFBQTtrQkFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7Y0FHQSxRQUFBLFlBQUE7a0JBQ0EsT0FBQSxNQUFBLElBQUE7OztjQUdBLFNBQUEsVUFBQSxNQUFBLE1BQUEsTUFBQTtrQkFDQSxPQUFBLE1BQUEsSUFBQSxRQUFBLE1BQUEsRUFBQTtvQkFDQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUEsT0FBQSxPQUFBO3dCQUNBLE1BQUEsT0FBQSxPQUFBOzs7OztjQUtBLGVBQUEsVUFBQSxJQUFBLFNBQUE7a0JBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLFlBQUE7c0JBQ0EsU0FBQTs7OztjQUlBLG9CQUFBLFVBQUEsSUFBQSxjQUFBO2tCQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO3NCQUNBLGNBQUE7Ozs7Y0FJQSxrQkFBQSxVQUFBLElBQUE7a0JBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7Y0FNQSxrQkFBQSxVQUFBLE1BQUE7a0JBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBLGNBQUEsU0FBQTtzQkFDQSxNQUFBO3NCQUNBLFFBQUE7Ozs7Y0FJQSxXQUFBLFlBQUE7a0JBQ0EsT0FBQSxNQUFBLE9BQUEsT0FBQSxRQUFBLGNBQUE7OztjQUdBLGdCQUFBLFlBQUE7a0JBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBLGNBQUE7Ozs7Ozs7Y0FPQSxVQUFBLFlBQUE7a0JBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O2NBR0EsV0FBQSxVQUFBLElBQUE7a0JBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7Y0FHQSxTQUFBLFVBQUEsSUFBQTtrQkFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztjQUdBLFVBQUEsVUFBQSxJQUFBO2tCQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O2NBR0EsWUFBQSxVQUFBLElBQUE7a0JBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7O0FDM0ZBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQTtNQUNBLE9BQUEsVUFBQTs7QUNMQSxRQUFBLE9BQUE7S0FDQSxXQUFBLGFBQUE7UUFDQTtRQUNBLFNBQUEsUUFBQTs7O1lBR0EsT0FBQSxXQUFBLFdBQUE7Z0JBQ0E7OztZQUdBLFNBQUEsaUJBQUE7Z0JBQ0EsSUFBQSxTQUFBLEtBQUEsWUFBQSxNQUFBLFNBQUEsZ0JBQUEsWUFBQSxJQUFBO29CQUNBLFNBQUEsZUFBQSxTQUFBLE1BQUEsVUFBQTt1QkFDQTtvQkFDQSxTQUFBLGVBQUEsU0FBQSxNQUFBLFVBQUE7Ozs7WUFJQSxTQUFBLGVBQUEsU0FBQSxpQkFBQSxTQUFBLFdBQUE7Z0JBQ0EsRUFBQSxjQUFBLFFBQUE7b0JBQ0EsV0FBQTttQkFDQTs7O1lBR0EsRUFBQSxnQkFBQSxNQUFBLFdBQUE7Z0JBQ0EsRUFBQSxjQUFBLFFBQUE7b0JBQ0EsV0FBQSxFQUFBLFlBQUEsRUFBQSxLQUFBLE1BQUEsUUFBQSxPQUFBLEtBQUEsTUFBQSxTQUFBO21CQUNBOztnQkFFQSxPQUFBOzs7WUFHQSxXQUFBLFVBQUE7Z0JBQ0EsSUFBQSxnQkFBQSxDQUFBLFdBQUE7b0JBQ0EsSUFBQSxVQUFBLEVBQUE7d0JBQ0E7O29CQUVBLElBQUEsT0FBQSxTQUFBLFVBQUE7O3dCQUVBLElBQUEsT0FBQSxhQUFBLFlBQUEsb0JBQUEsVUFBQSxTQUFBLFNBQUEsR0FBQTs0QkFDQSxZQUFBLFNBQUEsS0FBQSxXQUFBO2dDQUNBLElBQUEsY0FBQSxFQUFBLE1BQUEsS0FBQTs7Z0NBRUE7cUNBQ0EsS0FBQSxvQkFBQSxZQUFBLFNBQUE7cUNBQ0EsS0FBQSxrQkFBQSxZQUFBO3FDQUNBO3FDQUNBLE9BQUEsWUFBQTs7OzRCQUdBLFFBQUEsSUFBQSxtQkFBQSxHQUFBLG1CQUFBLFdBQUE7Z0NBQ0E7Ozs7O29CQUtBLElBQUEsaUJBQUEsV0FBQTt3QkFDQSxVQUFBLEtBQUEsU0FBQSxHQUFBOzRCQUNBLElBQUEsY0FBQSxFQUFBO2dDQUNBLGtCQUFBLFlBQUEsS0FBQTs7NEJBRUEsSUFBQSxtQkFBQSxRQUFBLGFBQUE7Z0NBQ0EsSUFBQSxjQUFBLFVBQUEsR0FBQSxJQUFBO29DQUNBLHNCQUFBLFlBQUEsS0FBQSxzQkFBQSxZQUFBLEtBQUE7O2dDQUVBLFlBQUEsU0FBQTs7Z0NBRUEsSUFBQSxZQUFBLFNBQUEsS0FBQSxZQUFBLFNBQUEsT0FBQSxxQkFBQTtvQ0FDQSxZQUFBLFNBQUEsWUFBQSxJQUFBLE9BQUE7OzttQ0FHQTtnQ0FDQSxJQUFBLGNBQUEsVUFBQSxHQUFBLElBQUE7O2dDQUVBLFlBQUEsWUFBQTs7Z0NBRUEsSUFBQSxZQUFBLFNBQUEsS0FBQSxRQUFBLGVBQUEsWUFBQSxLQUFBLHNCQUFBLFlBQUEsS0FBQSxtQkFBQTtvQ0FDQSxZQUFBLFlBQUEsWUFBQSxXQUFBOzs7Ozs7b0JBTUEsT0FBQTt3QkFDQSxNQUFBOzs7O2dCQUlBLEVBQUEsV0FBQTtvQkFDQSxjQUFBLEtBQUEsRUFBQTs7ZUFFQTs7Ozs7QUMzRkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxVQUFBLFFBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLE1BQUE7O1VBRUEsSUFBQSxXQUFBLFNBQUE7O1VBRUEsUUFBQSxJQUFBO1VBQ0EsT0FBQSxZQUFBLE1BQUEsVUFBQTs7VUFFQSxPQUFBLE9BQUEsWUFBQTs7VUFFQSxPQUFBLE9BQUE7VUFDQSxPQUFBLFFBQUE7OztVQUdBLFlBQUE7YUFDQSxRQUFBOzs7OztVQUtBLE9BQUEsYUFBQSxVQUFBLE1BQUEsT0FBQTtjQUNBLFlBQUEsV0FBQSxLQUFBO2lCQUNBLFFBQUE7Ozs7O1VBS0EsT0FBQSxXQUFBLFVBQUEsTUFBQSxPQUFBO2NBQ0EsWUFBQSxpQkFBQSxLQUFBO2lCQUNBLFFBQUE7Ozs7Ozs7Ozs7VUFVQSxPQUFBLFdBQUEsVUFBQSxNQUFBO2NBQ0EsR0FBQSxDQUFBLE1BQUE7O2NBRUEsWUFBQSxXQUFBLEtBQUEsS0FBQTtpQkFDQSxRQUFBOzs7Ozs7OztVQVFBLE9BQUEsWUFBQSxVQUFBLE1BQUEsT0FBQTtjQUNBLFlBQUE7aUJBQ0EsUUFBQTs7Ozs7Ozs7Ozs7O1VBWUEsT0FBQSxhQUFBLFlBQUE7Y0FDQSxPQUFBLFdBQUE7OztVQUdBLE9BQUEsV0FBQSxVQUFBLE1BQUE7Y0FDQSxHQUFBLENBQUEsT0FBQSxZQUFBLE9BQUE7Y0FDQSxPQUFBLFdBQUE7Y0FDQSxPQUFBLE9BQUE7Ozs7VUFJQSxPQUFBLGFBQUEsWUFBQTtjQUNBLElBQUEsT0FBQSxhQUFBLFFBQUEsT0FBQSxZQUFBLFFBQUEsT0FBQSxhQUFBLE1BQUEsT0FBQSxZQUFBLElBQUE7a0JBQ0EsTUFBQTtxQkFDQTtrQkFDQSxZQUFBLFdBQUE7c0JBQ0EsT0FBQSxPQUFBO3NCQUNBLGFBQUEsT0FBQTs7cUJBRUEsUUFBQTs7Ozs7Ozs7Ozs7QUM1RkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxpQkFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsWUFBQTs7TUFFQTtTQUNBO1NBQ0EsUUFBQSxTQUFBLE1BQUE7VUFDQSxPQUFBLFFBQUE7VUFDQSxPQUFBLFVBQUE7OztNQUdBLE9BQUEsVUFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE9BQUEsTUFBQTs7OztBQ2RBLFFBQUEsT0FBQTtHQUNBLFdBQUEsZ0JBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxPQUFBLE1BQUEsWUFBQTtNQUNBLE9BQUEsZUFBQSxLQUFBOzs7TUFHQTs7Ozs7TUFLQSxTQUFBLGlCQUFBOztRQUVBO1dBQ0EsSUFBQTtXQUNBLEtBQUEsU0FBQSxJQUFBO1lBQ0EsSUFBQSxVQUFBLElBQUE7WUFDQSxJQUFBLFFBQUEsT0FBQSxhQUFBLE1BQUEsTUFBQSxLQUFBOztZQUVBLElBQUEsUUFBQSxPQUFBO2NBQ0EsT0FBQSxhQUFBLFFBQUEsU0FBQSxRQUFBLE9BQUE7Y0FDQSxPQUFBLG1CQUFBOzs7Ozs7O01BT0EsT0FBQSxnQkFBQSxVQUFBO1FBQ0E7V0FDQSxjQUFBLE9BQUEsYUFBQSxLQUFBLE9BQUEsYUFBQTtXQUNBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsZ0JBQUE7WUFDQSxLQUFBLFlBQUEsb0JBQUE7O1dBRUEsTUFBQSxVQUFBO1lBQ0EsS0FBQTs7Ozs7QUN4Q0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxpQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFFBQUEsY0FBQSxZQUFBOztNQUVBLE9BQUEsUUFBQTtNQUNBLE9BQUEsUUFBQTs7Ozs7O01BTUEsRUFBQSxjQUFBOztNQUVBLE9BQUEsZUFBQTtNQUNBLE9BQUEsYUFBQSxXQUFBLGlCQUFBLENBQUEsUUFBQSxJQUFBLGNBQUE7UUFDQSxxQkFBQTtTQUNBLFNBQUE7O01BRUEsU0FBQSxXQUFBLEtBQUE7UUFDQSxPQUFBLFFBQUEsS0FBQTtRQUNBLE9BQUEsY0FBQSxLQUFBO1FBQ0EsT0FBQSxXQUFBLEtBQUE7O1FBRUEsSUFBQSxJQUFBO1FBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLEtBQUEsWUFBQSxJQUFBO1VBQ0EsRUFBQSxLQUFBOztRQUVBLE9BQUEsUUFBQTs7O01BR0E7U0FDQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUEsYUFBQTtTQUNBLFFBQUEsU0FBQSxLQUFBO1VBQ0EsV0FBQTs7O01BR0EsT0FBQSxPQUFBLGFBQUEsU0FBQSxVQUFBO1FBQ0E7V0FDQSxRQUFBLGFBQUEsTUFBQSxhQUFBLE1BQUE7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLFdBQUE7Ozs7TUFJQSxPQUFBLFdBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxHQUFBLG1CQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUEsYUFBQSxRQUFBOzs7O01BSUEsT0FBQSxTQUFBLFNBQUEsUUFBQSxLQUFBO1FBQ0EsT0FBQTs7UUFFQSxPQUFBLEdBQUEsa0JBQUE7VUFDQSxJQUFBLEtBQUE7Ozs7TUFJQSxPQUFBLGdCQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7UUFDQSxPQUFBOztRQUVBLElBQUEsQ0FBQSxLQUFBLE9BQUEsVUFBQTtVQUNBLEtBQUE7WUFDQSxPQUFBO1lBQ0EsTUFBQSwrQkFBQSxLQUFBLFFBQUEsT0FBQTtZQUNBLE1BQUE7WUFDQSxrQkFBQTtZQUNBLG9CQUFBO1lBQ0EsbUJBQUE7WUFDQSxnQkFBQTs7WUFFQSxVQUFBO2NBQ0E7aUJBQ0EsUUFBQSxLQUFBO2lCQUNBLFFBQUEsU0FBQSxLQUFBO2tCQUNBLE9BQUEsTUFBQSxTQUFBO2tCQUNBLEtBQUEsY0FBQSxLQUFBLFFBQUEsT0FBQSx5QkFBQTs7aUJBRUEsTUFBQSxTQUFBLElBQUE7b0JBQ0EsS0FBQSxrQkFBQSxLQUFBLFFBQUEsT0FBQSw4QkFBQTs7OztlQUlBO1VBQ0E7YUFDQSxTQUFBLEtBQUE7YUFDQSxRQUFBLFNBQUEsS0FBQTtjQUNBLE9BQUEsTUFBQSxTQUFBO2NBQ0EsS0FBQSxlQUFBLEtBQUEsUUFBQSxPQUFBLDBCQUFBOzthQUVBLE1BQUEsU0FBQSxJQUFBO29CQUNBLEtBQUEsbUJBQUEsS0FBQSxRQUFBLE9BQUEsK0JBQUE7Ozs7O01BS0EsT0FBQSxhQUFBLFNBQUEsUUFBQSxNQUFBLE9BQUE7UUFDQSxPQUFBOzs7UUFHQSxLQUFBO1VBQ0EsT0FBQTtVQUNBLE1BQUEsNkJBQUEsS0FBQSxRQUFBLE9BQUE7VUFDQSxNQUFBO1VBQ0Esa0JBQUE7VUFDQSxvQkFBQTtVQUNBLG1CQUFBO1VBQ0EsZ0JBQUE7YUFDQSxVQUFBOztZQUVBLEtBQUE7Y0FDQSxPQUFBO2NBQ0EsTUFBQTtnQkFDQTtjQUNBLE1BQUE7Y0FDQSxrQkFBQTtjQUNBLG9CQUFBO2NBQ0EsbUJBQUE7Y0FDQSxnQkFBQTtpQkFDQSxVQUFBOztnQkFFQTttQkFDQSxVQUFBLEtBQUE7bUJBQ0EsUUFBQSxTQUFBLEtBQUE7b0JBQ0EsT0FBQSxNQUFBLFNBQUE7b0JBQ0EsS0FBQSxZQUFBLEtBQUEsUUFBQSxPQUFBLHVCQUFBOzttQkFFQSxNQUFBLFNBQUEsSUFBQTtvQkFDQSxLQUFBLGdCQUFBLEtBQUEsUUFBQSxPQUFBLDRCQUFBOzs7Ozs7Ozs7Ozs7Ozs7TUFlQSxPQUFBLGFBQUEsU0FBQSxRQUFBLE1BQUEsT0FBQTtRQUNBLE9BQUE7O1FBRUEsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBLDZCQUFBLEtBQUEsUUFBQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLGtCQUFBO1VBQ0Esb0JBQUE7VUFDQSxtQkFBQTtVQUNBLGdCQUFBO2FBQ0EsVUFBQTs7WUFFQSxLQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Z0JBQ0E7Y0FDQSxNQUFBO2NBQ0Esa0JBQUE7Y0FDQSxvQkFBQTtjQUNBLG1CQUFBO2NBQ0EsZ0JBQUE7aUJBQ0EsVUFBQTs7Z0JBRUE7bUJBQ0EsV0FBQSxLQUFBO21CQUNBLFFBQUEsU0FBQSxLQUFBO29CQUNBLE9BQUEsTUFBQSxPQUFBLE1BQUE7b0JBQ0EsS0FBQSxXQUFBLEtBQUEsUUFBQSxPQUFBLHNCQUFBOzttQkFFQSxNQUFBLFNBQUEsSUFBQTtvQkFDQSxLQUFBLGVBQUEsS0FBQSxRQUFBLE9BQUEsMkJBQUE7Ozs7Ozs7OztNQVNBLFNBQUEsV0FBQSxLQUFBO1FBQ0EsSUFBQSxNQUFBO1VBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQTs7OztNQUlBLE9BQUEsV0FBQSxTQUFBLE1BQUE7UUFDQSxJQUFBLEtBQUEsTUFBQTtVQUNBLE9BQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsV0FBQTtVQUNBLE9BQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsWUFBQSxDQUFBLEtBQUEsT0FBQSxXQUFBO1VBQ0EsT0FBQTs7OztNQUlBLFNBQUEsV0FBQSxLQUFBO1FBQ0EsT0FBQSxlQUFBO1FBQ0EsT0FBQSxhQUFBLFdBQUEsaUJBQUE7UUFDQSxFQUFBO1dBQ0EsTUFBQTs7O01BR0EsU0FBQSxpQkFBQSxLQUFBO1FBQ0EsT0FBQTtVQUNBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsV0FBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxXQUFBLEtBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGNBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFlBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7O1lBR0E7WUFDQSxNQUFBO1lBQ0EsUUFBQTtjQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxvQkFBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxzQkFBQSxLQUFBLE9BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxVQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsT0FBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBOzs7Ozs7O01BT0EsT0FBQSxhQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlWQSxRQUFBLE9BQUE7R0FDQSxXQUFBLHFCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE1BQUEsZ0JBQUE7O01BRUEsT0FB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QUFBO0dBQ0EsV0FBQSxlQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxVQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsV0FBQTs7TUFFQSxPQUFBLGFBQUE7O01BRUEsT0FBQSxtQkFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsU0FBQSxVQUFBO1FBQ0EsWUFBQTs7O01BR0EsT0FBQSxjQUFBO01BQ0EsT0FBQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxjQUFBLENBQUEsT0FBQTs7OztNQUlBLEVBQUEsU0FBQSxHQUFBLFNBQUEsVUFBQTtRQUNBLE9BQUEsY0FBQTs7Ozs7QUM3QkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsS0FBQTs7TUFFQSxJQUFBLFdBQUEsU0FBQTs7TUFFQSxPQUFBLFlBQUEsTUFBQSxVQUFBOztNQUVBLE9BQUEsT0FBQSxZQUFBOztNQUVBLE9BQUEsT0FBQTs7TUFFQSxTQUFBLHFCQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBOzs7O01BSUEsSUFBQSxPQUFBLEtBQUEsU0FBQTtRQUNBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQTtRQUNBO1dBQ0EsaUJBQUEsT0FBQTtXQUNBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxPQUFBO1lBQ0E7O1dBRUEsTUFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFFBQUEsSUFBQTs7OztNQUlBLE9BQUEsWUFBQSxVQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztXQUVBLE1BQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxRQUFBLElBQUEsS0FBQTs7Ozs7O0FDckRBLFFBQUEsT0FBQTtHQUNBLFdBQUEsY0FBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxjQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsYUFBQTs7TUFFQSxPQUFBLFVBQUE7O01BRUEsSUFBQSxNQUFBO1FBQ0EsWUFBQSxPQUFBO1VBQ0EsU0FBQSxLQUFBO1lBQ0EsT0FBQSxVQUFBOztZQUVBLE9BQUEsVUFBQTs7VUFFQSxTQUFBLElBQUE7O1lBRUEsT0FBQSxVQUFBOzs7O1FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWcnLCBbXG4gICd1aS5yb3V0ZXInLFxuXSk7XG5cbmFwcFxuICAuY29uZmlnKFtcbiAgICAnJGh0dHBQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJGh0dHBQcm92aWRlcil7XG5cbiAgICAgIC8vIEFkZCBhdXRoIHRva2VuIHRvIEF1dGhvcml6YXRpb24gaGVhZGVyXG4gICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdBdXRoSW50ZXJjZXB0b3InKTtcblxuICAgIH1dKVxuICAucnVuKFtcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdTZXNzaW9uJyxcbiAgICBmdW5jdGlvbihBdXRoU2VydmljZSwgU2Vzc2lvbil7XG5cbiAgICAgIC8vIFN0YXJ0dXAsIGxvZ2luIGlmIHRoZXJlJ3MgIGEgdG9rZW4uXG4gICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XG4gICAgICBpZiAodG9rZW4pe1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhUb2tlbih0b2tlbik7XG4gICAgICB9XG5cbiAgfV0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgICAuY29uc3RhbnQoJ0VWRU5UX0lORk8nLCB7XG4gICAgICAgIE5BTUU6ICdIYWNrQVUgMjAxNycsXG4gICAgfSlcbiAgICAuY29uc3RhbnQoJ0RBU0hCT0FSRCcsIHtcbiAgICAgICAgVU5WRVJJRklFRDogJ1lvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhbiBlbWFpbCBhc2tpbmcgeW91IHZlcmlmeSB5b3VyIGVtYWlsLiBDbGljayB0aGUgbGluayBpbiB0aGUgZW1haWwgYW5kIHlvdSBjYW4gc3RhcnQgeW91ciBhcHBsaWNhdGlvbiEnLFxuICAgICAgICBJTkNPTVBMRVRFX1RJVExFOiAnWW91IHN0aWxsIG5lZWQgdG8gY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiEnLFxuICAgICAgICBJTkNPTVBMRVRFOiAnSWYgeW91IGRvIG5vdCBjb21wbGV0ZSB5b3VyIGFwcGxpY2F0aW9uIGJlZm9yZSB0aGUgW0FQUF9ERUFETElORV0sIHlvdSB3aWxsIG5vdCBiZSBjb25zaWRlcmVkIGZvciB0aGUgYWRtaXNzaW9ucyBsb3R0ZXJ5IScsXG4gICAgICAgIFNVQk1JVFRFRF9USVRMRTogJ1lvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc3VibWl0dGVkIScsXG4gICAgICAgIFNVQk1JVFRFRDogJ0ZlZWwgZnJlZSB0byBlZGl0IGl0IGF0IGFueSB0aW1lLiBIb3dldmVyLCBvbmNlIHJlZ2lzdHJhdGlvbiBpcyBjbG9zZWQsIHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGVkaXQgaXQgYW55IGZ1cnRoZXIuXFxuQWRtaXNzaW9ucyB3aWxsIGJlIGRldGVybWluZWQgYnkgYSByYW5kb20gbG90dGVyeS4gUGxlYXNlIG1ha2Ugc3VyZSB5b3VyIGluZm9ybWF0aW9uIGlzIGFjY3VyYXRlIGJlZm9yZSByZWdpc3RyYXRpb24gaXMgY2xvc2VkIScsXG4gICAgICAgIENMT1NFRF9BTkRfSU5DT01QTEVURV9USVRMRTogJ1VuZm9ydHVuYXRlbHksIHJlZ2lzdHJhdGlvbiBoYXMgY2xvc2VkLCBhbmQgdGhlIGxvdHRlcnkgcHJvY2VzcyBoYXMgYmVndW4uJyxcbiAgICAgICAgQ0xPU0VEX0FORF9JTkNPTVBMRVRFOiAnQmVjYXVzZSB5b3UgaGF2ZSBub3QgY29tcGxldGVkIHlvdXIgcHJvZmlsZSBpbiB0aW1lLCB5b3Ugd2lsbCBub3QgYmUgZWxpZ2libGUgZm9yIHRoZSBsb3R0ZXJ5IHByb2Nlc3MuJyxcbiAgICAgICAgQURNSVRURURfQU5EX0NBTl9DT05GSVJNX1RJVExFOiAnWW91IG11c3QgY29uZmlybSBieSBbQ09ORklSTV9ERUFETElORV0uJyxcbiAgICAgICAgQURNSVRURURfQU5EX0NBTk5PVF9DT05GSVJNX1RJVExFOiAnWW91ciBjb25maXJtYXRpb24gZGVhZGxpbmUgb2YgW0NPTkZJUk1fREVBRExJTkVdIGhhcyBwYXNzZWQuJyxcbiAgICAgICAgQURNSVRURURfQU5EX0NBTk5PVF9DT05GSVJNOiAnQWx0aG91Z2ggeW91IHdlcmUgYWNjZXB0ZWQsIHlvdSBkaWQgbm90IGNvbXBsZXRlIHlvdXIgY29uZmlybWF0aW9uIGluIHRpbWUuXFxuVW5mb3J0dW5hdGVseSwgdGhpcyBtZWFucyB0aGF0IHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGF0dGVuZCB0aGUgZXZlbnQsIGFzIHdlIG11c3QgYmVnaW4gdG8gYWNjZXB0IG90aGVyIGFwcGxpY2FudHMgb24gdGhlIHdhaXRsaXN0LlxcbldlIGhvcGUgdG8gc2VlIHlvdSBhZ2FpbiBuZXh0IHllYXIhJyxcbiAgICAgICAgQ09ORklSTUVEX05PVF9QQVNUX1RJVExFOiAnWW91IGNhbiBlZGl0IHlvdXIgY29uZmlybWF0aW9uIGluZm9ybWF0aW9uIHVudGlsIFtDT05GSVJNX0RFQURMSU5FXScsXG4gICAgICAgIERFQ0xJTkVEOiAnV2VcXCdyZSBzb3JyeSB0byBoZWFyIHRoYXQgeW91IHdvblxcJ3QgYmUgYWJsZSB0byBtYWtlIGl0IHRvIEhhY2tBVSAyMDE4ISA6KFxcbk1heWJlIG5leHQgeWVhciEgV2UgaG9wZSB5b3Ugc2VlIHlvdSBhZ2FpbiBzb29uLicsXG4gICAgfSlcbiAgICAuY29uc3RhbnQoJ1RFQU0nLHtcbiAgICAgICAgTk9fVEVBTV9SRUdfQ0xPU0VEOiAnVW5mb3J0dW5hdGVseSwgaXRcXCdzIHRvbyBsYXRlIHRvIGVudGVyIHRoZSBsb3R0ZXJ5IHdpdGggYSB0ZWFtLlxcbkhvd2V2ZXIsIHlvdSBjYW4gc3RpbGwgZm9ybSB0ZWFtcyBvbiB5b3VyIG93biBiZWZvcmUgb3IgZHVyaW5nIHRoZSBldmVudCEnLFxuICAgIH0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gICAgLmNvbmZpZyhbXG4gICAgICAgICckc3RhdGVQcm92aWRlcicsXG4gICAgICAgICckdXJsUm91dGVyUHJvdmlkZXInLFxuICAgICAgICAnJGxvY2F0aW9uUHJvdmlkZXInLFxuICAgICAgICBmdW5jdGlvbiAoXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlcixcbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlcixcbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgICAgICAgICAgIC8vIEZvciBhbnkgdW5tYXRjaGVkIHVybCwgcmVkaXJlY3QgdG8gL3N0YXRlMVxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi80MDRcIik7XG5cbiAgICAgICAgICAgIC8vIFNldCB1cCBkZSBzdGF0ZXNcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdsb2dpbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9sb2dpblwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9sb2dpbi9sb2dpbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwJywge1xuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9iYXNlLmh0bWxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzaWRlYmFyQGFwcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9zaWRlYmFyL3NpZGViYXIuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTaWRlYmFyQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc2V0dGluZ3MnOiBmdW5jdGlvbiAoU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUxvZ2luOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmRhc2hib2FyZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvZGFzaGJvYXJkL2Rhc2hib2FyZC5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEYXNoYm9hcmRDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uIChVc2VyU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbiAoU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuZ3VpZGUnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvZ3VpZGVcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvZ3VpZGUvZ3VpZGUuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnR3VpZGVDdHJsJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYXBwbGljYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBwbGljYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYXBwbGljYXRpb24vYXBwbGljYXRpb24uaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQXBwbGljYXRpb25DdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uIChVc2VyU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbiAoU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5jb25maXJtYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvY29uZmlybWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2NvbmZpcm1hdGlvbi9jb25maXJtYXRpb24uaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ29uZmlybWF0aW9uQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbiAoVXNlclNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAudGVhbScsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZWFtXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3RlYW0vdGVhbS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUZWFtQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24gKFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnRlYW1zJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlYW1zXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluLXZpZXdzL3RlYW1zL3RlYW1zLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RlYW1zQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcXVpcmVWZXJpZmllZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24gKFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmFkbWluJywge1xuICAgICAgICAgICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi12aWV3cy9hZG1pbi9hZG1pbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluQ3RybCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUFkbWluOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnN0YXRzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FkbWluXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluLXZpZXdzL2FkbWluL3N0YXRzL3N0YXRzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluU3RhdHNDdHJsJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYWRtaW4udXNlcnMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYWRtaW4vdXNlcnM/XCIgK1xuICAgICAgICAgICAgICAgICAgICAnJnBhZ2UnICtcbiAgICAgICAgICAgICAgICAgICAgJyZzaXplJyArXG4gICAgICAgICAgICAgICAgICAgICcmcXVlcnknLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi12aWV3cy9hZG1pbi91c2Vycy91c2Vycy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblVzZXJzQ3RybCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXInLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYWRtaW4vdXNlcnMvOmlkXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluLXZpZXdzL2FkbWluL3VzZXIvdXNlci5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblVzZXJDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3VzZXInOiBmdW5jdGlvbiAoJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXQoJHN0YXRlUGFyYW1zLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc2V0dGluZ3MnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYWRtaW4vc2V0dGluZ3NcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvYWRtaW4vc2V0dGluZ3Mvc2V0dGluZ3MuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TZXR0aW5nc0N0cmwnLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdyZXNldCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZXNldC86dG9rZW5cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvcmVzZXQvcmVzZXQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVzZXRDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3ZlcmlmeScsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi92ZXJpZnkvOnRva2VuXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3ZlcmlmeS92ZXJpZnkuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVmVyaWZ5Q3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCc0MDQnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvNDA0XCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzLzQwNC5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xuICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XSlcbiAgICAucnVuKFtcbiAgICAgICAgJyRyb290U2NvcGUnLFxuICAgICAgICAnJHN0YXRlJyxcbiAgICAgICAgJ1Nlc3Npb24nLFxuICAgICAgICBmdW5jdGlvbiAoXG4gICAgICAgICAgICAkcm9vdFNjb3BlLFxuICAgICAgICAgICAgJHN0YXRlLFxuICAgICAgICAgICAgU2Vzc2lvbikge1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWlyZUxvZ2luID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVMb2dpbjtcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWlyZUFkbWluID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVBZG1pbjtcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWlyZVZlcmlmaWVkID0gdG9TdGF0ZS5kYXRhLnJlcXVpcmVWZXJpZmllZDtcblxuICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlTG9naW4gJiYgIVNlc3Npb24uZ2V0VG9rZW4oKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVBZG1pbiAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkuYWRtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVWZXJpZmllZCAmJiAhU2Vzc2lvbi5nZXRVc2VyKCkudmVyaWZpZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIFtcbiAgICAnU2Vzc2lvbicsXG4gICAgZnVuY3Rpb24oU2Vzc2lvbil7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKGNvbmZpZyl7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XG4gICAgICAgICAgICBpZiAodG9rZW4pe1xuICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1sneC1hY2Nlc3MtdG9rZW4nXSA9IHRva2VuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuc2VydmljZSgnU2Vzc2lvbicsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyR3aW5kb3cnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICR3aW5kb3cpe1xuXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbih0b2tlbiwgdXNlcil7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3QgPSB0b2tlbjtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnVzZXJJZCA9IHVzZXIuX2lkO1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgIH07XG5cbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbihvbkNvbXBsZXRlKXtcbiAgICAgIGRlbGV0ZSAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3Q7XG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyO1xuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG4gICAgICBpZiAob25Db21wbGV0ZSl7XG4gICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5nZXRUb2tlbiA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xuICAgIH07XG5cbiAgICB0aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xuICAgIH07XG5cbiAgICB0aGlzLmdldFVzZXIgPSBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIpO1xuICAgIH07XG5cbiAgICB0aGlzLnNldFVzZXIgPSBmdW5jdGlvbih1c2VyKXtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICB9O1xuXG4gIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ1V0aWxzJywgW1xuICAgIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1JlZ09wZW46IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSA+IHNldHRpbmdzLnRpbWVPcGVuICYmIERhdGUubm93KCkgPCBzZXR0aW5ncy50aW1lQ2xvc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQWZ0ZXI6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gdGltZTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0VGltZTogZnVuY3Rpb24odGltZSl7XG5cbiAgICAgICAgICBpZiAoIXRpbWUpe1xuICAgICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBEYXRlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHRpbWUpO1xuICAgICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXG4gICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWSwgaDptbSBhJykgK1xuICAgICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XG5cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5mYWN0b3J5KCdBdXRoU2VydmljZScsIFtcbiAgICAnJGh0dHAnLFxuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnJHdpbmRvdycsXG4gICAgJ1Nlc3Npb24nLFxuICAgIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlLCAkc3RhdGUsICR3aW5kb3csIFNlc3Npb24pIHtcbiAgICAgIHZhciBhdXRoU2VydmljZSA9IHt9O1xuXG4gICAgICBmdW5jdGlvbiBsb2dpblN1Y2Nlc3MoZGF0YSwgY2Ipe1xuICAgICAgICAvLyBXaW5uZXIgd2lubmVyIHlvdSBnZXQgYSB0b2tlblxuICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLnRva2VuLCBkYXRhLnVzZXIpO1xuXG4gICAgICAgIGlmIChjYil7XG4gICAgICAgICAgY2IoZGF0YS51c2VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBsb2dpbkZhaWx1cmUoZGF0YSwgY2Ipe1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvbG9naW4nLCB7XG4gICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgbG9naW5TdWNjZXNzKGRhdGEsIG9uU3VjY2Vzcyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUoZGF0YSwgb25GYWlsdXJlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luV2l0aFRva2VuID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL2xvZ2luJywge1xuICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhkYXRhLCBvblN1Y2Nlc3MpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1c0NvZGUpe1xuICAgICAgICAgICAgaWYgKHN0YXR1c0NvZGUgPT09IDQwMCl7XG4gICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveShsb2dpbkZhaWx1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UubG9nb3V0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHNlc3Npb25cbiAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGNhbGxiYWNrKTtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UucmVnaXN0ZXIgPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZWdpc3RlcicsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MoZGF0YSwgb25TdWNjZXNzKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGxvZ2luRmFpbHVyZShkYXRhLCBvbkZhaWx1cmUpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UudmVyaWZ5ID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5nZXQoJy9hdXRoL3ZlcmlmeS8nICsgdG9rZW4pXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICBTZXNzaW9uLnNldFVzZXIodXNlcik7XG4gICAgICAgICAgICBpZiAob25TdWNjZXNzKXtcbiAgICAgICAgICAgICAgb25TdWNjZXNzKHVzZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYgKG9uRmFpbHVyZSkge1xuICAgICAgICAgICAgICBvbkZhaWx1cmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCA9IGZ1bmN0aW9uKG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3ZlcmlmeS9yZXNlbmQnLCB7XG4gICAgICAgICAgICBpZDogU2Vzc2lvbi5nZXRVc2VySWQoKVxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbihlbWFpbCl7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldCcsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZCA9IGZ1bmN0aW9uKHRva2VuLCBwYXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldC9wYXNzd29yZCcsIHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3VjY2VzcyhvblN1Y2Nlc3MpXG4gICAgICAgICAgLmVycm9yKG9uRmFpbHVyZSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gYXV0aFNlcnZpY2U7XG4gICAgfVxuICBdKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ1NldHRpbmdzU2VydmljZScsIFtcbiAgJyRodHRwJyxcbiAgZnVuY3Rpb24oJGh0dHApe1xuXG4gICAgdmFyIGJhc2UgPSAnL2FwaS9zZXR0aW5ncy8nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFB1YmxpY1NldHRpbmdzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzOiBmdW5jdGlvbihvcGVuLCBjbG9zZSl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd0aW1lcycsIHtcbiAgICAgICAgICB0aW1lT3Blbjogb3BlbixcbiAgICAgICAgICB0aW1lQ2xvc2U6IGNsb3NlLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVDb25maXJtYXRpb25UaW1lOiBmdW5jdGlvbih0aW1lKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm0tYnknLCB7XG4gICAgICAgICAgdGltZTogdGltZVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBnZXRXaGl0ZWxpc3RlZEVtYWlsczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgJ3doaXRlbGlzdCcpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVdoaXRlbGlzdGVkRW1haWxzOiBmdW5jdGlvbihlbWFpbHMpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnd2hpdGVsaXN0Jywge1xuICAgICAgICAgIGVtYWlsczogZW1haWxzXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVdhaXRsaXN0VGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd3YWl0bGlzdCcsIHtcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUFjY2VwdGFuY2VUZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2FjY2VwdGFuY2UnLCB7XG4gICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVDb25maXJtYXRpb25UZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm1hdGlvbicsIHtcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgfVxuICBdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAgIC5mYWN0b3J5KCdUZWFtU2VydmljZScsIFtcbiAgICAgICAgJyRodHRwJyxcbiAgICAgICAgZnVuY3Rpb24oJGh0dHApe1xuXG4gICAgICAgICAgICB2YXIgYmFzZSA9ICcvYXBpL3RlYW1zJztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRUZWFtczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRlYW06IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlLCB7dGVhbTogZGF0YX0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdXBkYXRlVGVhbTogZnVuY3Rpb24odGVhbUlkLCBkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgXCIvXCIgKyB0ZWFtSWQsIHt0ZWFtOiBkYXRhfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWxldGVUZWFtOiBmdW5jdGlvbiAodGVhbUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoYmFzZSArIFwiL1wiICsgdGVhbUlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH1cbiAgICBdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnVXNlclNlcnZpY2UnLCBbXG4gICAgICAnJGh0dHAnLFxuICAgICAgJ1Nlc3Npb24nLFxuICAgICAgZnVuY3Rpb24gKCRodHRwLCBTZXNzaW9uKSB7XG5cbiAgICAgICAgICB2YXIgdXNlcnMgPSAnL2FwaS91c2Vycyc7XG4gICAgICAgICAgdmFyIGJhc2UgPSB1c2VycyArICcvJztcblxuICAgICAgICAgIHJldHVybiB7XG5cbiAgICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAvLyBCYXNpYyBBY3Rpb25zXG4gICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSArIFNlc3Npb24uZ2V0VXNlcklkKCkpO1xuICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgZ2V0QWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xuICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgIGdldFBhZ2U6IGZ1bmN0aW9uIChwYWdlLCBzaXplLCB0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVzZXJzICsgJz8nICsgJC5wYXJhbShcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IHBhZ2UgPyBwYWdlIDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IHNpemUgPyBzaXplIDogNTBcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgdXBkYXRlUHJvZmlsZTogZnVuY3Rpb24gKGlkLCBwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArICcvcHJvZmlsZScsIHtcbiAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlOiBwcm9maWxlXG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICB1cGRhdGVDb25maXJtYXRpb246IGZ1bmN0aW9uIChpZCwgY29uZmlybWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArICcvY29uZmlybScsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25maXJtYXRpb246IGNvbmZpcm1hdGlvblxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgZGVjbGluZUFkbWlzc2lvbjogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyAnL2RlY2xpbmUnKTtcbiAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgLy8gVGVhbVxuICAgICAgICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgam9pbk9yQ3JlYXRlVGVhbTogZnVuY3Rpb24gKGNvZGUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArIFNlc3Npb24uZ2V0VXNlcklkKCkgKyAnL3RlYW0nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgY29kZTogY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICB0ZWFtSWQ6IGNvZGVcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgIGxlYXZlVGVhbTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShiYXNlICsgU2Vzc2lvbi5nZXRVc2VySWQoKSArICcvdGVhbScpO1xuICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgIGdldE15VGVhbW1hdGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy90ZWFtJyk7XG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAvLyBBZG1pbiBPbmx5XG4gICAgICAgICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAgICAgICBnZXRTdGF0czogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgJ3N0YXRzJyk7XG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgYWRtaXRVc2VyOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvYWRtaXQnKTtcbiAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICBjaGVja0luOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvY2hlY2tpbicpO1xuICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgIGNoZWNrT3V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvY2hlY2tvdXQnKTtcbiAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICByZW1vdmVVc2VyOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvcmVtb3ZlJyk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgIH07XG4gICAgICB9XG4gIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gICAgLmNvbnRyb2xsZXIoJ0d1aWRlQ3RybCcsIFtcbiAgICAgICAgJyRzY29wZScsXG4gICAgICAgIGZ1bmN0aW9uKCRzY29wZSkge1xuXG4gICAgICAgICAgICAvLyBBbmNob3Igc2Nyb2xsaW5nXG4gICAgICAgICAgICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzY3JvbGxGdW5jdGlvbigpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBzY3JvbGxGdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPiAyMCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID4gMjApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUJ0blwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlCdG5cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215QnRuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKFwiaHRtbCwgYm9keVwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgICAgICAgICAgfSwgXCJmYXN0XCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJ2FbaHJlZl49XCIjXCJdJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoJ1tuYW1lPVwiJyArICQuYXR0cih0aGlzLCAnaHJlZicpLnN1YnN0cigxKSArICdcIl0nKS5vZmZzZXQoKS50b3BcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgc3RpY2t5SGVhZGVycyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RpY2tpZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvYWQgPSBmdW5jdGlvbihzdGlja2llcykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHN0aWNraWVzID09PSBcIm9iamVjdFwiICYmIHN0aWNraWVzIGluc3RhbmNlb2YgalF1ZXJ5ICYmIHN0aWNraWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RpY2tpZXMgPSBzdGlja2llcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXNTdGlja3kgPSAkKHRoaXMpLndyYXAoJzxkaXYgY2xhc3M9XCJmb2xsb3dXcmFwXCIgLz4nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1N0aWNreVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoJ29yaWdpbmFsUG9zaXRpb24nLCAkdGhpc1N0aWNreS5vZmZzZXQoKS50b3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YSgnb3JpZ2luYWxIZWlnaHQnLCAkdGhpc1N0aWNreS5vdXRlckhlaWdodCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaGVpZ2h0KCR0aGlzU3RpY2t5Lm91dGVySGVpZ2h0KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHdpbmRvdy5vZmYoXCJzY3JvbGwuc3RpY2tpZXNcIikub24oXCJzY3JvbGwuc3RpY2tpZXNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF93aGVuU2Nyb2xsaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIF93aGVuU2Nyb2xsaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RpY2tpZXMuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzU3RpY2t5ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0aWNreVBvc2l0aW9uID0gJHRoaXNTdGlja3kuZGF0YSgnb3JpZ2luYWxQb3NpdGlvbicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzdGlja3lQb3NpdGlvbiA8PSAkd2luZG93LnNjcm9sbFRvcCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkbmV4dFN0aWNreSA9ICRzdGlja2llcy5lcShpICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbmV4dFN0aWNreVBvc2l0aW9uID0gJG5leHRTdGlja3kuZGF0YSgnb3JpZ2luYWxQb3NpdGlvbicpIC0gJHRoaXNTdGlja3kuZGF0YSgnb3JpZ2luYWxIZWlnaHQnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1N0aWNreS5hZGRDbGFzcyhcImZpeGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkbmV4dFN0aWNreS5sZW5ndGggPiAwICYmICR0aGlzU3RpY2t5Lm9mZnNldCgpLnRvcCA+PSAkbmV4dFN0aWNreVBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1N0aWNreS5hZGRDbGFzcyhcImFic29sdXRlXCIpLmNzcyhcInRvcFwiLCAkbmV4dFN0aWNreVBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRwcmV2U3RpY2t5ID0gJHN0aWNraWVzLmVxKGkgLSAxKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1N0aWNreS5yZW1vdmVDbGFzcyhcImZpeGVkXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkcHJldlN0aWNreS5sZW5ndGggPiAwICYmICR3aW5kb3cuc2Nyb2xsVG9wKCkgPD0gJHRoaXNTdGlja3kuZGF0YSgnb3JpZ2luYWxQb3NpdGlvbicpIC0gJHRoaXNTdGlja3kuZGF0YSgnb3JpZ2luYWxIZWlnaHQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHByZXZTdGlja3kucmVtb3ZlQ2xhc3MoXCJhYnNvbHV0ZVwiKS5yZW1vdmVBdHRyKFwic3R5bGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZDogbG9hZFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICAgICAgICAkKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBzdGlja3lIZWFkZXJzLmxvYWQoJChcIi5zdGlja3lcIikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgNTAwKTtcblxuICAgICAgICB9XG4gICAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1RlYW1zQ3RybCcsIFtcbiAgICAgICckc2NvcGUnLFxuICAgICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAgICdzZXR0aW5ncycsXG4gICAgICAnVXRpbHMnLFxuICAgICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICAgICdUZWFtU2VydmljZScsXG4gICAgICAnVEVBTScsXG4gICAgICBmdW5jdGlvbiAoJHNjb3BlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBVc2VyU2VydmljZSwgVGVhbVNlcnZpY2UsIFRFQU0pIHtcbiAgICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuXG4gICAgICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcblxuICAgICAgICAgIGNvbnNvbGUubG9nKGN1cnJlbnRVc2VyKTtcbiAgICAgICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcblxuICAgICAgICAgICRzY29wZS5URUFNID0gVEVBTTtcbiAgICAgICAgICAkc2NvcGUudGVhbXMgPSBbXTtcblxuXG4gICAgICAgICAgVGVhbVNlcnZpY2UuZ2V0VGVhbXMoKVxuICAgICAgICAgICAgLnN1Y2Nlc3ModGVhbXMgPT4ge1xuICAgICAgICAgICAgICAgICRzY29wZS50ZWFtcyA9IHRlYW1zO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlYW1zWzBdKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgJHNjb3BlLmRlbGV0ZVRlYW0gPSBmdW5jdGlvbiAodGVhbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgVGVhbVNlcnZpY2UuZGVsZXRlVGVhbSh0ZWFtLl9pZClcbiAgICAgICAgICAgICAgICAuc3VjY2Vzcygoe3RlYW19KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50ZWFtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJHNjb3BlLmpvaW5UZWFtID0gZnVuY3Rpb24gKHRlYW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlLmpvaW5PckNyZWF0ZVRlYW0odGVhbS5faWQpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgVGVhbVNlcnZpY2UuZ2V0VGVhbXMoKVxuICAgICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKHRlYW1zID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRlYW1zID0gdGVhbXM7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcblxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJHNjb3BlLnNhdmVUZWFtID0gZnVuY3Rpb24gKHRlYW0pIHtcbiAgICAgICAgICAgICAgaWYoIXRlYW0pIHJldHVybjtcblxuICAgICAgICAgICAgICBUZWFtU2VydmljZS51cGRhdGVUZWFtKHRlYW0uX2lkLCB0ZWFtKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKCh0ZWFtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudGVhbSA9IHRlYW07XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICB9O1xuXG5cblxuXG4gICAgICAgICAgJHNjb3BlLmxlYXZlVGVhbSA9IGZ1bmN0aW9uICh0ZWFtLCBpbmRleCkge1xuICAgICAgICAgICAgICBVc2VyU2VydmljZS5qb2luT3JDcmVhdGVUZWFtKClcbiAgICAgICAgICAgICAgICAuc3VjY2VzcygodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBUZWFtU2VydmljZS5nZXRUZWFtcygpXG4gICAgICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3ModGVhbXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGVhbXMgPSB0ZWFtcztcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZWQgdXNlclwiLCB1c2VyKTtcblxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkc2NvcGUuYmFja1RvTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLmVkaXRNb2RlID0gZmFsc2U7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRzY29wZS5lZGl0VGVhbSA9IGZ1bmN0aW9uICh0ZWFtKSB7XG4gICAgICAgICAgICAgIGlmKCEkc2NvcGUuY3VycmVudFVzZXIuYWRtaW4pIHJldHVybjtcbiAgICAgICAgICAgICAgJHNjb3BlLmVkaXRNb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgJHNjb3BlLnRlYW0gPSB0ZWFtO1xuXG4gICAgICAgICAgfTtcblxuICAgICAgICAgICRzY29wZS5jcmVhdGVUZWFtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBpZiAoJHNjb3BlLnRlYW1UaXRsZSA9PSBudWxsIHx8ICRzY29wZS50ZWFtRGVzYyA9PSBudWxsIHx8ICRzY29wZS50ZWFtVGl0bGUgPT0gXCJcIiB8fCAkc2NvcGUudGVhbURlc2MgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZmlsbCBpbiBhIHRpdGxlIGFuZCBkZXNjcmlwdGlvbi5cIilcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIFRlYW1TZXJ2aWNlLmNyZWF0ZVRlYW0oe1xuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkc2NvcGUudGVhbVRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAkc2NvcGUudGVhbURlc2NcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5zdWNjZXNzKCh7dGVhbX0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGVhbSBjcmVhdGVkOlwiLCB0ZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50ZWFtcy5wdXNoKHRlYW0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG5cbiAgICAgIH1cbiAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FkbWluU3RhdHNDdHJsJyxbXG4gICAgJyRzY29wZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcblxuICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgLmdldFN0YXRzKClcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc3RhdHMpe1xuICAgICAgICAgICRzY29wZS5zdGF0cyA9IHN0YXRzO1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuZnJvbU5vdyA9IGZ1bmN0aW9uKGRhdGUpe1xuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZyb21Ob3coKTtcbiAgICAgIH07XG5cbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pblVzZXJDdHJsJyxbXG4gICAgJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAndXNlcicsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBVc2VyLCBVc2VyU2VydmljZSl7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gVXNlci5kYXRhO1xuXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgc2Nob29sIGRyb3Bkb3duXG4gICAgICBwb3B1bGF0ZVNjaG9vbHMoKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBUT0RPOiBKQU5LIFdBUk5JTkdcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVTY2hvb2xzKCl7XG5cbiAgICAgICAgJGh0dHBcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuanNvbicpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHZhciBzY2hvb2xzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuc2VsZWN0ZWRVc2VyLmVtYWlsLnNwbGl0KCdAJylbMV07XG5cbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSl7XG4gICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIucHJvZmlsZS5zY2hvb2wgPSBzY2hvb2xzW2VtYWlsXS5zY2hvb2w7XG4gICAgICAgICAgICAgICRzY29wZS5hdXRvRmlsbGVkU2Nob29sID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS51cGRhdGVQcm9maWxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlUHJvZmlsZSgkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IGRhdGE7XG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJQcm9maWxlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pblVzZXJzQ3RybCcsW1xuICAgICckc2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICckc3RhdGVQYXJhbXMnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xuXG4gICAgICAkc2NvcGUucGFnZXMgPSBbXTtcbiAgICAgICRzY29wZS51c2VycyA9IFtdO1xuXG4gICAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cbiAgICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxuICAgICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcbiAgICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cbiAgICAgICQoJy51aS5kaW1tZXInKS5yZW1vdmUoKTtcbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSB1c2VyLlxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHt9O1xuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnMoe3N0YXR1czogJycsIGNvbmZpcm1hdGlvbjoge1xuICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zOiBbXVxuICAgICAgfSwgcHJvZmlsZTogJyd9KTtcblxuICAgICAgZnVuY3Rpb24gdXBkYXRlUGFnZShkYXRhKXtcbiAgICAgICAgJHNjb3BlLnVzZXJzID0gZGF0YS51c2VycztcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gZGF0YS5wYWdlO1xuICAgICAgICAkc2NvcGUucGFnZVNpemUgPSBkYXRhLnNpemU7XG5cbiAgICAgICAgdmFyIHAgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnRvdGFsUGFnZXM7IGkrKyl7XG4gICAgICAgICAgcC5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5wYWdlcyA9IHA7XG4gICAgICB9XG5cbiAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5KVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICB1cGRhdGVQYWdlKGRhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgJHNjb3BlLiR3YXRjaCgncXVlcnlUZXh0JywgZnVuY3Rpb24ocXVlcnlUZXh0KXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsIHF1ZXJ5VGV4dClcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2UoZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLmdvVG9QYWdlID0gZnVuY3Rpb24ocGFnZSl7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmFkbWluLnVzZXJzJywge1xuICAgICAgICAgIHBhZ2U6IHBhZ2UsXG4gICAgICAgICAgc2l6ZTogJHN0YXRlUGFyYW1zLnNpemUgfHwgNTBcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuZ29Vc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyKXtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmFkbWluLnVzZXInLCB7XG4gICAgICAgICAgaWQ6IHVzZXIuX2lkXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnRvZ2dsZUNoZWNrSW4gPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XG4gICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBpZiAoIXVzZXIuc3RhdHVzLmNoZWNrZWRJbil7XG4gICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNoZWNrIGluIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcbiAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGNoZWNrIHRoZW0gaW4uXCIsXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgICAgICAgIC5jaGVja0luKHVzZXIuX2lkKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHVzZXI7XG4gICAgICAgICAgICAgICAgICBzd2FsKFwiQ2hlY2tlZCBpblwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgaGFzIGJlZW4gY2hlY2tlZCBpbi4nLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIk5vdCBjaGVja2VkIGluXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBjb3VsZCBub3QgYmUgY2hlY2tlZCBpbi4gJywgXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgIC5jaGVja091dCh1c2VyLl9pZClcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gdXNlcjtcbiAgICAgICAgICAgICAgc3dhbChcIkNoZWNrZWQgb3V0XCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBoYXMgYmVlbiBjaGVja2VkIG91dC4nLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJOb3QgY2hlY2tlZCBvdXRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBjaGVja2VkIG91dC4gJywgXCJlcnJvclwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuYWNjZXB0VXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIC8vIGlmICghdXNlci5zdGF0dXMuYWRtaXR0ZWQpe1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBhY2NlcHQgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGFjY2VwdCB0aGVtLlwiLFxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyBhY2NlcHRlZCB0aGlzIHVzZXIuIFwiICtcbiAgICAgICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxuICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBhY2NlcHQgdGhpcyB1c2VyLlwiLFxuICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAuYWRtaXRVc2VyKHVzZXIuX2lkKVxuICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSB1c2VyO1xuICAgICAgICAgICAgICAgICAgICBzd2FsKFwiQWNjZXB0ZWRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGhhcyBiZWVuIGFkbWl0dGVkLicsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIk5vdCBhZG1pdHRlZFwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgY291bGQgbm90IGJlIGFkbWl0dGVkLiAnLCBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgICAgLy8gICAgIC8vIHVuYWRtaXQgdXNlclxuICAgICAgICAgICAgICBcbiAgICAgICAgICAvLyB9XG5cbiAgICAgIH07XG5cbiAgICAgIC8vIGRlbGV0ZSBVc2VyIGZyb20gcmVjb3Jkc1xuICAgICAgJHNjb3BlLnJlbW92ZVVzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XG4gICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBkZWxldGUgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGRlbGV0ZSB1c2VyLlwiLFxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyBkZWxldGVkIHRoaXMgdXNlci4gXCIgK1xuICAgICAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGRlbGV0ZSB0aGlzIHVzZXIuXCIsXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgICAgIC5yZW1vdmVVc2VyKHVzZXIuX2lkKVxuICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51c2Vycy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJEZWxldGVkXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBoYXMgYmVlbiBkZWxldGVkLicsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIk5vdCBkZWxldGVkXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBjb3VsZCBub3QgYmUgZGVsZXRlZC4gJywgXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSl7XG4gICAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG1vbWVudCh0aW1lKS5mb3JtYXQoJ01NTU0gRG8gWVlZWSwgaDptbTpzcyBhJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgICBpZiAodXNlci5hZG1pbil7XG4gICAgICAgICAgcmV0dXJuICdhZG1pbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xuICAgICAgICAgIHJldHVybiAncG9zaXRpdmUnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiAhdXNlci5zdGF0dXMuY29uZmlybWVkKSB7XG4gICAgICAgICAgcmV0dXJuICd3YXJuaW5nJztcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gc2VsZWN0VXNlcih1c2VyKXtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHVzZXI7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xuICAgICAgICAkKCcubG9uZy51c2VyLm1vZGFsJylcbiAgICAgICAgICAubW9kYWwoJ3Nob3cnKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKXtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnQmFzaWMgSW5mbycsXG4gICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdDcmVhdGVkIE9uJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnRpbWVzdGFtcClcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0xhc3QgVXBkYXRlZCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5sYXN0VXBkYXRlZClcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NvbmZpcm0gQnknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkgfHwgJ04vQSdcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NoZWNrZWQgSW4nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSB8fCAnTi9BJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnRW1haWwnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmVtYWlsXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdUZWFtJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci50ZWFtQ29kZSB8fCAnTm9uZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgbmFtZTogJ1Byb2ZpbGUnLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmFtZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5uYW1lXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHZW5kZXInLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdTY2hvb2wnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuc2Nob29sXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHcmFkdWF0aW9uIFllYXInLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ3JhZHVhdGlvblllYXJcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdFc3NheScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5lc3NheVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBuYW1lOiAnQ29uZmlybWF0aW9uJyxcbiAgICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1Bob25lIE51bWJlcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnBob25lTnVtYmVyXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdEaWV0YXJ5IFJlc3RyaWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMuam9pbignLCAnKVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnU2hpcnQgU2l6ZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnNoaXJ0U2l6ZVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTWFqb3InLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5tYWpvclxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnR2l0aHViJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uZ2l0aHViXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdXZWJzaXRlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ud2Vic2l0ZVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgSGFyZHdhcmUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5uZWVkc0hhcmR3YXJlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnSGFyZHdhcmUgUmVxdWVzdGVkJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaGFyZHdhcmVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgbmFtZTogJ0hvc3RpbmcnLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgSG9zdGluZyBGcmlkYXknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ob3N0TmVlZGVkRnJpLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgSG9zdGluZyBTYXR1cmRheScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhvc3ROZWVkZWRTYXQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHZW5kZXIgTmV1dHJhbCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmdlbmRlck5ldXRyYWwsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdDYXQgRnJpZW5kbHknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5jYXRGcmllbmRseSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1Ntb2tpbmcgRnJpZW5kbHknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5zbW9raW5nRnJpZW5kbHksXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdIb3N0aW5nIE5vdGVzJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaG9zdE5vdGVzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIG5hbWU6ICdUcmF2ZWwnLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgUmVpbWJ1cnNlbWVudCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5lZWRzUmVpbWJ1cnNlbWVudCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1JlY2VpdmVkIFJlaW1idXJzZW1lbnQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5uZWVkc1JlaW1idXJzZW1lbnQgJiYgdXNlci5zdGF0dXMucmVpbWJ1cnNlbWVudEdpdmVuXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdBZGRyZXNzJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uYWRkcmVzcyA/IFtcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3MubGluZTEsXG4gICAgICAgICAgICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzLmxpbmUyLFxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5jaXR5LFxuICAgICAgICAgICAgICAgICAgJywnLFxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5zdGF0ZSxcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3MuemlwLFxuICAgICAgICAgICAgICAgICAgJywnLFxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5jb3VudHJ5LFxuICAgICAgICAgICAgICAgIF0uam9pbignICcpIDogJydcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0FkZGl0aW9uYWwgTm90ZXMnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ub3Rlc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuc2VsZWN0VXNlciA9IHNlbGVjdFVzZXI7XG5cbiAgICB9XSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignQWRtaW5TZXR0aW5nc0N0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzY2UnLFxuICAgICdTZXR0aW5nc1NlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHNjZSwgU2V0dGluZ3NTZXJ2aWNlKXtcblxuICAgICAgJHNjb3BlLnNldHRpbmdzID0ge307XG4gICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgLmdldFB1YmxpY1NldHRpbmdzKClcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKXtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgIC8vIEZvcm1hdCB0aGUgZGF0ZXMgaW4gc2V0dGluZ3MuXG4gICAgICAgIHNldHRpbmdzLnRpbWVPcGVuID0gbmV3IERhdGUoc2V0dGluZ3MudGltZU9wZW4pO1xuICAgICAgICBzZXR0aW5ncy50aW1lQ2xvc2UgPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lQ2xvc2UpO1xuICAgICAgICBzZXR0aW5ncy50aW1lQ29uZmlybSA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVDb25maXJtKTtcblxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgIH1cblxuICAgICAgLy8gV2hpdGVsaXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAuZ2V0V2hpdGVsaXN0ZWRFbWFpbHMoKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihlbWFpbHMpe1xuICAgICAgICAgICRzY29wZS53aGl0ZWxpc3QgPSBlbWFpbHMuam9pbihcIiwgXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZVdoaXRlbGlzdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVXaGl0ZWxpc3RlZEVtYWlscygkc2NvcGUud2hpdGVsaXN0LnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJykpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgICAgc3dhbCgnV2hpdGVsaXN0IHVwZGF0ZWQuJyk7XG4gICAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gc2V0dGluZ3Mud2hpdGVsaXN0ZWRFbWFpbHMuam9pbihcIiwgXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgLy8gUmVnaXN0cmF0aW9uIFRpbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSl7XG4gICAgICAgIGlmICghZGF0ZSl7XG4gICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBEYXRlXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYWNrIGZvciB0aW1lem9uZVxuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXG4gICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XG4gICAgICB9O1xuXG4gICAgICAvLyBUYWtlIGEgZGF0ZSBhbmQgcmVtb3ZlIHRoZSBzZWNvbmRzLlxuICAgICAgZnVuY3Rpb24gY2xlYW5EYXRlKGRhdGUpe1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoXG4gICAgICAgICAgZGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgIGRhdGUuZ2V0TW9udGgoKSxcbiAgICAgICAgICBkYXRlLmdldERhdGUoKSxcbiAgICAgICAgICBkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgZGF0ZS5nZXRNaW51dGVzKClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGRhdGVzIGFuZCB0dXJuIHRoZW0gdG8gbXMuXG4gICAgICAgIHZhciBvcGVuID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lT3BlbikuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgY2xvc2UgPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVDbG9zZSkuZ2V0VGltZSgpO1xuXG4gICAgICAgIGlmIChvcGVuIDwgMCB8fCBjbG9zZSA8IDAgfHwgb3BlbiA9PT0gdW5kZWZpbmVkIHx8IGNsb3NlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgIHJldHVybiBzd2FsKCdPb3BzLi4uJywgJ1lvdSBuZWVkIHRvIGVudGVyIHZhbGlkIHRpbWVzLicsICdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcGVuID49IGNsb3NlKXtcbiAgICAgICAgICBzd2FsKCdPb3BzLi4uJywgJ1JlZ2lzdHJhdGlvbiBjYW5ub3Qgb3BlbiBhZnRlciBpdCBjbG9zZXMuJywgJ2Vycm9yJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzKG9wZW4sIGNsb3NlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKTtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIlJlZ2lzdHJhdGlvbiBUaW1lcyBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIENvbmZpcm1hdGlvbiBUaW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UaW1lID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGNvbmZpcm1CeSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZUNvbmZpcm0pLmdldFRpbWUoKTtcblxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uVGltZShjb25maXJtQnkpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgICAgICAgICAgc3dhbChcIlNvdW5kcyBnb29kIVwiLCBcIkNvbmZpcm1hdGlvbiBEYXRlIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgLy8gQWNjZXB0YW5jZSAvIENvbmZpcm1hdGlvbiBUZXh0IC0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcblxuICAgICAgJHNjb3BlLm1hcmtkb3duUHJldmlldyA9IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwodGV4dCkpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZVdhaXRsaXN0VGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLndhaXRsaXN0VGV4dDtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVdhaXRsaXN0VGV4dCh0ZXh0KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiV2FpdGxpc3QgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZUFjY2VwdGFuY2VUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWNjZXB0YW5jZVRleHQ7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVBY2NlcHRhbmNlVGV4dCh0ZXh0KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiQWNjZXB0YW5jZSBUZXh0IFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MoZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudXBkYXRlQ29uZmlybWF0aW9uVGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQ7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UZXh0KHRleHQpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJDb25maXJtYXRpb24gVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FwcGxpY2F0aW9uQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyRodHRwJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1Nlc3Npb24nLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRodHRwLCBjdXJyZW50VXNlciwgU2V0dGluZ3MsIFNlc3Npb24sIFVzZXJTZXJ2aWNlKXtcblxuICAgICAgLy8gU2V0IHVwIHRoZSB1c2VyXG4gICAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG5cbiAgICAgIC8vIElzIHRoZSBzdHVkZW50IGZyb20gTUlUP1xuICAgICAgJHNjb3BlLmlzTWl0U3R1ZGVudCA9ICRzY29wZS51c2VyLmVtYWlsLnNwbGl0KCdAJylbMV0gPT0gJ21pdC5lZHUnO1xuXG4gICAgICAvLyBJZiBzbywgZGVmYXVsdCB0aGVtIHRvIGFkdWx0OiB0cnVlXG4gICAgICBpZiAoJHNjb3BlLmlzTWl0U3R1ZGVudCl7XG4gICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuYWR1bHQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgc2Nob29sIGRyb3Bkb3duXG4gICAgICBwb3B1bGF0ZVNjaG9vbHMoKTtcbiAgICAgIF9zZXR1cEZvcm0oKTtcblxuICAgICAgJHNjb3BlLnJlZ0lzQ2xvc2VkID0gRGF0ZS5ub3coKSA+IFNldHRpbmdzLmRhdGEudGltZUNsb3NlO1xuXG4gICAgICAvKipcbiAgICAgICAqIFRPRE86IEpBTksgV0FSTklOR1xuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVNjaG9vbHMoKXtcblxuICAgICAgICAkaHR0cFxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5qc29uJylcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS51c2VyLmVtYWlsLnNwbGl0KCdAJylbMV07XG5cbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSl7XG4gICAgICAgICAgICAgICRzY29wZS51c2VyLnByb2ZpbGUuc2Nob29sID0gc2Nob29sc1tlbWFpbF0uc2Nob29sO1xuICAgICAgICAgICAgICAkc2NvcGUuYXV0b0ZpbGxlZFNjaG9vbCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF91cGRhdGVVc2VyKGUpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKFNlc3Npb24uZ2V0VXNlcklkKCksICRzY29wZS51c2VyLnByb2ZpbGUpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzd2VldEFsZXJ0KHtcbiAgICAgICAgICAgICAgdGl0bGU6IFwiQXdlc29tZSFcIixcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3VyIGFwcGxpY2F0aW9uIGhhcyBiZWVuIHNhdmVkLlwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNlNzY0ODJcIlxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgc3dlZXRBbGVydChcIlVoIG9oIVwiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiLCBcImVycm9yXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfc2V0dXBGb3JtKCl7XG4gICAgICAgIC8vIFNlbWFudGljLVVJIGZvcm0gdmFsaWRhdGlvblxuICAgICAgICAkKCcudWkuZm9ybScpLmZvcm0oe1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgbmFtZToge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnbmFtZScsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIG5hbWUuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNjaG9vbDoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2Nob29sJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgc2Nob29sIG5hbWUuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHllYXI6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3llYXInLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IHlvdXIgZ3JhZHVhdGlvbiB5ZWFyLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZW5kZXI6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2dlbmRlcicsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBzZWxlY3QgYSBnZW5kZXIuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFkdWx0OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdhZHVsdCcsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NoZWNrZWQnLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnWW91IG11c3QgYmUgYW4gYWR1bHQsIG9yIGFuIE1JVCBzdHVkZW50LidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG5cblxuICAgICAgJHNjb3BlLnN1Ym1pdEZvcm0gPSBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoJCgnLnVpLmZvcm0nKS5mb3JtKCdpcyB2YWxpZCcpKXtcbiAgICAgICAgICBfdXBkYXRlVXNlcigpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignQ29uZmlybWF0aW9uQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAnVXRpbHMnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsIGN1cnJlbnRVc2VyLCBVdGlscywgVXNlclNlcnZpY2Upe1xuXG4gICAgICAvLyBTZXQgdXAgdGhlIHVzZXJcbiAgICAgIHZhciB1c2VyID0gY3VycmVudFVzZXIuZGF0YTtcbiAgICAgICRzY29wZS51c2VyID0gdXNlcjtcblxuICAgICAgJHNjb3BlLnBhc3RDb25maXJtYXRpb24gPSBEYXRlLm5vdygpID4gdXNlci5zdGF0dXMuY29uZmlybUJ5O1xuXG4gICAgICAkc2NvcGUuZm9ybWF0VGltZSA9IFV0aWxzLmZvcm1hdFRpbWU7XG5cbiAgICAgIF9zZXR1cEZvcm0oKTtcblxuICAgICAgJHNjb3BlLmZpbGVOYW1lID0gdXNlci5faWQgKyBcIl9cIiArIHVzZXIucHJvZmlsZS5uYW1lLnNwbGl0KFwiIFwiKS5qb2luKFwiX1wiKTtcblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gQWxsIHRoaXMganVzdCBmb3IgZGlldGFyeSByZXN0cmljdGlvbiBjaGVja2JveGVzIGZtbFxuXG4gICAgICB2YXIgZGlldGFyeVJlc3RyaWN0aW9ucyA9IHtcbiAgICAgICAgJ1ZlZ2V0YXJpYW4nOiBmYWxzZSxcbiAgICAgICAgJ1ZlZ2FuJzogZmFsc2UsXG4gICAgICAgICdIYWxhbCc6IGZhbHNlLFxuICAgICAgICAnS29zaGVyJzogZmFsc2UsXG4gICAgICAgICdOdXQgQWxsZXJneSc6IGZhbHNlXG4gICAgICB9O1xuXG4gICAgICBpZiAodXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucyl7XG4gICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyZXN0cmljdGlvbil7XG4gICAgICAgICAgaWYgKHJlc3RyaWN0aW9uIGluIGRpZXRhcnlSZXN0cmljdGlvbnMpe1xuICAgICAgICAgICAgZGlldGFyeVJlc3RyaWN0aW9uc1tyZXN0cmljdGlvbl0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5kaWV0YXJ5UmVzdHJpY3Rpb25zID0gZGlldGFyeVJlc3RyaWN0aW9ucztcblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBmdW5jdGlvbiBfdXBkYXRlVXNlcihlKXtcbiAgICAgICAgdmFyIGNvbmZpcm1hdGlvbiA9ICRzY29wZS51c2VyLmNvbmZpcm1hdGlvbjtcbiAgICAgICAgLy8gR2V0IHRoZSBkaWV0YXJ5IHJlc3RyaWN0aW9ucyBhcyBhbiBhcnJheVxuICAgICAgICB2YXIgZHJzID0gW107XG4gICAgICAgIE9iamVjdC5rZXlzKCRzY29wZS5kaWV0YXJ5UmVzdHJpY3Rpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XG4gICAgICAgICAgaWYgKCRzY29wZS5kaWV0YXJ5UmVzdHJpY3Rpb25zW2tleV0pe1xuICAgICAgICAgICAgZHJzLnB1c2goa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucyA9IGRycztcblxuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb24odXNlci5faWQsIGNvbmZpcm1hdGlvbilcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJXb28hXCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91J3JlIGNvbmZpcm1lZCFcIixcbiAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjZTc2NDgyXCJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3NldHVwRm9ybSgpe1xuICAgICAgICAvLyBTZW1hbnRpYy1VSSBmb3JtIHZhbGlkYXRpb25cbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNoaXJ0OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaGlydCcsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBnaXZlIHVzIGEgc2hpcnQgc2l6ZSEnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGhvbmU6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3Bob25lJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIGEgcGhvbmUgbnVtYmVyLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWduYXR1cmVMaWFiaWxpdHk6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NpZ25hdHVyZUxpYWJpbGl0eVdhaXZlcicsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0eXBlIHlvdXIgZGlnaXRhbCBzaWduYXR1cmUuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpZ25hdHVyZVBob3RvUmVsZWFzZToge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2lnbmF0dXJlUGhvdG9SZWxlYXNlJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmF0dXJlQ29kZU9mQ29uZHVjdDoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2lnbmF0dXJlQ29kZU9mQ29uZHVjdCcsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSB0eXBlIHlvdXIgZGlnaXRhbCBzaWduYXR1cmUuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKCcudWkuZm9ybScpLmZvcm0oJ2lzIHZhbGlkJykpe1xuICAgICAgICAgIF91cGRhdGVVc2VyKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdEYXNoYm9hcmRDdHJsJywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHNjb3BlJyxcbiAgICAnJHNjZScsXG4gICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdVdGlscycsXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgICdFVkVOVF9JTkZPJyxcbiAgICAnREFTSEJPQVJEJyxcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsICRzY2UsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBVc2VyU2VydmljZSwgREFTSEJPQVJEKXtcbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG4gICAgICB2YXIgdXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG4gICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG5cbiAgICAgICRzY29wZS5EQVNIQk9BUkQgPSBEQVNIQk9BUkQ7XG4gICAgICBcbiAgICAgIGZvciAodmFyIG1zZyBpbiAkc2NvcGUuREFTSEJPQVJEKSB7XG4gICAgICAgIGlmICgkc2NvcGUuREFTSEJPQVJEW21zZ10uaW5jbHVkZXMoJ1tBUFBfREVBRExJTkVdJykpIHtcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0FQUF9ERUFETElORV0nLCBVdGlscy5mb3JtYXRUaW1lKFNldHRpbmdzLnRpbWVDbG9zZSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkc2NvcGUuREFTSEJPQVJEW21zZ10uaW5jbHVkZXMoJ1tDT05GSVJNX0RFQURMSU5FXScpKSB7XG4gICAgICAgICAgJHNjb3BlLkRBU0hCT0FSRFttc2ddID0gJHNjb3BlLkRBU0hCT0FSRFttc2ddLnJlcGxhY2UoJ1tDT05GSVJNX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XG4gICAgICB2YXIgcmVnSXNPcGVuID0gJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XG5cbiAgICAgIC8vIElzIGl0IHBhc3QgdGhlIHVzZXIncyBjb25maXJtYXRpb24gdGltZT9cbiAgICAgIHZhciBwYXN0Q29uZmlybWF0aW9uID0gJHNjb3BlLnBhc3RDb25maXJtYXRpb24gPSBVdGlscy5pc0FmdGVyKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSk7XG5cbiAgICAgICRzY29wZS5kYXNoU3RhdGUgPSBmdW5jdGlvbihzdGF0dXMpe1xuICAgICAgICB2YXIgdXNlciA9ICRzY29wZS51c2VyO1xuICAgICAgICBzd2l0Y2ggKHN0YXR1cykge1xuICAgICAgICAgIGNhc2UgJ3VudmVyaWZpZWQnOlxuICAgICAgICAgICAgcmV0dXJuICF1c2VyLnZlcmlmaWVkO1xuICAgICAgICAgIGNhc2UgJ29wZW5BbmRJbmNvbXBsZXRlJzpcbiAgICAgICAgICAgIHJldHVybiByZWdJc09wZW4gJiYgdXNlci52ZXJpZmllZCAmJiAhdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZTtcbiAgICAgICAgICBjYXNlICdvcGVuQW5kU3VibWl0dGVkJzpcbiAgICAgICAgICAgIHJldHVybiByZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XG4gICAgICAgICAgY2FzZSAnY2xvc2VkQW5kSW5jb21wbGV0ZSc6XG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiAhdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XG4gICAgICAgICAgY2FzZSAnY2xvc2VkQW5kU3VibWl0dGVkJzogLy8gV2FpdGxpc3RlZCBTdGF0ZVxuICAgICAgICAgICAgcmV0dXJuICFyZWdJc09wZW4gJiYgdXNlci5zdGF0dXMuY29tcGxldGVkUHJvZmlsZSAmJiAhdXNlci5zdGF0dXMuYWRtaXR0ZWQ7XG4gICAgICAgICAgY2FzZSAnYWRtaXR0ZWRBbmRDYW5Db25maXJtJzpcbiAgICAgICAgICAgIHJldHVybiAhcGFzdENvbmZpcm1hdGlvbiAmJlxuICAgICAgICAgICAgICB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJlxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZEFuZENhbm5vdENvbmZpcm0nOlxuICAgICAgICAgICAgcmV0dXJuIHBhc3RDb25maXJtYXRpb24gJiZcbiAgICAgICAgICAgICAgdXNlci5zdGF0dXMuYWRtaXR0ZWQgJiZcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJlxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XG4gICAgICAgICAgY2FzZSAnY29uZmlybWVkJzpcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiB1c2VyLnN0YXR1cy5jb25maXJtZWQgJiYgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICAgIGNhc2UgJ2RlY2xpbmVkJzpcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnN0YXR1cy5kZWNsaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2hvd1dhaXRsaXN0ID0gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcblxuICAgICAgJHNjb3BlLnJlc2VuZEVtYWlsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgQXV0aFNlcnZpY2VcbiAgICAgICAgICAucmVzZW5kVmVyaWZpY2F0aW9uRW1haWwoKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzd2VldEFsZXJ0KCdZb3VyIGVtYWlsIGhhcyBiZWVuIHNlbnQuJyk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBUZXh0IVxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHZhciBjb252ZXJ0ZXIgPSBuZXcgc2hvd2Rvd24uQ29udmVydGVyKCk7XG4gICAgICAkc2NvcGUuYWNjZXB0YW5jZVRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy5hY2NlcHRhbmNlVGV4dCkpO1xuICAgICAgJHNjb3BlLmNvbmZpcm1hdGlvblRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy5jb25maXJtYXRpb25UZXh0KSk7XG4gICAgICAkc2NvcGUud2FpdGxpc3RUZXh0ID0gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwoU2V0dGluZ3Mud2FpdGxpc3RUZXh0KSk7XG5cblxuICAgICAgJHNjb3BlLmRlY2xpbmVBZG1pc3Npb24gPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EhXCIsXG4gICAgICAgICAgdGV4dDogXCJBcmUgeW91IHN1cmUgeW91IHdvdWxkIGxpa2UgdG8gZGVjbGluZSB5b3VyIGFkbWlzc2lvbj8gXFxuXFxuIFlvdSBjYW4ndCBnbyBiYWNrIVwiLFxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIEkgY2FuJ3QgbWFrZSBpdC5cIixcbiAgICAgICAgICBjbG9zZU9uQ29uZmlybTogdHJ1ZVxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgIC5kZWNsaW5lQWRtaXNzaW9uKHVzZXIuX2lkKVxuICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGh0dHAnLFxuICAgICckc3RhdGUnLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZSwgc2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSl7XG5cbiAgICAgIC8vIElzIHJlZ2lzdHJhdGlvbiBvcGVuP1xuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xuXG4gICAgICAvLyBTdGFydCBzdGF0ZSBmb3IgbG9naW5cbiAgICAgICRzY29wZS5sb2dpblN0YXRlID0gJ2xvZ2luJztcblxuICAgICAgZnVuY3Rpb24gb25TdWNjZXNzKCkge1xuICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25FcnJvcihkYXRhKXtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gZGF0YS5tZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZXNldEVycm9yKCl7XG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJlc2V0RXJyb3IoKTtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQoXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXNldEVycm9yKCk7XG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlZ2lzdGVyKFxuICAgICAgICAgICRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRXJyb3IpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNldExvZ2luU3RhdGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgICAkc2NvcGUubG9naW5TdGF0ZSA9IHN0YXRlO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNlbmRSZXNldEVtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS5lbWFpbDtcbiAgICAgICAgQXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwoZW1haWwpO1xuICAgICAgICBzd2VldEFsZXJ0KHtcbiAgICAgICAgICB0aXRsZTogXCJEb24ndCBTd2VhdCFcIixcbiAgICAgICAgICB0ZXh0OiBcIkFuIGVtYWlsIHNob3VsZCBiZSBzZW50IHRvIHlvdSBzaG9ydGx5LlwiLFxuICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjZTc2NDgyXCJcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfVxuICBdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignUmVzZXRDdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckc3RhdGVQYXJhbXMnLFxuICAgICckc3RhdGUnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgQXV0aFNlcnZpY2Upe1xuICAgICAgdmFyIHRva2VuID0gJHN0YXRlUGFyYW1zLnRva2VuO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgICRzY29wZS5jaGFuZ2VQYXNzd29yZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwYXNzd29yZCA9ICRzY29wZS5wYXNzd29yZDtcbiAgICAgICAgdmFyIGNvbmZpcm0gPSAkc2NvcGUuY29uZmlybTtcblxuICAgICAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm0pe1xuICAgICAgICAgICRzY29wZS5lcnJvciA9IFwiUGFzc3dvcmRzIGRvbid0IG1hdGNoIVwiO1xuICAgICAgICAgICRzY29wZS5jb25maXJtID0gXCJcIjtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBBdXRoU2VydmljZS5yZXNldFBhc3N3b3JkKFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgICRzY29wZS5wYXNzd29yZCxcbiAgICAgICAgICBmdW5jdGlvbihtZXNzYWdlKXtcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJOZWF0byFcIixcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIGNoYW5nZWQhXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI2U3NjQ4MlwiXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gZGF0YS5tZXNzYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdTaWRlYmFyQ3RybCcsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyRzY29wZScsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnVXRpbHMnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgJ1Nlc3Npb24nLFxuICAgICdFVkVOVF9JTkZPJyxcbiAgICBmdW5jdGlvbigkcm9vdFNjb3BlLCAkc2NvcGUsIFNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIFNlc3Npb24sIEVWRU5UX0lORk8pe1xuXG4gICAgICB2YXIgc2V0dGluZ3MgPSBTZXR0aW5ncy5kYXRhO1xuICAgICAgdmFyIHVzZXIgPSAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyO1xuXG4gICAgICAkc2NvcGUuRVZFTlRfSU5GTyA9IEVWRU5UX0lORk87XG5cbiAgICAgICRzY29wZS5wYXN0Q29uZmlybWF0aW9uID0gVXRpbHMuaXNBZnRlcih1c2VyLnN0YXR1cy5jb25maXJtQnkpO1xuXG4gICAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSBmYWxzZTtcbiAgICAgICRzY29wZS50b2dnbGVTaWRlYmFyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gISRzY29wZS5zaG93U2lkZWJhcjtcbiAgICAgIH07XG5cbiAgICAgIC8vIG9oIGdvZCBqUXVlcnkgaGFja1xuICAgICAgJCgnLml0ZW0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdUZWFtQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgICdURUFNJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgVXRpbHMsIFVzZXJTZXJ2aWNlLCBURUFNKXtcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCB1c2VyJ3MgbW9zdCByZWNlbnQgZGF0YS5cbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG5cbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xuXG4gICAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG5cbiAgICAgICRzY29wZS5URUFNID0gVEVBTTtcblxuICAgICAgZnVuY3Rpb24gX3BvcHVsYXRlVGVhbW1hdGVzKCkge1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5nZXRNeVRlYW1tYXRlcygpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcnMpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS50ZWFtbWF0ZXMgPSB1c2VycztcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCRzY29wZS51c2VyLnRlYW1Db2RlKXtcbiAgICAgICAgX3BvcHVsYXRlVGVhbW1hdGVzKCk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5qb2luVGVhbSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLmpvaW5PckNyZWF0ZVRlYW0oJHNjb3BlLmNvZGUpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgX3BvcHVsYXRlVGVhbW1hdGVzKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlcy5tZXNzYWdlO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmxlYXZlVGVhbSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLmxlYXZlVGVhbSgpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgJHNjb3BlLnRlYW1tYXRlcyA9IFtdO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXMuZGF0YS5tZXNzYWdlO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignVmVyaWZ5Q3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHN0YXRlUGFyYW1zJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBBdXRoU2VydmljZSl7XG4gICAgICB2YXIgdG9rZW4gPSAkc3RhdGVQYXJhbXMudG9rZW47XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgaWYgKHRva2VuKXtcbiAgICAgICAgQXV0aFNlcnZpY2UudmVyaWZ5KHRva2VuLFxuICAgICAgICAgIGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgJHNjb3BlLnN1Y2Nlc3MgPSB0cnVlO1xuXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24oZXJyKXtcblxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH1dKTsiXX0=
