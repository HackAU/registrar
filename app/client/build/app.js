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
    .factory('SettingsService', [
        '$http',
        function($http){

            var base = '/api/teams/';

            return {
                getTeams: function(){
                    return $http.get(base);
                },
                createTeam: function(data){
                    return $http.post(base, data);
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
  .controller('TeamsCtrl', [
    '$scope',
    'currentUser',
    'settings',
    'Utils',
    'UserService',
    'TeamService',
    'TEAM',
    function($scope, currentUser, settings, Utils, UserService, TeamService, TEAM){
      // Get the current user's most recent data.
      var Settings = settings.data;

      $scope.regIsOpen = Utils.isRegOpen(Settings);

      $scope.user = currentUser.data;

      $scope.TEAM = TEAM;

      TeamService.getTeams()
          .success(teams => {
              console.log(teams);
              $scope.teams = teams;
          })




    }]);

angular.module('reg')
  .controller('AdminCtrl', [
    '$scope',
    'UserService',
    function($scope, UserService){
      $scope.loading = true;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4tdmlld3MvdGVhbXMvdGVhbXNDdHJsLmpzIiwiYWRtaW4tdmlld3MvYWRtaW4vYWRtaW5DdHJsLmpzIiwiYWRtaW4tdmlld3MvYWRtaW4vc3RhdHMvYWRtaW5TdGF0c0N0cmwuanMiLCJhZG1pbi12aWV3cy9hZG1pbi9zZXR0aW5ncy9hZG1pblNldHRpbmdzQ3RybC5qcyIsImFkbWluLXZpZXdzL2FkbWluL3VzZXIvYWRtaW5Vc2VyQ3RybC5qcyIsImFkbWluLXZpZXdzL2FkbWluL3VzZXJzL2FkbWluVXNlcnNDdHJsLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DdHJsLmpzIiwiZGFzaGJvYXJkL2Rhc2hib2FyZEN0cmwuanMiLCJsb2dpbi9sb2dpbkN0cmwuanMiLCJjb25maXJtYXRpb24vY29uZmlybWF0aW9uQ3RybC5qcyIsInJlc2V0L3Jlc2V0Q3RybC5qcyIsInNpZGViYXIvc2lkZWJhckN0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIiwidmVyaWZ5L3ZlcmlmeUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBO0VBQ0E7OztBQUdBO0dBQ0EsT0FBQTtJQUNBO0lBQ0EsU0FBQSxjQUFBOzs7TUFHQSxjQUFBLGFBQUEsS0FBQTs7O0dBR0EsSUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLGFBQUEsUUFBQTs7O01BR0EsSUFBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLE1BQUE7UUFDQSxZQUFB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LEtBQUEsVUFBQSxTQUFBLFdBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxXQUFBLGNBQUE7TUFDQSxJQUFBLFdBQUE7UUFDQTs7OztJQUlBLEtBQUEsV0FBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsWUFBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsU0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLGNBQUEsS0FBQSxVQUFBO01BQ0EsV0FBQSxjQUFBOzs7O0FDckNBLFFBQUEsT0FBQTtHQUNBLFFBQUEsU0FBQTtJQUNBLFVBQUE7TUFDQSxPQUFBO1FBQ0EsV0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFlBQUEsS0FBQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxTQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQTs7UUFFQSxZQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLENBQUEsS0FBQTtZQUNBLE9BQUE7OztVQUdBLE9BQUEsSUFBQSxLQUFBOztVQUVBLE9BQUEsT0FBQSxNQUFBLE9BQUE7WUFDQSxNQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUE7Ozs7O0FDbkJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxHQUFBOztRQUVBLFFBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLEdBQUE7VUFDQSxHQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLGFBQUEsTUFBQSxHQUFBO1FBQ0EsT0FBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBO1VBQ0EsR0FBQTs7OztNQUlBLFlBQUEsb0JBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOztXQUVBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOzs7O01BSUEsWUFBQSxpQkFBQSxTQUFBLE9BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7O1dBRUEsUUFBQSxTQUFBLEtBQUE7WUFDQSxhQUFBLE1BQUE7O1dBRUEsTUFBQSxTQUFBLE1BQUEsV0FBQTtZQUNBLElBQUEsZUFBQSxJQUFBO2NBQ0EsUUFBQSxRQUFBOzs7OztNQUtBLFlBQUEsU0FBQSxTQUFBLFVBQUE7O1FBRUEsUUFBQSxRQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxZQUFBLFdBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsa0JBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTs7V0FFQSxRQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7V0FFQSxNQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7OztNQUlBLFlBQUEsU0FBQSxTQUFBLE9BQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLElBQUEsa0JBQUE7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLFFBQUEsUUFBQTtZQUNBLElBQUEsVUFBQTtjQUNBLFVBQUE7OztXQUdBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsSUFBQSxXQUFBO2NBQ0EsVUFBQTs7Ozs7TUFLQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUE7V0FDQSxNQUFBOzs7TUFHQSxPQUFBOzs7QUNuSEEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsZ0JBQUE7VUFDQSxNQUFBOzs7Ozs7OztBQzFDQSxRQUFBLE9BQUE7S0FDQSxRQUFBLG1CQUFBO1FBQ0E7UUFDQSxTQUFBLE1BQUE7O1lBRUEsSUFBQSxPQUFBOztZQUVBLE9BQUE7Z0JBQ0EsVUFBQSxVQUFBO29CQUNBLE9BQUEsTUFBQSxJQUFBOztnQkFFQSxZQUFBLFNBQUEsS0FBQTtvQkFDQSxPQUFBLE1BQUEsS0FBQSxNQUFBOzs7Ozs7O0FDWkEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxlQUFBO0VBQ0E7RUFDQTtFQUNBLFNBQUEsT0FBQSxRQUFBOztJQUVBLElBQUEsUUFBQTtJQUNBLElBQUEsT0FBQSxRQUFBOztJQUVBLE9BQUE7Ozs7O01BS0EsZ0JBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsUUFBQTs7O01BR0EsS0FBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7TUFHQSxRQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQTs7O01BR0EsU0FBQSxTQUFBLE1BQUEsTUFBQSxLQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsUUFBQSxNQUFBLEVBQUE7VUFDQTtZQUNBLE1BQUE7WUFDQSxNQUFBLE9BQUEsT0FBQTtZQUNBLE1BQUEsT0FBQSxPQUFBOzs7OztNQUtBLGVBQUEsU0FBQSxJQUFBLFFBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLEtBQUEsWUFBQTtVQUNBLFNBQUE7Ozs7TUFJQSxvQkFBQSxTQUFBLElBQUEsYUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO1VBQ0EsY0FBQTs7OztNQUlBLGtCQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7Ozs7O01BTUEsa0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBLGNBQUEsU0FBQTtVQUNBLE1BQUE7Ozs7TUFJQSxXQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsT0FBQSxPQUFBLFFBQUEsY0FBQTs7O01BR0EsZ0JBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsUUFBQSxjQUFBOzs7Ozs7O01BT0EsVUFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQTs7O01BR0EsV0FBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLFNBQUEsU0FBQSxHQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxVQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsWUFBQSxTQUFBLElBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7Ozs7Ozs7QUMxRkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLEtBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7O01BRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7TUFFQSxPQUFBLE9BQUEsWUFBQTs7TUFFQSxPQUFBLE9BQUE7O01BRUEsWUFBQTtXQUNBLFFBQUE7Ozs7Ozs7Ozs7QUNwQkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxZQUFBO01BQ0EsT0FBQSxVQUFBOztBQ0xBLFFBQUEsT0FBQTtHQUNBLFdBQUEsaUJBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUE7O01BRUE7U0FDQTtTQUNBLFFBQUEsU0FBQSxNQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxVQUFBOzs7TUFHQSxPQUFBLFVBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxPQUFBLE1BQUE7Ozs7QUNkQSxRQUFBLE9BQUE7R0FDQSxXQUFBLHFCQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLE1BQUEsZ0JBQUE7O01BRUEsT0FBQSxXQUFBO01BQ0E7U0FDQTtTQUNBLFFBQUEsU0FBQSxTQUFBO1VBQ0EsZUFBQTs7O01BR0EsU0FBQSxlQUFBLFNBQUE7UUFDQSxPQUFBLFVBQUE7O1FBRUEsU0FBQSxXQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxZQUFBLElBQUEsS0FBQSxTQUFBO1FBQ0EsU0FBQSxjQUFBLElBQUEsS0FBQSxTQUFBOztRQUVBLE9BQUEsV0FBQTs7Ozs7TUFLQTtTQUNBO1NBQ0EsUUFBQSxTQUFBLE9BQUE7VUFDQSxPQUFBLFlBQUEsT0FBQSxLQUFBOzs7TUFHQSxPQUFBLGtCQUFBLFVBQUE7UUFDQTtXQUNBLHdCQUFBLE9BQUEsVUFBQSxRQUFBLE1BQUEsSUFBQSxNQUFBO1dBQ0EsUUFBQSxTQUFBLFNBQUE7WUFDQSxLQUFBO1lBQ0EsT0FBQSxZQUFBLFNBQUEsa0JBQUEsS0FBQTs7Ozs7O01BTUEsT0FBQSxhQUFBLFNBQUEsS0FBQTtRQUNBLElBQUEsQ0FBQSxLQUFBO1VBQ0EsT0FBQTs7OztRQUlBLE9BQUEsT0FBQSxNQUFBLE9BQUE7VUFDQSxNQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLFVBQUEsS0FBQTtRQUNBLE9BQUEsSUFBQTtVQUNBLEtBQUE7VUFDQSxLQUFBO1VBQ0EsS0FBQTtVQUNBLEtBQUE7VUFDQSxLQUFBOzs7O01BSUEsT0FBQSwwQkFBQSxVQUFBOztRQUVBLElBQUEsT0FBQSxVQUFBLE9BQUEsU0FBQSxVQUFBO1FBQ0EsSUFBQSxRQUFBLFVBQUEsT0FBQSxTQUFBLFdBQUE7O1FBRUEsSUFBQSxPQUFBLEtBQUEsUUFBQSxLQUFBLFNBQUEsYUFBQSxVQUFBLFVBQUE7VUFDQSxPQUFBLEtBQUEsV0FBQSxrQ0FBQTs7UUFFQSxJQUFBLFFBQUEsTUFBQTtVQUNBLEtBQUEsV0FBQSw2Q0FBQTtVQUNBOzs7UUFHQTtXQUNBLHdCQUFBLE1BQUE7V0FDQSxRQUFBLFNBQUEsU0FBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLGVBQUEsOEJBQUE7Ozs7OztNQU1BLE9BQUEseUJBQUEsVUFBQTtRQUNBLElBQUEsWUFBQSxVQUFBLE9BQUEsU0FBQSxhQUFBOztRQUVBO1dBQ0EsdUJBQUE7V0FDQSxRQUFBLFNBQUEsU0FBQTtZQUNBLGVBQUE7WUFDQSxLQUFBLGdCQUFBLDZCQUFBOzs7Ozs7TUFNQSxJQUFBLFlBQUEsSUFBQSxTQUFBOztNQUVBLE9BQUEsa0JBQUEsU0FBQSxLQUFBO1FBQ0EsT0FBQSxLQUFBLFlBQUEsVUFBQSxTQUFBOzs7TUFHQSxPQUFBLHFCQUFBLFVBQUE7UUFDQSxJQUFBLE9BQUEsT0FBQSxTQUFBO1FBQ0E7V0FDQSxtQkFBQTtXQUNBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsS0FBQSxlQUFBLHlCQUFBO1lBQ0EsZUFBQTs7OztNQUlBLE9BQUEsdUJBQUEsVUFBQTtRQUNBLElB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OzttQkFFQSxNQUFBLFNBQUEsSUFBQTtvQkFDQSxLQUFBLGVBQUEsS0FBQSxRQUFBLE9BQUEsMkJBQUE7Ozs7Ozs7OztNQVNBLFNBQUEsV0FBQSxLQUFBO1FBQ0EsSUFBQSxNQUFBO1VBQ0EsT0FBQSxPQUFBLE1BQUEsT0FBQTs7OztNQUlBLE9BQUEsV0FBQSxTQUFBLE1BQUE7UUFDQSxJQUFBLEtBQUEsTUFBQTtVQUNBLE9BQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsV0FBQTtVQUNBLE9BQUE7O1FBRUEsSUFBQSxLQUFBLE9BQUEsWUFBQSxDQUFBLEtBQUEsT0FBQSxXQUFBO1VBQ0EsT0FBQTs7OztNQUlBLFNBQUEsV0FBQSxLQUFBO1FBQ0EsT0FBQSxlQUFBO1FBQ0EsT0FBQSxhQUFBLFdBQUEsaUJBQUE7UUFDQSxFQUFBO1dBQ0EsTUFBQTs7O01BR0EsU0FBQSxpQkFBQSxLQUFBO1FBQ0EsT0FBQTtVQUNBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsV0FBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxXQUFBLEtBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGNBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLFdBQUEsS0FBQSxPQUFBLGdCQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFlBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTs7O1lBR0E7WUFDQSxNQUFBO1lBQ0EsUUFBQTtjQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxvQkFBQSxLQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7OztZQUdBO1lBQ0EsTUFBQTtZQUNBLFFBQUE7Y0FDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxzQkFBQSxLQUFBLE9BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQSxVQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtBQUEsYUFBQSxRQUFBO2tCQUNBLEtB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QSxtQkFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsWUFBQSxTQUFBLE9BQUE7UUFDQSxJQUFBLE9BQUEsT0FBQTtRQUNBLFFBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBLEtBQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxhQUFBLEtBQUEsWUFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLENBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUE7Y0FDQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtjQUNBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBLFlBQUEsS0FBQSxPQUFBLGFBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxLQUFBLE9BQUE7O1FBRUEsT0FBQTs7O01BR0EsT0FBQSxlQUFBLENBQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7O01BRUEsT0FBQSxjQUFBLFVBQUE7UUFDQTtXQUNBO1dBQ0EsS0FBQSxVQUFBO1lBQ0EsV0FBQTs7Ozs7Ozs7TUFRQSxJQUFBLFlBQUEsSUFBQSxTQUFBO01BQ0EsT0FBQSxpQkFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLG1CQUFBLEtBQUEsWUFBQSxVQUFBLFNBQUEsU0FBQTtNQUNBLE9BQUEsZUFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7OztNQUdBLE9BQUEsbUJBQUEsVUFBQTs7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O0FDN0JBLFFBQUEsT0FBQTtHQUNBLFdBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxhQUFBLFVBQUEsT0FBQSxhQUFBLEtBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7O01BRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7TUFFQSxPQUFBLE9BQUEsWUFBQTs7TUFFQSxPQUFBLE9BQUE7O01BRUEsU0FBQSxxQkFBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsTUFBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsWUFBQTs7OztNQUlBLElBQUEsT0FBQSxLQUFBLFNBQUE7UUFDQTs7O01BR0EsT0FBQSxXQUFBLFVBQUE7UUFDQTtXQUNBLGlCQUFBLE9BQUE7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsT0FBQTtZQUNBOztXQUVBLE1BQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxRQUFBLElBQUE7Ozs7TUFJQSxPQUFBLFlBQUEsVUFBQTtRQUNBO1dBQ0E7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLE9BQUEsUUFBQTtZQUNBLE9BQUEsT0FBQTtZQUNBLE9BQUEsWUFBQTs7V0FFQSxNQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsUUFBQSxJQUFBLEtBQUE7Ozs7OztBQ3JEQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGNBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsY0FBQSxZQUFBO01BQ0EsSUFBQSxRQUFBLGFBQUE7O01BRUEsT0FBQSxVQUFBOztNQUVBLElBQUEsTUFBQTtRQUNBLFlBQUEsT0FBQTtVQUNBLFNBQUEsS0FBQTtZQUNBLE9BQUEsVUFBQTs7WUFFQSxPQUFBLFVBQUE7O1VBRUEsU0FBQSxJQUFBOztZQUVBLE9BQUEsVUFBQTs7OztRQUlBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgncmVnJywgW1xuICAndWkucm91dGVyJyxcbl0pO1xuXG5hcHBcbiAgLmNvbmZpZyhbXG4gICAgJyRodHRwUHJvdmlkZXInLFxuICAgIGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpe1xuXG4gICAgICAvLyBBZGQgYXV0aCB0b2tlbiB0byBBdXRob3JpemF0aW9uIGhlYWRlclxuICAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XG5cbiAgICB9XSlcbiAgLnJ1bihbXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICAnU2Vzc2lvbicsXG4gICAgZnVuY3Rpb24oQXV0aFNlcnZpY2UsIFNlc3Npb24pe1xuXG4gICAgICAvLyBTdGFydHVwLCBsb2dpbiBpZiB0aGVyZSdzICBhIHRva2VuLlxuICAgICAgdmFyIHRva2VuID0gU2Vzc2lvbi5nZXRUb2tlbigpO1xuICAgICAgaWYgKHRva2VuKXtcbiAgICAgICAgQXV0aFNlcnZpY2UubG9naW5XaXRoVG9rZW4odG9rZW4pO1xuICAgICAgfVxuXG4gIH1dKTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gICAgLmNvbnN0YW50KCdFVkVOVF9JTkZPJywge1xuICAgICAgICBOQU1FOiAnSGFja0FVIDIwMTcnLFxuICAgIH0pXG4gICAgLmNvbnN0YW50KCdEQVNIQk9BUkQnLCB7XG4gICAgICAgIFVOVkVSSUZJRUQ6ICdZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYW4gZW1haWwgYXNraW5nIHlvdSB2ZXJpZnkgeW91ciBlbWFpbC4gQ2xpY2sgdGhlIGxpbmsgaW4gdGhlIGVtYWlsIGFuZCB5b3UgY2FuIHN0YXJ0IHlvdXIgYXBwbGljYXRpb24hJyxcbiAgICAgICAgSU5DT01QTEVURV9USVRMRTogJ1lvdSBzdGlsbCBuZWVkIHRvIGNvbXBsZXRlIHlvdXIgYXBwbGljYXRpb24hJyxcbiAgICAgICAgSU5DT01QTEVURTogJ0lmIHlvdSBkbyBub3QgY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiBiZWZvcmUgdGhlIFtBUFBfREVBRExJTkVdLCB5b3Ugd2lsbCBub3QgYmUgY29uc2lkZXJlZCBmb3IgdGhlIGFkbWlzc2lvbnMgbG90dGVyeSEnLFxuICAgICAgICBTVUJNSVRURURfVElUTEU6ICdZb3VyIGFwcGxpY2F0aW9uIGhhcyBiZWVuIHN1Ym1pdHRlZCEnLFxuICAgICAgICBTVUJNSVRURUQ6ICdGZWVsIGZyZWUgdG8gZWRpdCBpdCBhdCBhbnkgdGltZS4gSG93ZXZlciwgb25jZSByZWdpc3RyYXRpb24gaXMgY2xvc2VkLCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBlZGl0IGl0IGFueSBmdXJ0aGVyLlxcbkFkbWlzc2lvbnMgd2lsbCBiZSBkZXRlcm1pbmVkIGJ5IGEgcmFuZG9tIGxvdHRlcnkuIFBsZWFzZSBtYWtlIHN1cmUgeW91ciBpbmZvcm1hdGlvbiBpcyBhY2N1cmF0ZSBiZWZvcmUgcmVnaXN0cmF0aW9uIGlzIGNsb3NlZCEnLFxuICAgICAgICBDTE9TRURfQU5EX0lOQ09NUExFVEVfVElUTEU6ICdVbmZvcnR1bmF0ZWx5LCByZWdpc3RyYXRpb24gaGFzIGNsb3NlZCwgYW5kIHRoZSBsb3R0ZXJ5IHByb2Nlc3MgaGFzIGJlZ3VuLicsXG4gICAgICAgIENMT1NFRF9BTkRfSU5DT01QTEVURTogJ0JlY2F1c2UgeW91IGhhdmUgbm90IGNvbXBsZXRlZCB5b3VyIHByb2ZpbGUgaW4gdGltZSwgeW91IHdpbGwgbm90IGJlIGVsaWdpYmxlIGZvciB0aGUgbG90dGVyeSBwcm9jZXNzLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5fQ09ORklSTV9USVRMRTogJ1lvdSBtdXN0IGNvbmZpcm0gYnkgW0NPTkZJUk1fREVBRExJTkVdLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTV9USVRMRTogJ1lvdXIgY29uZmlybWF0aW9uIGRlYWRsaW5lIG9mIFtDT05GSVJNX0RFQURMSU5FXSBoYXMgcGFzc2VkLicsXG4gICAgICAgIEFETUlUVEVEX0FORF9DQU5OT1RfQ09ORklSTTogJ0FsdGhvdWdoIHlvdSB3ZXJlIGFjY2VwdGVkLCB5b3UgZGlkIG5vdCBjb21wbGV0ZSB5b3VyIGNvbmZpcm1hdGlvbiBpbiB0aW1lLlxcblVuZm9ydHVuYXRlbHksIHRoaXMgbWVhbnMgdGhhdCB5b3Ugd2lsbCBub3QgYmUgYWJsZSB0byBhdHRlbmQgdGhlIGV2ZW50LCBhcyB3ZSBtdXN0IGJlZ2luIHRvIGFjY2VwdCBvdGhlciBhcHBsaWNhbnRzIG9uIHRoZSB3YWl0bGlzdC5cXG5XZSBob3BlIHRvIHNlZSB5b3UgYWdhaW4gbmV4dCB5ZWFyIScsXG4gICAgICAgIENPTkZJUk1FRF9OT1RfUEFTVF9USVRMRTogJ1lvdSBjYW4gZWRpdCB5b3VyIGNvbmZpcm1hdGlvbiBpbmZvcm1hdGlvbiB1bnRpbCBbQ09ORklSTV9ERUFETElORV0nLFxuICAgICAgICBERUNMSU5FRDogJ1dlXFwncmUgc29ycnkgdG8gaGVhciB0aGF0IHlvdSB3b25cXCd0IGJlIGFibGUgdG8gbWFrZSBpdCB0byBIYWNrTUlUIDIwMTUhIDooXFxuTWF5YmUgbmV4dCB5ZWFyISBXZSBob3BlIHlvdSBzZWUgeW91IGFnYWluIHNvb24uJyxcbiAgICB9KVxuICAgIC5jb25zdGFudCgnVEVBTScse1xuICAgICAgICBOT19URUFNX1JFR19DTE9TRUQ6ICdVbmZvcnR1bmF0ZWx5LCBpdFxcJ3MgdG9vIGxhdGUgdG8gZW50ZXIgdGhlIGxvdHRlcnkgd2l0aCBhIHRlYW0uXFxuSG93ZXZlciwgeW91IGNhbiBzdGlsbCBmb3JtIHRlYW1zIG9uIHlvdXIgb3duIGJlZm9yZSBvciBkdXJpbmcgdGhlIGV2ZW50IScsXG4gICAgfSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgICAuY29uZmlnKFtcbiAgICAgICAgJyRzdGF0ZVByb3ZpZGVyJyxcbiAgICAgICAgJyR1cmxSb3V0ZXJQcm92aWRlcicsXG4gICAgICAgICckbG9jYXRpb25Qcm92aWRlcicsXG4gICAgICAgIGZ1bmN0aW9uIChcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyLFxuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLFxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICAgICAgICAgICAgLy8gRm9yIGFueSB1bm1hdGNoZWQgdXJsLCByZWRpcmVjdCB0byAvc3RhdGUxXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiLzQwNFwiKTtcblxuICAgICAgICAgICAgLy8gU2V0IHVwIGRlIHN0YXRlc1xuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2xvZ2luL2xvZ2luLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2Jhc2UuaHRtbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NpZGViYXJAYXBwJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3NpZGViYXIvc2lkZWJhci5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpZGViYXJDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZXR0aW5ncyc6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTG9naW46IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuZGFzaGJvYXJkJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL1wiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9kYXNoYm9hcmQvZGFzaGJvYXJkLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0Rhc2hib2FyZEN0cmwnLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24gKFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hcHBsaWNhdGlvbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcHBsaWNhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBcHBsaWNhdGlvbkN0cmwnLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24gKFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGZ1bmN0aW9uIChTZXR0aW5nc1NlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gU2V0dGluZ3NTZXJ2aWNlLmdldFB1YmxpY1NldHRpbmdzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmNvbmZpcm1hdGlvbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9jb25maXJtYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb25maXJtYXRpb25DdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uIChVc2VyU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC50ZWFtJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3RlYW1cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdGVhbS90ZWFtLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RlYW1DdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZVZlcmlmaWVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbiAoVXNlclNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAudGVhbXMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVhbXNcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvdGVhbXMvdGVhbXMuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVGVhbXNDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVxdWlyZVZlcmlmaWVkOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbiAoVXNlclNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYWRtaW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluLXZpZXdzL2FkbWluL2FkbWluLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5DdHJsJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlQWRtaW46IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYWRtaW4uc3RhdHMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYWRtaW5cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvYWRtaW4vc3RhdHMvc3RhdHMuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5TdGF0c0N0cmwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hZG1pbi51c2VycycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycz9cIiArXG4gICAgICAgICAgICAgICAgICAgICcmcGFnZScgK1xuICAgICAgICAgICAgICAgICAgICAnJnNpemUnICtcbiAgICAgICAgICAgICAgICAgICAgJyZxdWVyeScsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluLXZpZXdzL2FkbWluL3VzZXJzL3VzZXJzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVXNlcnNDdHJsJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuYWRtaW4udXNlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hZG1pbi91c2Vycy86aWRcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvYWRtaW4vdXNlci91c2VyLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluVXNlckN0cmwnLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlcic6IGZ1bmN0aW9uICgkc3RhdGVQYXJhbXMsIFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldCgkc3RhdGVQYXJhbXMuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zZXR0aW5ncycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hZG1pbi9zZXR0aW5nc1wiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi12aWV3cy9hZG1pbi9zZXR0aW5ncy9zZXR0aW5ncy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblNldHRpbmdzQ3RybCcsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ3Jlc2V0Jywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3Jlc2V0Lzp0b2tlblwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9yZXNldC9yZXNldC5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXNldEN0cmwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgndmVyaWZ5Jywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3ZlcmlmeS86dG9rZW5cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvdmVyaWZ5L3ZlcmlmeS5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdWZXJpZnlDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJzQwNCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi80MDRcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvNDA0Lmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1dKVxuICAgIC5ydW4oW1xuICAgICAgICAnJHJvb3RTY29wZScsXG4gICAgICAgICckc3RhdGUnLFxuICAgICAgICAnU2Vzc2lvbicsXG4gICAgICAgIGZ1bmN0aW9uIChcbiAgICAgICAgICAgICRyb290U2NvcGUsXG4gICAgICAgICAgICAkc3RhdGUsXG4gICAgICAgICAgICBTZXNzaW9uKSB7XG5cbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcykge1xuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlTG9naW4gPSB0b1N0YXRlLmRhdGEucmVxdWlyZUxvZ2luO1xuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlQWRtaW4gPSB0b1N0YXRlLmRhdGEucmVxdWlyZUFkbWluO1xuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlVmVyaWZpZWQgPSB0b1N0YXRlLmRhdGEucmVxdWlyZVZlcmlmaWVkO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVMb2dpbiAmJiAhU2Vzc2lvbi5nZXRUb2tlbigpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZUFkbWluICYmICFTZXNzaW9uLmdldFVzZXIoKS5hZG1pbikge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZVZlcmlmaWVkICYmICFTZXNzaW9uLmdldFVzZXIoKS52ZXJpZmllZCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIFtcbiAgICAnU2Vzc2lvbicsXG4gICAgZnVuY3Rpb24oU2Vzc2lvbil7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKGNvbmZpZyl7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XG4gICAgICAgICAgICBpZiAodG9rZW4pe1xuICAgICAgICAgICAgICBjb25maWcuaGVhZGVyc1sneC1hY2Nlc3MtdG9rZW4nXSA9IHRva2VuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuc2VydmljZSgnU2Vzc2lvbicsIFtcbiAgICAnJHJvb3RTY29wZScsXG4gICAgJyR3aW5kb3cnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICR3aW5kb3cpe1xuXG4gICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbih0b2tlbiwgdXNlcil7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3QgPSB0b2tlbjtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnVzZXJJZCA9IHVzZXIuX2lkO1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgIH07XG5cbiAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbihvbkNvbXBsZXRlKXtcbiAgICAgIGRlbGV0ZSAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3Q7XG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyO1xuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IG51bGw7XG4gICAgICBpZiAob25Db21wbGV0ZSl7XG4gICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5nZXRUb2tlbiA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuand0O1xuICAgIH07XG5cbiAgICB0aGlzLmdldFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkO1xuICAgIH07XG5cbiAgICB0aGlzLmdldFVzZXIgPSBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIpO1xuICAgIH07XG5cbiAgICB0aGlzLnNldFVzZXIgPSBmdW5jdGlvbih1c2VyKXtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmN1cnJlbnRVc2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcik7XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICB9O1xuXG4gIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ1V0aWxzJywgW1xuICAgIGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1JlZ09wZW46IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSA+IHNldHRpbmdzLnRpbWVPcGVuICYmIERhdGUubm93KCkgPCBzZXR0aW5ncy50aW1lQ2xvc2U7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQWZ0ZXI6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gdGltZTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0VGltZTogZnVuY3Rpb24odGltZSl7XG5cbiAgICAgICAgICBpZiAoIXRpbWUpe1xuICAgICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBEYXRlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKHRpbWUpO1xuICAgICAgICAgIC8vIEhhY2sgZm9yIHRpbWV6b25lXG4gICAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mb3JtYXQoJ2RkZGQsIE1NTU0gRG8gWVlZWSwgaDptbSBhJykgK1xuICAgICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XG5cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5mYWN0b3J5KCdBdXRoU2VydmljZScsIFtcbiAgICAnJGh0dHAnLFxuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnJHdpbmRvdycsXG4gICAgJ1Nlc3Npb24nLFxuICAgIGZ1bmN0aW9uKCRodHRwLCAkcm9vdFNjb3BlLCAkc3RhdGUsICR3aW5kb3csIFNlc3Npb24pIHtcbiAgICAgIHZhciBhdXRoU2VydmljZSA9IHt9O1xuXG4gICAgICBmdW5jdGlvbiBsb2dpblN1Y2Nlc3MoZGF0YSwgY2Ipe1xuICAgICAgICAvLyBXaW5uZXIgd2lubmVyIHlvdSBnZXQgYSB0b2tlblxuICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLnRva2VuLCBkYXRhLnVzZXIpO1xuXG4gICAgICAgIGlmIChjYil7XG4gICAgICAgICAgY2IoZGF0YS51c2VyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBsb2dpbkZhaWx1cmUoZGF0YSwgY2Ipe1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKGRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luV2l0aFBhc3N3b3JkID0gZnVuY3Rpb24oZW1haWwsIHBhc3N3b3JkLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvbG9naW4nLCB7XG4gICAgICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgbG9naW5TdWNjZXNzKGRhdGEsIG9uU3VjY2Vzcyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBsb2dpbkZhaWx1cmUoZGF0YSwgb25GYWlsdXJlKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luV2l0aFRva2VuID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL2xvZ2luJywge1xuICAgICAgICAgICAgdG9rZW46IHRva2VuXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhkYXRhLCBvblN1Y2Nlc3MpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEsIHN0YXR1c0NvZGUpe1xuICAgICAgICAgICAgaWYgKHN0YXR1c0NvZGUgPT09IDQwMCl7XG4gICAgICAgICAgICAgIFNlc3Npb24uZGVzdHJveShsb2dpbkZhaWx1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UubG9nb3V0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHNlc3Npb25cbiAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGNhbGxiYWNrKTtcbiAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UucmVnaXN0ZXIgPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZWdpc3RlcicsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MoZGF0YSwgb25TdWNjZXNzKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGxvZ2luRmFpbHVyZShkYXRhLCBvbkZhaWx1cmUpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UudmVyaWZ5ID0gZnVuY3Rpb24odG9rZW4sIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5nZXQoJy9hdXRoL3ZlcmlmeS8nICsgdG9rZW4pXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICBTZXNzaW9uLnNldFVzZXIodXNlcik7XG4gICAgICAgICAgICBpZiAob25TdWNjZXNzKXtcbiAgICAgICAgICAgICAgb25TdWNjZXNzKHVzZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYgKG9uRmFpbHVyZSkge1xuICAgICAgICAgICAgICBvbkZhaWx1cmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCA9IGZ1bmN0aW9uKG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3ZlcmlmeS9yZXNlbmQnLCB7XG4gICAgICAgICAgICBpZDogU2Vzc2lvbi5nZXRVc2VySWQoKVxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2Uuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbihlbWFpbCl7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldCcsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZCA9IGZ1bmN0aW9uKHRva2VuLCBwYXNzLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSl7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9yZXNldC9wYXNzd29yZCcsIHtcbiAgICAgICAgICAgIHRva2VuOiB0b2tlbixcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3VjY2VzcyhvblN1Y2Nlc3MpXG4gICAgICAgICAgLmVycm9yKG9uRmFpbHVyZSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gYXV0aFNlcnZpY2U7XG4gICAgfVxuICBdKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ1NldHRpbmdzU2VydmljZScsIFtcbiAgJyRodHRwJyxcbiAgZnVuY3Rpb24oJGh0dHApe1xuXG4gICAgdmFyIGJhc2UgPSAnL2FwaS9zZXR0aW5ncy8nO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFB1YmxpY1NldHRpbmdzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzOiBmdW5jdGlvbihvcGVuLCBjbG9zZSl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd0aW1lcycsIHtcbiAgICAgICAgICB0aW1lT3Blbjogb3BlbixcbiAgICAgICAgICB0aW1lQ2xvc2U6IGNsb3NlLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVDb25maXJtYXRpb25UaW1lOiBmdW5jdGlvbih0aW1lKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm0tYnknLCB7XG4gICAgICAgICAgdGltZTogdGltZVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBnZXRXaGl0ZWxpc3RlZEVtYWlsczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgJ3doaXRlbGlzdCcpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVdoaXRlbGlzdGVkRW1haWxzOiBmdW5jdGlvbihlbWFpbHMpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnd2hpdGVsaXN0Jywge1xuICAgICAgICAgIGVtYWlsczogZW1haWxzXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZVdhaXRsaXN0VGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd3YWl0bGlzdCcsIHtcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUFjY2VwdGFuY2VUZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2FjY2VwdGFuY2UnLCB7XG4gICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGVDb25maXJtYXRpb25UZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ2NvbmZpcm1hdGlvbicsIHtcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgfVxuICBdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAgIC5mYWN0b3J5KCdTZXR0aW5nc1NlcnZpY2UnLCBbXG4gICAgICAgICckaHR0cCcsXG4gICAgICAgIGZ1bmN0aW9uKCRodHRwKXtcblxuICAgICAgICAgICAgdmFyIGJhc2UgPSAnL2FwaS90ZWFtcy8nO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldFRlYW1zOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY3JlYXRlVGVhbTogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UsIGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfVxuICAgIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5mYWN0b3J5KCdVc2VyU2VydmljZScsIFtcbiAgJyRodHRwJyxcbiAgJ1Nlc3Npb24nLFxuICBmdW5jdGlvbigkaHR0cCwgU2Vzc2lvbil7XG5cbiAgICB2YXIgdXNlcnMgPSAnL2FwaS91c2Vycyc7XG4gICAgdmFyIGJhc2UgPSB1c2VycyArICcvJztcblxuICAgIHJldHVybiB7XG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEJhc2ljIEFjdGlvbnNcbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGdldEN1cnJlbnRVc2VyOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldDogZnVuY3Rpb24oaWQpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBpZCk7XG4gICAgICB9LFxuXG4gICAgICBnZXRBbGw6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XG4gICAgICB9LFxuXG4gICAgICBnZXRQYWdlOiBmdW5jdGlvbihwYWdlLCBzaXplLCB0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCh1c2VycyArICc/JyArICQucGFyYW0oXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICAgIHBhZ2U6IHBhZ2UgPyBwYWdlIDogMCxcbiAgICAgICAgICAgIHNpemU6IHNpemUgPyBzaXplIDogNTBcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSxcblxuICAgICAgdXBkYXRlUHJvZmlsZTogZnVuY3Rpb24oaWQsIHByb2ZpbGUpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBpZCArICcvcHJvZmlsZScsIHtcbiAgICAgICAgICBwcm9maWxlOiBwcm9maWxlXG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgdXBkYXRlQ29uZmlybWF0aW9uOiBmdW5jdGlvbihpZCwgY29uZmlybWF0aW9uKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyAnL2NvbmZpcm0nLCB7XG4gICAgICAgICAgY29uZmlybWF0aW9uOiBjb25maXJtYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBkZWNsaW5lQWRtaXNzaW9uOiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvZGVjbGluZScpO1xuICAgICAgfSxcblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBUZWFtXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIGpvaW5PckNyZWF0ZVRlYW06IGZ1bmN0aW9uKGNvZGUpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy90ZWFtJywge1xuICAgICAgICAgIGNvZGU6IGNvZGVcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBsZWF2ZVRlYW06IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5kZWxldGUoYmFzZSArIFNlc3Npb24uZ2V0VXNlcklkKCkgKyAnL3RlYW0nKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldE15VGVhbW1hdGVzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy90ZWFtJyk7XG4gICAgICB9LFxuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBBZG1pbiBPbmx5XG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGdldFN0YXRzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyAnc3RhdHMnKTtcbiAgICAgIH0sXG5cbiAgICAgIGFkbWl0VXNlcjogZnVuY3Rpb24oaWQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyAnL2FkbWl0Jyk7XG4gICAgICB9LFxuXG4gICAgICBjaGVja0luOiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvY2hlY2tpbicpO1xuICAgICAgfSxcblxuICAgICAgY2hlY2tPdXQ6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgJy9jaGVja291dCcpO1xuICAgICAgfSxcblxuICAgICAgcmVtb3ZlVXNlcjogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgJy9yZW1vdmUnKTtcbiAgICAgIH1cblxuICAgIH07XG4gIH1cbiAgXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1RlYW1zQ3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgICdUZWFtU2VydmljZScsXG4gICAgJ1RFQU0nLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgVXNlclNlcnZpY2UsIFRlYW1TZXJ2aWNlLCBURUFNKXtcbiAgICAgIC8vIEdldCB0aGUgY3VycmVudCB1c2VyJ3MgbW9zdCByZWNlbnQgZGF0YS5cbiAgICAgIHZhciBTZXR0aW5ncyA9IHNldHRpbmdzLmRhdGE7XG5cbiAgICAgICRzY29wZS5yZWdJc09wZW4gPSBVdGlscy5pc1JlZ09wZW4oU2V0dGluZ3MpO1xuXG4gICAgICAkc2NvcGUudXNlciA9IGN1cnJlbnRVc2VyLmRhdGE7XG5cbiAgICAgICRzY29wZS5URUFNID0gVEVBTTtcblxuICAgICAgVGVhbVNlcnZpY2UuZ2V0VGVhbXMoKVxuICAgICAgICAgIC5zdWNjZXNzKHRlYW1zID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codGVhbXMpO1xuICAgICAgICAgICAgICAkc2NvcGUudGVhbXMgPSB0ZWFtcztcbiAgICAgICAgICB9KVxuXG5cblxuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pblN0YXRzQ3RybCcsW1xuICAgICckc2NvcGUnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU2VydmljZSl7XG5cbiAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgIC5nZXRTdGF0cygpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHN0YXRzKXtcbiAgICAgICAgICAkc2NvcGUuc3RhdHMgPSBzdGF0cztcbiAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgJHNjb3BlLmZyb21Ob3cgPSBmdW5jdGlvbihkYXRlKXtcbiAgICAgICAgcmV0dXJuIG1vbWVudChkYXRlKS5mcm9tTm93KCk7XG4gICAgICB9O1xuXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignQWRtaW5TZXR0aW5nc0N0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzY2UnLFxuICAgICdTZXR0aW5nc1NlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHNjZSwgU2V0dGluZ3NTZXJ2aWNlKXtcblxuICAgICAgJHNjb3BlLnNldHRpbmdzID0ge307XG4gICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgLmdldFB1YmxpY1NldHRpbmdzKClcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKXtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgIC8vIEZvcm1hdCB0aGUgZGF0ZXMgaW4gc2V0dGluZ3MuXG4gICAgICAgIHNldHRpbmdzLnRpbWVPcGVuID0gbmV3IERhdGUoc2V0dGluZ3MudGltZU9wZW4pO1xuICAgICAgICBzZXR0aW5ncy50aW1lQ2xvc2UgPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lQ2xvc2UpO1xuICAgICAgICBzZXR0aW5ncy50aW1lQ29uZmlybSA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVDb25maXJtKTtcblxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgIH1cblxuICAgICAgLy8gV2hpdGVsaXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAuZ2V0V2hpdGVsaXN0ZWRFbWFpbHMoKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihlbWFpbHMpe1xuICAgICAgICAgICRzY29wZS53aGl0ZWxpc3QgPSBlbWFpbHMuam9pbihcIiwgXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZVdoaXRlbGlzdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVXaGl0ZWxpc3RlZEVtYWlscygkc2NvcGUud2hpdGVsaXN0LnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJykpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgICAgc3dhbCgnV2hpdGVsaXN0IHVwZGF0ZWQuJyk7XG4gICAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gc2V0dGluZ3Mud2hpdGVsaXN0ZWRFbWFpbHMuam9pbihcIiwgXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgLy8gUmVnaXN0cmF0aW9uIFRpbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSl7XG4gICAgICAgIGlmICghZGF0ZSl7XG4gICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBEYXRlXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYWNrIGZvciB0aW1lem9uZVxuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXG4gICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XG4gICAgICB9O1xuXG4gICAgICAvLyBUYWtlIGEgZGF0ZSBhbmQgcmVtb3ZlIHRoZSBzZWNvbmRzLlxuICAgICAgZnVuY3Rpb24gY2xlYW5EYXRlKGRhdGUpe1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoXG4gICAgICAgICAgZGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgIGRhdGUuZ2V0TW9udGgoKSxcbiAgICAgICAgICBkYXRlLmdldERhdGUoKSxcbiAgICAgICAgICBkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgZGF0ZS5nZXRNaW51dGVzKClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGRhdGVzIGFuZCB0dXJuIHRoZW0gdG8gbXMuXG4gICAgICAgIHZhciBvcGVuID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lT3BlbikuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgY2xvc2UgPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVDbG9zZSkuZ2V0VGltZSgpO1xuXG4gICAgICAgIGlmIChvcGVuIDwgMCB8fCBjbG9zZSA8IDAgfHwgb3BlbiA9PT0gdW5kZWZpbmVkIHx8IGNsb3NlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgIHJldHVybiBzd2FsKCdPb3BzLi4uJywgJ1lvdSBuZWVkIHRvIGVudGVyIHZhbGlkIHRpbWVzLicsICdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcGVuID49IGNsb3NlKXtcbiAgICAgICAgICBzd2FsKCdPb3BzLi4uJywgJ1JlZ2lzdHJhdGlvbiBjYW5ub3Qgb3BlbiBhZnRlciBpdCBjbG9zZXMuJywgJ2Vycm9yJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzKG9wZW4sIGNsb3NlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKTtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIlJlZ2lzdHJhdGlvbiBUaW1lcyBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIENvbmZpcm1hdGlvbiBUaW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UaW1lID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGNvbmZpcm1CeSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZUNvbmZpcm0pLmdldFRpbWUoKTtcblxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uVGltZShjb25maXJtQnkpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgICAgICAgICAgc3dhbChcIlNvdW5kcyBnb29kIVwiLCBcIkNvbmZpcm1hdGlvbiBEYXRlIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgLy8gQWNjZXB0YW5jZSAvIENvbmZpcm1hdGlvbiBUZXh0IC0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcblxuICAgICAgJHNjb3BlLm1hcmtkb3duUHJldmlldyA9IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwodGV4dCkpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZVdhaXRsaXN0VGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLndhaXRsaXN0VGV4dDtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVdhaXRsaXN0VGV4dCh0ZXh0KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiV2FpdGxpc3QgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZUFjY2VwdGFuY2VUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWNjZXB0YW5jZVRleHQ7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVBY2NlcHRhbmNlVGV4dCh0ZXh0KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiQWNjZXB0YW5jZSBUZXh0IFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MoZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudXBkYXRlQ29uZmlybWF0aW9uVGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQ7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UZXh0KHRleHQpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJDb25maXJtYXRpb24gVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FkbWluVXNlckN0cmwnLFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJGh0dHAnLFxuICAgICd1c2VyJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsIFVzZXIsIFVzZXJTZXJ2aWNlKXtcbiAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIgPSBVc2VyLmRhdGE7XG5cbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzY2hvb2wgZHJvcGRvd25cbiAgICAgIHBvcHVsYXRlU2Nob29scygpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFRPRE86IEpBTksgV0FSTklOR1xuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBwb3B1bGF0ZVNjaG9vbHMoKXtcblxuICAgICAgICAkaHR0cFxuICAgICAgICAgIC5nZXQoJy9hc3NldHMvc2Nob29scy5qc29uJylcbiAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgdmFyIHNjaG9vbHMgPSByZXMuZGF0YTtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICRzY29wZS5zZWxlY3RlZFVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXTtcblxuICAgICAgICAgICAgaWYgKHNjaG9vbHNbZW1haWxdKXtcbiAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcbiAgICAgICAgICAgICAgJHNjb3BlLmF1dG9GaWxsZWRTY2hvb2wgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cblxuICAgICAgJHNjb3BlLnVwZGF0ZVByb2ZpbGUgPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC51cGRhdGVQcm9maWxlKCRzY29wZS5zZWxlY3RlZFVzZXIuX2lkLCAkc2NvcGUuc2VsZWN0ZWRVc2VyLnByb2ZpbGUpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAkc2VsZWN0ZWRVc2VyID0gZGF0YTtcbiAgICAgICAgICAgIHN3YWwoXCJVcGRhdGVkIVwiLCBcIlByb2ZpbGUgdXBkYXRlZC5cIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzd2FsKFwiT29wcywgeW91IGZvcmdvdCBzb21ldGhpbmcuXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FkbWluVXNlcnNDdHJsJyxbXG4gICAgJyRzY29wZScsXG4gICAgJyRzdGF0ZScsXG4gICAgJyRzdGF0ZVBhcmFtcycsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBVc2VyU2VydmljZSl7XG5cbiAgICAgICRzY29wZS5wYWdlcyA9IFtdO1xuICAgICAgJHNjb3BlLnVzZXJzID0gW107XG5cbiAgICAgIC8vIFNlbWFudGljLVVJIG1vdmVzIG1vZGFsIGNvbnRlbnQgaW50byBhIGRpbW1lciBhdCB0aGUgdG9wIGxldmVsLlxuICAgICAgLy8gV2hpbGUgdGhpcyBpcyB1c3VhbGx5IG5pY2UsIGl0IG1lYW5zIHRoYXQgd2l0aCBvdXIgcm91dGluZyB3aWxsIGdlbmVyYXRlXG4gICAgICAvLyBtdWx0aXBsZSBtb2RhbHMgaWYgeW91IGNoYW5nZSBzdGF0ZS4gS2lsbCB0aGUgdG9wIGxldmVsIGRpbW1lciBub2RlIG9uIGluaXRpYWwgbG9hZFxuICAgICAgLy8gdG8gcHJldmVudCB0aGlzLlxuICAgICAgJCgnLnVpLmRpbW1lcicpLnJlbW92ZSgpO1xuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNpemUgb2YgdGhlIG1vZGFsIGZvciB3aGVuIGl0IGFwcGVhcnMsIHdpdGggYW4gYXJiaXRyYXJ5IHVzZXIuXG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0ge307XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyLnNlY3Rpb25zID0gZ2VuZXJhdGVTZWN0aW9ucyh7c3RhdHVzOiAnJywgY29uZmlybWF0aW9uOiB7XG4gICAgICAgIGRpZXRhcnlSZXN0cmljdGlvbnM6IFtdXG4gICAgICB9LCBwcm9maWxlOiAnJ30pO1xuXG4gICAgICBmdW5jdGlvbiB1cGRhdGVQYWdlKGRhdGEpe1xuICAgICAgICAkc2NvcGUudXNlcnMgPSBkYXRhLnVzZXJzO1xuICAgICAgICAkc2NvcGUuY3VycmVudFBhZ2UgPSBkYXRhLnBhZ2U7XG4gICAgICAgICRzY29wZS5wYWdlU2l6ZSA9IGRhdGEuc2l6ZTtcblxuICAgICAgICB2YXIgcCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEudG90YWxQYWdlczsgaSsrKXtcbiAgICAgICAgICBwLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgJHNjb3BlLnBhZ2VzID0gcDtcbiAgICAgIH1cblxuICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgLmdldFBhZ2UoJHN0YXRlUGFyYW1zLnBhZ2UsICRzdGF0ZVBhcmFtcy5zaXplLCAkc3RhdGVQYXJhbXMucXVlcnkpXG4gICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIHVwZGF0ZVBhZ2UoZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuJHdhdGNoKCdxdWVyeVRleHQnLCBmdW5jdGlvbihxdWVyeVRleHQpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgcXVlcnlUZXh0KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgdXBkYXRlUGFnZShkYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuZ29Ub1BhZ2UgPSBmdW5jdGlvbihwYWdlKXtcbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuYWRtaW4udXNlcnMnLCB7XG4gICAgICAgICAgcGFnZTogcGFnZSxcbiAgICAgICAgICBzaXplOiAkc3RhdGVQYXJhbXMuc2l6ZSB8fCA1MFxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5nb1VzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIpe1xuICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgJHN0YXRlLmdvKCdhcHAuYWRtaW4udXNlcicsIHtcbiAgICAgICAgICBpZDogdXNlci5faWRcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudG9nZ2xlQ2hlY2tJbiA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGlmICghdXNlci5zdGF0dXMuY2hlY2tlZEluKXtcbiAgICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgICB0ZXh0OiBcIllvdSBhcmUgYWJvdXQgdG8gY2hlY2sgaW4gXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgY2hlY2sgdGhlbSBpbi5cIixcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgICAgLmNoZWNrSW4odXNlci5faWQpXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gdXNlcjtcbiAgICAgICAgICAgICAgICAgIHN3YWwoXCJDaGVja2VkIGluXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBoYXMgYmVlbiBjaGVja2VkIGluLicsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBzd2FsKFwiTm90IGNoZWNrZWQgaW5cIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBjaGVja2VkIGluLiAnLCBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgICAgLmNoZWNrT3V0KHVzZXIuX2lkKVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSB1c2VyO1xuICAgICAgICAgICAgICBzd2FsKFwiQ2hlY2tlZCBvdXRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGhhcyBiZWVuIGNoZWNrZWQgb3V0LicsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIk5vdCBjaGVja2VkIG91dFwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgY291bGQgbm90IGJlIGNoZWNrZWQgb3V0LiAnLCBcImVycm9yXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5hY2NlcHRVc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyLCBpbmRleCkge1xuICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgLy8gaWYgKCF1c2VyLnN0YXR1cy5hZG1pdHRlZCl7XG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGFjY2VwdCBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgYWNjZXB0IHRoZW0uXCIsXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIGFjY2VwdGVkIHRoaXMgdXNlci4gXCIgK1xuICAgICAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGFjY2VwdCB0aGlzIHVzZXIuXCIsXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgICAgIC5hZG1pdFVzZXIodXNlci5faWQpXG4gICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHVzZXI7XG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJBY2NlcHRlZFwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgaGFzIGJlZW4gYWRtaXR0ZWQuJywgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBzd2FsKFwiTm90IGFkbWl0dGVkXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBjb3VsZCBub3QgYmUgYWRtaXR0ZWQuICcsIFwiZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgICAvLyAgICAgLy8gdW5hZG1pdCB1c2VyXG4gICAgICAgICAgICAgIFxuICAgICAgICAgIC8vIH1cblxuICAgICAgfTtcblxuICAgICAgLy8gZGVsZXRlIFVzZXIgZnJvbSByZWNvcmRzXG4gICAgICAkc2NvcGUucmVtb3ZlVXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHN3YWwoe1xuICAgICAgICAgIHRpdGxlOiBcIldob2EsIHdhaXQgYSBtaW51dGUhXCIsXG4gICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGRlbGV0ZSBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIhXCIsXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgZGVsZXRlIHVzZXIuXCIsXG4gICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkFyZSB5b3Ugc3VyZT9cIixcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3VyIGFjY291bnQgd2lsbCBiZSBsb2dnZWQgYXMgaGF2aW5nIGRlbGV0ZWQgdGhpcyB1c2VyLiBcIiArXG4gICAgICAgICAgICAgICAgXCJSZW1lbWJlciwgdGhpcyBwb3dlciBpcyBhIHByaXZpbGVnZS5cIixcbiAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgZGVsZXRlIHRoaXMgdXNlci5cIixcbiAgICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlXG4gICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgICAgICAgICAgLnJlbW92ZVVzZXIodXNlci5faWQpXG4gICAgICAgICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJzLnNwbGljZShpbmRleCwxKTtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIkRlbGV0ZWRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGhhcyBiZWVuIGRlbGV0ZWQuJywgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBzd2FsKFwiTm90IGRlbGV0ZWRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBkZWxldGVkLiAnLCBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9KTtcblxuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gZm9ybWF0VGltZSh0aW1lKXtcbiAgICAgICAgaWYgKHRpbWUpIHtcbiAgICAgICAgICByZXR1cm4gbW9tZW50KHRpbWUpLmZvcm1hdCgnTU1NTSBEbyBZWVlZLCBoOm1tOnNzIGEnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAkc2NvcGUucm93Q2xhc3MgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgIGlmICh1c2VyLmFkbWluKXtcbiAgICAgICAgICByZXR1cm4gJ2FkbWluJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodXNlci5zdGF0dXMuY29uZmlybWVkKSB7XG4gICAgICAgICAgcmV0dXJuICdwb3NpdGl2ZSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmICF1c2VyLnN0YXR1cy5jb25maXJtZWQpIHtcbiAgICAgICAgICByZXR1cm4gJ3dhcm5pbmcnO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBzZWxlY3RVc2VyKHVzZXIpe1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gdXNlcjtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnModXNlcik7XG4gICAgICAgICQoJy5sb25nLnVzZXIubW9kYWwnKVxuICAgICAgICAgIC5tb2RhbCgnc2hvdycpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpe1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdCYXNpYyBJbmZvJyxcbiAgICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NyZWF0ZWQgT24nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIudGltZXN0YW1wKVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTGFzdCBVcGRhdGVkJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLmxhc3RVcGRhdGVkKVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQ29uZmlybSBCeScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY29uZmlybUJ5KSB8fCAnTi9BJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQ2hlY2tlZCBJbicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5zdGF0dXMuY2hlY2tJblRpbWUpIHx8ICdOL0EnXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdFbWFpbCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuZW1haWxcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1RlYW0nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnRlYW1Db2RlIHx8ICdOb25lJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBuYW1lOiAnUHJvZmlsZScsXG4gICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLm5hbWVcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0dlbmRlcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5nZW5kZXJcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1NjaG9vbCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5zY2hvb2xcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0dyYWR1YXRpb24gWWVhcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5ncmFkdWF0aW9uWWVhclxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnRGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0Vzc2F5JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmVzc2F5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIG5hbWU6ICdDb25maXJtYXRpb24nLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnUGhvbmUgTnVtYmVyJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ucGhvbmVOdW1iZXJcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0RpZXRhcnkgUmVzdHJpY3Rpb25zJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucy5qb2luKCcsICcpXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdTaGlydCBTaXplJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uc2hpcnRTaXplXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdNYWpvcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm1ham9yXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHaXRodWInLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5naXRodWJcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1dlYnNpdGUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi53ZWJzaXRlXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBIYXJkd2FyZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5lZWRzSGFyZHdhcmUsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdIYXJkd2FyZSBSZXF1ZXN0ZWQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5oYXJkd2FyZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBuYW1lOiAnSG9zdGluZycsXG4gICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBIb3N0aW5nIEZyaWRheScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhvc3ROZWVkZWRGcmksXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBIb3N0aW5nIFNhdHVyZGF5JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaG9zdE5lZWRlZFNhdCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0dlbmRlciBOZXV0cmFsJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uZ2VuZGVyTmV1dHJhbCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NhdCBGcmllbmRseScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmNhdEZyaWVuZGx5LFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnU21va2luZyBGcmllbmRseScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnNtb2tpbmdGcmllbmRseSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0hvc3RpbmcgTm90ZXMnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ob3N0Tm90ZXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgbmFtZTogJ1RyYXZlbCcsXG4gICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdOZWVkcyBSZWltYnVyc2VtZW50JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ubmVlZHNSZWltYnVyc2VtZW50LFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnUmVjZWl2ZWQgUmVpbWJ1cnNlbWVudCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5lZWRzUmVpbWJ1cnNlbWVudCAmJiB1c2VyLnN0YXR1cy5yZWltYnVyc2VtZW50R2l2ZW5cbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0FkZHJlc3MnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzID8gW1xuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5saW5lMSxcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3MubGluZTIsXG4gICAgICAgICAgICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzLmNpdHksXG4gICAgICAgICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzLnN0YXRlLFxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy56aXAsXG4gICAgICAgICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzLmNvdW50cnksXG4gICAgICAgICAgICAgICAgXS5qb2luKCcgJykgOiAnJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnQWRkaXRpb25hbCBOb3RlcycsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5vdGVzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5zZWxlY3RVc2VyID0gc2VsZWN0VXNlcjtcblxuICAgIH1dKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBcHBsaWNhdGlvbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICckaHR0cCcsXG4gICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdTZXNzaW9uJyxcbiAgICAnVXNlclNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkaHR0cCwgY3VycmVudFVzZXIsIFNldHRpbmdzLCBTZXNzaW9uLCBVc2VyU2VydmljZSl7XG5cbiAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuXG4gICAgICAvLyBJcyB0aGUgc3R1ZGVudCBmcm9tIE1JVD9cbiAgICAgICRzY29wZS5pc01pdFN0dWRlbnQgPSAkc2NvcGUudXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdID09ICdtaXQuZWR1JztcblxuICAgICAgLy8gSWYgc28sIGRlZmF1bHQgdGhlbSB0byBhZHVsdDogdHJ1ZVxuICAgICAgaWYgKCRzY29wZS5pc01pdFN0dWRlbnQpe1xuICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLmFkdWx0ID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gUG9wdWxhdGUgdGhlIHNjaG9vbCBkcm9wZG93blxuICAgICAgcG9wdWxhdGVTY2hvb2xzKCk7XG4gICAgICBfc2V0dXBGb3JtKCk7XG5cbiAgICAgICRzY29wZS5yZWdJc0Nsb3NlZCA9IERhdGUubm93KCkgPiBTZXR0aW5ncy5kYXRhLnRpbWVDbG9zZTtcblxuICAgICAgLyoqXG4gICAgICAgKiBUT0RPOiBKQU5LIFdBUk5JTkdcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVTY2hvb2xzKCl7XG5cbiAgICAgICAgJGh0dHBcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuanNvbicpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHZhciBzY2hvb2xzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUudXNlci5lbWFpbC5zcGxpdCgnQCcpWzFdO1xuXG4gICAgICAgICAgICBpZiAoc2Nob29sc1tlbWFpbF0pe1xuICAgICAgICAgICAgICAkc2NvcGUudXNlci5wcm9maWxlLnNjaG9vbCA9IHNjaG9vbHNbZW1haWxdLnNjaG9vbDtcbiAgICAgICAgICAgICAgJHNjb3BlLmF1dG9GaWxsZWRTY2hvb2wgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdXBkYXRlVXNlcihlKXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlUHJvZmlsZShTZXNzaW9uLmdldFVzZXJJZCgpLCAkc2NvcGUudXNlci5wcm9maWxlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dlZXRBbGVydCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIkF3ZXNvbWUhXCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBhcHBsaWNhdGlvbiBoYXMgYmVlbiBzYXZlZC5cIixcbiAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjZTc2NDgyXCJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoXCJVaCBvaCFcIiwgXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIiwgXCJlcnJvclwiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3NldHVwRm9ybSgpe1xuICAgICAgICAvLyBTZW1hbnRpYy1VSSBmb3JtIHZhbGlkYXRpb25cbiAgICAgICAgJCgnLnVpLmZvcm0nKS5mb3JtKHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ25hbWUnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBuYW1lLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzY2hvb2w6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NjaG9vbCcsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBlbnRlciB5b3VyIHNjaG9vbCBuYW1lLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB5ZWFyOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICd5ZWFyJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCB5b3VyIGdyYWR1YXRpb24geWVhci4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2VuZGVyOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdnZW5kZXInLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2Ugc2VsZWN0IGEgZ2VuZGVyLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZHVsdDoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnYWR1bHQnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaGVja2VkJyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1lvdSBtdXN0IGJlIGFuIGFkdWx0LCBvciBhbiBNSVQgc3R1ZGVudC4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuXG5cbiAgICAgICRzY29wZS5zdWJtaXRGb3JtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSl7XG4gICAgICAgICAgX3VwZGF0ZVVzZXIoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZEN0cmwnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc2NvcGUnLFxuICAgICckc2NlJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgJ0VWRU5UX0lORk8nLFxuICAgICdEQVNIQk9BUkQnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHNjZSwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIFVzZXJTZXJ2aWNlLCBEQVNIQk9BUkQpe1xuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcbiAgICAgIHZhciB1c2VyID0gY3VycmVudFVzZXIuZGF0YTtcbiAgICAgICRzY29wZS51c2VyID0gdXNlcjtcblxuICAgICAgJHNjb3BlLkRBU0hCT0FSRCA9IERBU0hCT0FSRDtcbiAgICAgIFxuICAgICAgZm9yICh2YXIgbXNnIGluICRzY29wZS5EQVNIQk9BUkQpIHtcbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0FQUF9ERUFETElORV0nKSkge1xuICAgICAgICAgICRzY29wZS5EQVNIQk9BUkRbbXNnXSA9ICRzY29wZS5EQVNIQk9BUkRbbXNnXS5yZXBsYWNlKCdbQVBQX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNsb3NlKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0NPTkZJUk1fREVBRExJTkVdJykpIHtcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0NPTkZJUk1fREVBRExJTkVdJywgVXRpbHMuZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jb25maXJtQnkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cbiAgICAgIHZhciByZWdJc09wZW4gPSAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgLy8gSXMgaXQgcGFzdCB0aGUgdXNlcidzIGNvbmZpcm1hdGlvbiB0aW1lP1xuICAgICAgdmFyIHBhc3RDb25maXJtYXRpb24gPSAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcblxuICAgICAgJHNjb3BlLmRhc2hTdGF0ZSA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gICAgICAgIHZhciB1c2VyID0gJHNjb3BlLnVzZXI7XG4gICAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgICAgICAgY2FzZSAndW52ZXJpZmllZCc6XG4gICAgICAgICAgICByZXR1cm4gIXVzZXIudmVyaWZpZWQ7XG4gICAgICAgICAgY2FzZSAnb3BlbkFuZEluY29tcGxldGUnOlxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnZlcmlmaWVkICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlO1xuICAgICAgICAgIGNhc2UgJ29wZW5BbmRTdWJtaXR0ZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRJbmNvbXBsZXRlJzpcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRTdWJtaXR0ZWQnOiAvLyBXYWl0bGlzdGVkIFN0YXRlXG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZEFuZENhbkNvbmZpcm0nOlxuICAgICAgICAgICAgcmV0dXJuICFwYXN0Q29uZmlybWF0aW9uICYmXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2Fubm90Q29uZmlybSc6XG4gICAgICAgICAgICByZXR1cm4gcGFzdENvbmZpcm1hdGlvbiAmJlxuICAgICAgICAgICAgICB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJlxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcbiAgICAgICAgICBjYXNlICdjb25maXJtZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmIHVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJiAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XG4gICAgICAgICAgY2FzZSAnZGVjbGluZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93V2FpdGxpc3QgPSAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuXG4gICAgICAkc2NvcGUucmVzZW5kRW1haWwgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZVxuICAgICAgICAgIC5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCgpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ1lvdXIgZW1haWwgaGFzIGJlZW4gc2VudC4nKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIFRleHQhXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcbiAgICAgICRzY29wZS5hY2NlcHRhbmNlVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmFjY2VwdGFuY2VUZXh0KSk7XG4gICAgICAkc2NvcGUuY29uZmlybWF0aW9uVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQpKTtcbiAgICAgICRzY29wZS53YWl0bGlzdFRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy53YWl0bGlzdFRleHQpKTtcblxuXG4gICAgICAkc2NvcGUuZGVjbGluZUFkbWlzc2lvbiA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSFcIixcbiAgICAgICAgICB0ZXh0OiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBkZWNsaW5lIHlvdXIgYWRtaXNzaW9uPyBcXG5cXG4gWW91IGNhbid0IGdvIGJhY2shXCIsXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgSSBjYW4ndCBtYWtlIGl0LlwiLFxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiB0cnVlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgLmRlY2xpbmVBZG1pc3Npb24odXNlci5faWQpXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignTG9naW5DdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyRzdGF0ZScsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnVXRpbHMnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlKXtcblxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XG5cbiAgICAgIC8vIFN0YXJ0IHN0YXRlIGZvciBsb2dpblxuICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSAnbG9naW4nO1xuXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlc2V0RXJyb3IoKXtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRFcnJvcigpO1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZChcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJlc2V0RXJyb3IoKTtcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2V0TG9naW5TdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICRzY29wZS5sb2dpblN0YXRlID0gc3RhdGU7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLmVtYWlsO1xuICAgICAgICBBdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbChlbWFpbCk7XG4gICAgICAgIHN3ZWV0QWxlcnQoe1xuICAgICAgICAgIHRpdGxlOiBcIkRvbid0IFN3ZWF0IVwiLFxuICAgICAgICAgIHRleHQ6IFwiQW4gZW1haWwgc2hvdWxkIGJlIHNlbnQgdG8geW91IHNob3J0bHkuXCIsXG4gICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNlNzY0ODJcIlxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XG4gIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdDb25maXJtYXRpb25DdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdVdGlscycsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgY3VycmVudFVzZXIsIFV0aWxzLCBVc2VyU2VydmljZSl7XG5cbiAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IERhdGUubm93KCkgPiB1c2VyLnN0YXR1cy5jb25maXJtQnk7XG5cbiAgICAgICRzY29wZS5mb3JtYXRUaW1lID0gVXRpbHMuZm9ybWF0VGltZTtcblxuICAgICAgX3NldHVwRm9ybSgpO1xuXG4gICAgICAkc2NvcGUuZmlsZU5hbWUgPSB1c2VyLl9pZCArIFwiX1wiICsgdXNlci5wcm9maWxlLm5hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJfXCIpO1xuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBBbGwgdGhpcyBqdXN0IGZvciBkaWV0YXJ5IHJlc3RyaWN0aW9uIGNoZWNrYm94ZXMgZm1sXG5cbiAgICAgIHZhciBkaWV0YXJ5UmVzdHJpY3Rpb25zID0ge1xuICAgICAgICAnVmVnZXRhcmlhbic6IGZhbHNlLFxuICAgICAgICAnVmVnYW4nOiBmYWxzZSxcbiAgICAgICAgJ0hhbGFsJzogZmFsc2UsXG4gICAgICAgICdLb3NoZXInOiBmYWxzZSxcbiAgICAgICAgJ051dCBBbGxlcmd5JzogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIGlmICh1c2VyLmNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zKXtcbiAgICAgICAgdXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3RyaWN0aW9uKXtcbiAgICAgICAgICBpZiAocmVzdHJpY3Rpb24gaW4gZGlldGFyeVJlc3RyaWN0aW9ucyl7XG4gICAgICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zW3Jlc3RyaWN0aW9uXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMgPSBkaWV0YXJ5UmVzdHJpY3Rpb25zO1xuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGZ1bmN0aW9uIF91cGRhdGVVc2VyKGUpe1xuICAgICAgICB2YXIgY29uZmlybWF0aW9uID0gJHNjb3BlLnVzZXIuY29uZmlybWF0aW9uO1xuICAgICAgICAvLyBHZXQgdGhlIGRpZXRhcnkgcmVzdHJpY3Rpb25zIGFzIGFuIGFycmF5XG4gICAgICAgIHZhciBkcnMgPSBbXTtcbiAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICBpZiAoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnNba2V5XSl7XG4gICAgICAgICAgICBkcnMucHVzaChrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zID0gZHJzO1xuXG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvbih1c2VyLl9pZCwgY29uZmlybWF0aW9uKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dlZXRBbGVydCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIldvbyFcIixcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3UncmUgY29uZmlybWVkIVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNlNzY0ODJcIlxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgc3dlZXRBbGVydChcIlVoIG9oIVwiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiLCBcImVycm9yXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfc2V0dXBGb3JtKCl7XG4gICAgICAgIC8vIFNlbWFudGljLVVJIGZvcm0gdmFsaWRhdGlvblxuICAgICAgICAkKCcudWkuZm9ybScpLmZvcm0oe1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc2hpcnQ6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NoaXJ0JyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGdpdmUgdXMgYSBzaGlydCBzaXplISdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwaG9uZToge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAncGhvbmUnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSBwaG9uZSBudW1iZXIuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpZ25hdHVyZUxpYWJpbGl0eToge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2lnbmF0dXJlTGlhYmlsaXR5V2FpdmVyJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmF0dXJlUGhvdG9SZWxlYXNlOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVQaG90b1JlbGVhc2UnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIGRpZ2l0YWwgc2lnbmF0dXJlLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWduYXR1cmVDb2RlT2ZDb25kdWN0OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVDb2RlT2ZDb25kdWN0JyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5zdWJtaXRGb3JtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSl7XG4gICAgICAgICAgX3VwZGF0ZVVzZXIoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1Jlc2V0Q3RybCcsIFtcbiAgICAnJHNjb3BlJyxcbiAgICAnJHN0YXRlUGFyYW1zJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkc3RhdGUsIEF1dGhTZXJ2aWNlKXtcbiAgICAgIHZhciB0b2tlbiA9ICRzdGF0ZVBhcmFtcy50b2tlbjtcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAkc2NvcGUuY2hhbmdlUGFzc3dvcmQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgcGFzc3dvcmQgPSAkc2NvcGUucGFzc3dvcmQ7XG4gICAgICAgIHZhciBjb25maXJtID0gJHNjb3BlLmNvbmZpcm07XG5cbiAgICAgICAgaWYgKHBhc3N3b3JkICE9PSBjb25maXJtKXtcbiAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBcIlBhc3N3b3JkcyBkb24ndCBtYXRjaCFcIjtcbiAgICAgICAgICAkc2NvcGUuY29uZmlybSA9IFwiXCI7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgQXV0aFNlcnZpY2UucmVzZXRQYXNzd29yZChcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAkc2NvcGUucGFzc3dvcmQsXG4gICAgICAgICAgZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICAgICAgICBzd2VldEFsZXJ0KHtcbiAgICAgICAgICAgICAgdGl0bGU6IFwiTmVhdG8hXCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBwYXNzd29yZCBoYXMgYmVlbiBjaGFuZ2VkIVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNlNzY0ODJcIlxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IGRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignU2lkZWJhckN0cmwnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc2NvcGUnLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdTZXNzaW9uJyxcbiAgICAnRVZFTlRfSU5GTycsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCBTZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlLCBTZXNzaW9uLCBFVkVOVF9JTkZPKXtcblxuICAgICAgdmFyIHNldHRpbmdzID0gU2V0dGluZ3MuZGF0YTtcbiAgICAgIHZhciB1c2VyID0gJHJvb3RTY29wZS5jdXJyZW50VXNlcjtcblxuICAgICAgJHNjb3BlLkVWRU5UX0lORk8gPSBFVkVOVF9JTkZPO1xuXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcblxuICAgICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gZmFsc2U7XG4gICAgICAkc2NvcGUudG9nZ2xlU2lkZWJhciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5zaG93U2lkZWJhciA9ICEkc2NvcGUuc2hvd1NpZGViYXI7XG4gICAgICB9O1xuXG4gICAgICAvLyBvaCBnb2QgalF1ZXJ5IGhhY2tcbiAgICAgICQoJy5pdGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLnNob3dTaWRlYmFyID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignVGVhbUN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdVdGlscycsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICAnVEVBTScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBjdXJyZW50VXNlciwgc2V0dGluZ3MsIFV0aWxzLCBVc2VyU2VydmljZSwgVEVBTSl7XG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuXG4gICAgICAkc2NvcGUuVEVBTSA9IFRFQU07XG5cbiAgICAgIGZ1bmN0aW9uIF9wb3B1bGF0ZVRlYW1tYXRlcygpIHtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAuZ2V0TXlUZWFtbWF0ZXMoKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXJzKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAgICAgICAkc2NvcGUudGVhbW1hdGVzID0gdXNlcnM7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgkc2NvcGUudXNlci50ZWFtQ29kZSl7XG4gICAgICAgIF9wb3B1bGF0ZVRlYW1tYXRlcygpO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuam9pblRlYW0gPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5qb2luT3JDcmVhdGVUZWFtKCRzY29wZS5jb2RlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgIF9wb3B1bGF0ZVRlYW1tYXRlcygpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSByZXMubWVzc2FnZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5sZWF2ZVRlYW0gPSBmdW5jdGlvbigpe1xuICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgIC5sZWF2ZVRlYW0oKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICRzY29wZS50ZWFtbWF0ZXMgPSBbXTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzLmRhdGEubWVzc2FnZTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1ZlcmlmeUN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzdGF0ZVBhcmFtcycsXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgQXV0aFNlcnZpY2Upe1xuICAgICAgdmFyIHRva2VuID0gJHN0YXRlUGFyYW1zLnRva2VuO1xuXG4gICAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG5cbiAgICAgIGlmICh0b2tlbil7XG4gICAgICAgIEF1dGhTZXJ2aWNlLnZlcmlmeSh0b2tlbixcbiAgICAgICAgICBmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICRzY29wZS5zdWNjZXNzID0gdHJ1ZTtcblxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uKGVycil7XG5cbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9XSk7Il19
