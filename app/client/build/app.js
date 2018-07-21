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
    .factory('TeamService', [
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnN0YW50cy5qcyIsInJvdXRlcy5qcyIsImludGVyY2VwdG9ycy9BdXRoSW50ZXJjZXB0b3IuanMiLCJtb2R1bGVzL1Nlc3Npb24uanMiLCJtb2R1bGVzL1V0aWxzLmpzIiwic2VydmljZXMvQXV0aFNlcnZpY2UuanMiLCJzZXJ2aWNlcy9TZXR0aW5nc1NlcnZpY2UuanMiLCJzZXJ2aWNlcy9UZWFtU2VydmljZS5qcyIsInNlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwiYWRtaW4tdmlld3MvYWRtaW4vYWRtaW5DdHJsLmpzIiwiYWRtaW4tdmlld3MvdGVhbXMvdGVhbXNDdHJsLmpzIiwiYWRtaW4tdmlld3MvYWRtaW4vc2V0dGluZ3MvYWRtaW5TZXR0aW5nc0N0cmwuanMiLCJhZG1pbi12aWV3cy9hZG1pbi9zdGF0cy9hZG1pblN0YXRzQ3RybC5qcyIsImFkbWluLXZpZXdzL2FkbWluL3VzZXIvYWRtaW5Vc2VyQ3RybC5qcyIsImFkbWluLXZpZXdzL2FkbWluL3VzZXJzL2FkbWluVXNlcnNDdHJsLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DdHJsLmpzIiwiY29uZmlybWF0aW9uL2NvbmZpcm1hdGlvbkN0cmwuanMiLCJkYXNoYm9hcmQvZGFzaGJvYXJkQ3RybC5qcyIsImxvZ2luL2xvZ2luQ3RybC5qcyIsInJlc2V0L3Jlc2V0Q3RybC5qcyIsInNpZGViYXIvc2lkZWJhckN0cmwuanMiLCJ0ZWFtL3RlYW1DdHJsLmpzIiwidmVyaWZ5L3ZlcmlmeUN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBLFFBQUEsT0FBQSxPQUFBO0VBQ0E7OztBQUdBO0dBQ0EsT0FBQTtJQUNBO0lBQ0EsU0FBQSxjQUFBOzs7TUFHQSxjQUFBLGFBQUEsS0FBQTs7O0dBR0EsSUFBQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLGFBQUEsUUFBQTs7O01BR0EsSUFBQSxRQUFBLFFBQUE7TUFDQSxJQUFBLE1BQUE7UUFDQSxZQUFB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LEtBQUEsVUFBQSxTQUFBLFdBQUE7TUFDQSxPQUFBLFFBQUEsYUFBQTtNQUNBLE9BQUEsUUFBQSxhQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7TUFDQSxXQUFBLGNBQUE7TUFDQSxJQUFBLFdBQUE7UUFDQTs7OztJQUlBLEtBQUEsV0FBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsWUFBQSxVQUFBO01BQ0EsT0FBQSxRQUFBLGFBQUE7OztJQUdBLEtBQUEsVUFBQSxVQUFBO01BQ0EsT0FBQSxLQUFBLE1BQUEsUUFBQSxhQUFBOzs7SUFHQSxLQUFBLFVBQUEsU0FBQSxLQUFBO01BQ0EsUUFBQSxhQUFBLGNBQUEsS0FBQSxVQUFBO01BQ0EsV0FBQSxjQUFBOzs7O0FDckNBLFFBQUEsT0FBQTtHQUNBLFFBQUEsU0FBQTtJQUNBLFVBQUE7TUFDQSxPQUFBO1FBQ0EsV0FBQSxTQUFBLFNBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQSxTQUFBLFlBQUEsS0FBQSxRQUFBLFNBQUE7O1FBRUEsU0FBQSxTQUFBLEtBQUE7VUFDQSxPQUFBLEtBQUEsUUFBQTs7UUFFQSxZQUFBLFNBQUEsS0FBQTs7VUFFQSxJQUFBLENBQUEsS0FBQTtZQUNBLE9BQUE7OztVQUdBLE9BQUEsSUFBQSxLQUFBOztVQUVBLE9BQUEsT0FBQSxNQUFBLE9BQUE7WUFDQSxNQUFBLEtBQUEsZUFBQSxNQUFBLEtBQUE7Ozs7O0FDbkJBLFFBQUEsT0FBQTtHQUNBLFFBQUEsZUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLE9BQUEsWUFBQSxRQUFBLFNBQUEsU0FBQTtNQUNBLElBQUEsY0FBQTs7TUFFQSxTQUFBLGFBQUEsTUFBQSxHQUFBOztRQUVBLFFBQUEsT0FBQSxLQUFBLE9BQUEsS0FBQTs7UUFFQSxJQUFBLEdBQUE7VUFDQSxHQUFBLEtBQUE7Ozs7TUFJQSxTQUFBLGFBQUEsTUFBQSxHQUFBO1FBQ0EsT0FBQSxHQUFBO1FBQ0EsSUFBQSxJQUFBO1VBQ0EsR0FBQTs7OztNQUlBLFlBQUEsb0JBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOztXQUVBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsYUFBQSxNQUFBOzs7O01BSUEsWUFBQSxpQkFBQSxTQUFBLE9BQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsZUFBQTtZQUNBLE9BQUE7O1dBRUEsUUFBQSxTQUFBLEtBQUE7WUFDQSxhQUFBLE1BQUE7O1dBRUEsTUFBQSxTQUFBLE1BQUEsV0FBQTtZQUNBLElBQUEsZUFBQSxJQUFBO2NBQ0EsUUFBQSxRQUFBOzs7OztNQUtBLFlBQUEsU0FBQSxTQUFBLFVBQUE7O1FBRUEsUUFBQSxRQUFBO1FBQ0EsT0FBQSxHQUFBOzs7TUFHQSxZQUFBLFdBQUEsU0FBQSxPQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsa0JBQUE7WUFDQSxPQUFBO1lBQ0EsVUFBQTs7V0FFQSxRQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7V0FFQSxNQUFBLFNBQUEsS0FBQTtZQUNBLGFBQUEsTUFBQTs7OztNQUlBLFlBQUEsU0FBQSxTQUFBLE9BQUEsV0FBQSxXQUFBO1FBQ0EsT0FBQTtXQUNBLElBQUEsa0JBQUE7V0FDQSxRQUFBLFNBQUEsS0FBQTtZQUNBLFFBQUEsUUFBQTtZQUNBLElBQUEsVUFBQTtjQUNBLFVBQUE7OztXQUdBLE1BQUEsU0FBQSxLQUFBO1lBQ0EsSUFBQSxXQUFBO2NBQ0EsVUFBQTs7Ozs7TUFLQSxZQUFBLDBCQUFBLFNBQUEsV0FBQSxVQUFBO1FBQ0EsT0FBQTtXQUNBLEtBQUEsdUJBQUE7WUFDQSxJQUFBLFFBQUE7Ozs7TUFJQSxZQUFBLGlCQUFBLFNBQUEsTUFBQTtRQUNBLE9BQUE7V0FDQSxLQUFBLGVBQUE7WUFDQSxPQUFBOzs7O01BSUEsWUFBQSxnQkFBQSxTQUFBLE9BQUEsTUFBQSxXQUFBLFVBQUE7UUFDQSxPQUFBO1dBQ0EsS0FBQSx3QkFBQTtZQUNBLE9BQUE7WUFDQSxVQUFBOztXQUVBLFFBQUE7V0FDQSxNQUFBOzs7TUFHQSxPQUFBOzs7QUNuSEEsUUFBQSxPQUFBO0dBQ0EsUUFBQSxtQkFBQTtFQUNBO0VBQ0EsU0FBQSxNQUFBOztJQUVBLElBQUEsT0FBQTs7SUFFQSxPQUFBO01BQ0EsbUJBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOztNQUVBLHlCQUFBLFNBQUEsTUFBQSxNQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxTQUFBO1VBQ0EsVUFBQTtVQUNBLFdBQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOztNQUVBLHlCQUFBLFNBQUEsT0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsYUFBQTtVQUNBLFFBQUE7OztNQUdBLG9CQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsWUFBQTtVQUNBLE1BQUE7OztNQUdBLHNCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsY0FBQTtVQUNBLE1BQUE7OztNQUdBLHdCQUFBLFNBQUEsS0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsZ0JBQUE7VUFDQSxNQUFBOzs7Ozs7OztBQzFDQSxRQUFBLE9BQUE7S0FDQSxRQUFBLGVBQUE7UUFDQTtRQUNBLFNBQUEsTUFBQTs7WUFFQSxJQUFBLE9BQUE7O1lBRUEsT0FBQTtnQkFDQSxVQUFBLFVBQUE7b0JBQ0EsT0FBQSxNQUFBLElBQUE7O2dCQUVBLFlBQUEsU0FBQSxLQUFBO29CQUNBLE9BQUEsTUFBQSxLQUFBLE1BQUE7Ozs7Ozs7QUNaQSxRQUFBLE9BQUE7R0FDQSxRQUFBLGVBQUE7RUFDQTtFQUNBO0VBQ0EsU0FBQSxPQUFBLFFBQUE7O0lBRUEsSUFBQSxRQUFBO0lBQ0EsSUFBQSxPQUFBLFFBQUE7O0lBRUEsT0FBQTs7Ozs7TUFLQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBOzs7TUFHQSxLQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUE7OztNQUdBLFFBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBOzs7TUFHQSxTQUFBLFNBQUEsTUFBQSxNQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxRQUFBLE1BQUEsRUFBQTtVQUNBO1lBQ0EsTUFBQTtZQUNBLE1BQUEsT0FBQSxPQUFBO1lBQ0EsTUFBQSxPQUFBLE9BQUE7Ozs7O01BS0EsZUFBQSxTQUFBLElBQUEsUUFBQTtRQUNBLE9BQUEsTUFBQSxJQUFBLE9BQUEsS0FBQSxZQUFBO1VBQ0EsU0FBQTs7OztNQUlBLG9CQUFBLFNBQUEsSUFBQSxhQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxLQUFBLFlBQUE7VUFDQSxjQUFBOzs7O01BSUEsa0JBQUEsU0FBQSxHQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7Ozs7TUFNQSxrQkFBQSxTQUFBLEtBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBLFFBQUEsY0FBQSxTQUFBO1VBQ0EsTUFBQTs7OztNQUlBLFdBQUEsVUFBQTtRQUNBLE9BQUEsTUFBQSxPQUFBLE9BQUEsUUFBQSxjQUFBOzs7TUFHQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxNQUFBLElBQUEsT0FBQSxRQUFBLGNBQUE7Ozs7Ozs7TUFPQSxVQUFBLFVBQUE7UUFDQSxPQUFBLE1BQUEsSUFBQSxPQUFBOzs7TUFHQSxXQUFBLFNBQUEsR0FBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7O01BR0EsU0FBQSxTQUFBLEdBQUE7UUFDQSxPQUFBLE1BQUEsS0FBQSxPQUFBLEtBQUE7OztNQUdBLFVBQUEsU0FBQSxHQUFBO1FBQ0EsT0FBQSxNQUFBLEtBQUEsT0FBQSxLQUFBOzs7TUFHQSxZQUFBLFNBQUEsSUFBQTtRQUNBLE9BQUEsTUFBQSxLQUFBLE9BQUEsS0FBQTs7Ozs7OztBQzFGQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGFBQUE7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLFlBQUE7TUFDQSxPQUFBLFVBQUE7O0FDTEEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxhQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFFBQUEsYUFBQSxVQUFBLE9BQUEsYUFBQSxhQUFBLEtBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7O01BRUEsT0FBQSxZQUFBLE1BQUEsVUFBQTs7TUFFQSxPQUFBLE9BQUEsWUFBQTs7TUFFQSxPQUFBLE9BQUE7O01BRUEsWUFBQTtXQUNBLFFBQUE7Ozs7Ozs7Ozs7QUNwQkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxxQkFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxNQUFBLGdCQUFBOztNQUVBLE9BQUEsV0FBQTtNQUNBO1NBQ0E7U0FDQSxRQUFBLFNBQUEsU0FBQTtVQUNBLGVBQUE7OztNQUdBLFNBQUEsZUFBQSxTQUFBO1FBQ0EsT0FBQSxVQUFBOztRQUVBLFNBQUEsV0FBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsWUFBQSxJQUFBLEtBQUEsU0FBQTtRQUNBLFNBQUEsY0FBQSxJQUFBLEtBQUEsU0FBQTs7UUFFQSxPQUFBLFdBQUE7Ozs7O01BS0E7U0FDQTtTQUNBLFFBQUEsU0FBQSxPQUFBO1VBQ0EsT0FBQSxZQUFBLE9BQUEsS0FBQTs7O01BR0EsT0FBQSxrQkFBQSxVQUFBO1FBQ0E7V0FDQSx3QkFBQSxPQUFBLFVBQUEsUUFBQSxNQUFBLElBQUEsTUFBQTtXQUNBLFFBQUEsU0FBQSxTQUFBO1lBQ0EsS0FBQTtZQUNBLE9BQUEsWUFBQSxTQUFBLGtCQUFBLEtBQUE7Ozs7OztNQU1BLE9BQUEsYUFBQSxTQUFBLEtBQUE7UUFDQSxJQUFBLENBQUEsS0FBQTtVQUNBLE9BQUE7Ozs7UUFJQSxPQUFBLE9BQUEsTUFBQSxPQUFBO1VBQ0EsTUFBQSxLQUFBLGVBQUEsTUFBQSxLQUFBOzs7O01BSUEsU0FBQSxVQUFB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O21CQUVBLE1BQUEsU0FBQSxJQUFBO29CQUNBLEtBQUEsZUFBQSxLQUFBLFFBQUEsT0FBQSwyQkFBQTs7Ozs7Ozs7O01BU0EsU0FBQSxXQUFBLEtBQUE7UUFDQSxJQUFBLE1BQUE7VUFDQSxPQUFBLE9BQUEsTUFBQSxPQUFBOzs7O01BSUEsT0FBQSxXQUFBLFNBQUEsTUFBQTtRQUNBLElBQUEsS0FBQSxNQUFBO1VBQ0EsT0FBQTs7UUFFQSxJQUFBLEtBQUEsT0FBQSxXQUFBO1VBQ0EsT0FBQTs7UUFFQSxJQUFBLEtBQUEsT0FBQSxZQUFBLENBQUEsS0FBQSxPQUFBLFdBQUE7VUFDQSxPQUFBOzs7O01BSUEsU0FBQSxXQUFBLEtBQUE7UUFDQSxPQUFBLGVBQUE7UUFDQSxPQUFBLGFBQUEsV0FBQSxpQkFBQTtRQUNBLEVBQUE7V0FDQSxNQUFBOzs7TUFHQSxTQUFBLGlCQUFBLEtBQUE7UUFDQSxPQUFBO1VBQ0E7WUFDQSxNQUFBO1lBQ0EsUUFBQTtjQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxXQUFBLEtBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLFdBQUEsS0FBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsY0FBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsV0FBQSxLQUFBLE9BQUEsZ0JBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsWUFBQTs7O1lBR0E7WUFDQSxNQUFBO1lBQ0EsUUFBQTtjQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLFFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsUUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxRQUFBOzs7WUFHQTtZQUNBLE1BQUE7WUFDQSxRQUFBO2NBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBLG9CQUFBLEtBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTs7O1lBR0E7WUFDQSxNQUFBO1lBQ0EsUUFBQTtjQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTtnQkFDQSxNQUFBO2dCQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBO2dCQUNBLE1BQUE7Z0JBQ0E7Z0JBQ0EsTUFBQTtnQkFDQSxPQUFBLEtBQUEsYUFBQTs7O1lBR0E7WUFDQSxNQUFBO1lBQ0EsUUFBQTtjQUNBO2dCQUNBLE1BQUE7Z0JBQ0EsT0FBQSxLQUFBLGFBQUE7Z0JBQ0EsTUFBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBLHNCQUFBLEtBQUEsT0FBQTtnQkFDQTtnQkFDQSxNQUFBO2dCQUNBLE9BQUEsS0FBQSxhQUFBLFVBQUE7a0JBQ0EsS0FBQSxhQUFBLFFBQUE7a0JBQ0EsS0FBQSxhQUFBLFFBQUE7a0JBQ0EsS0FB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RUEsT0FBQSxZQUFBOztNQUVBLEtBQUEsSUFBQSxPQUFBLE9BQUEsV0FBQTtRQUNBLElBQUEsT0FBQSxVQUFBLEtBQUEsU0FBQSxtQkFBQTtVQUNBLE9BQUEsVUFBQSxPQUFBLE9BQUEsVUFBQSxLQUFBLFFBQUEsa0JBQUEsTUFBQSxXQUFBLFNBQUE7O1FBRUEsSUFBQSxPQUFBLFVBQUEsS0FBQSxTQUFBLHVCQUFBO1VBQ0EsT0FBQSxVQUFBLE9BQUEsT0FBQSxVQUFBLEtBQUEsUUFBQSxzQkFBQSxNQUFBLFdBQUEsS0FBQSxPQUFBOzs7OztNQUtBLElBQUEsWUFBQSxPQUFBLFlBQUEsTUFBQSxVQUFBOzs7TUFHQSxJQUFBLG1CQUFBLE9BQUEsbUJBQUEsTUFBQSxRQUFBLEtBQUEsT0FBQTs7TUFFQSxPQUFBLFlBQUEsU0FBQSxPQUFBO1FBQ0EsSUFBQSxPQUFBLE9BQUE7UUFDQSxRQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsQ0FBQSxLQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsYUFBQSxLQUFBLFlBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxhQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUEsYUFBQSxDQUFBLEtBQUEsT0FBQSxvQkFBQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLENBQUEsYUFBQSxLQUFBLE9BQUEsb0JBQUEsQ0FBQSxLQUFBLE9BQUE7VUFDQSxLQUFBO1lBQ0EsT0FBQSxDQUFBO2NBQ0EsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBO2NBQ0EsS0FBQSxPQUFBO2NBQ0EsQ0FBQSxLQUFBLE9BQUE7Y0FDQSxDQUFBLEtBQUEsT0FBQTtVQUNBLEtBQUE7WUFDQSxPQUFBLEtBQUEsT0FBQSxZQUFBLEtBQUEsT0FBQSxhQUFBLENBQUEsS0FBQSxPQUFBO1VBQ0EsS0FBQTtZQUNBLE9BQUEsS0FBQSxPQUFBOztRQUVBLE9BQUE7OztNQUdBLE9BQUEsZUFBQSxDQUFBLGFBQUEsS0FBQSxPQUFBLG9CQUFBLENBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsY0FBQSxVQUFBO1FBQ0E7V0FDQTtXQUNBLEtBQUEsVUFBQTtZQUNBLFdBQUE7Ozs7Ozs7O01BUUEsSUFBQSxZQUFBLElBQUEsU0FBQTtNQUNBLE9BQUEsaUJBQUEsS0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBO01BQ0EsT0FBQSxtQkFBQSxLQUFBLFlBQUEsVUFBQSxTQUFBLFNBQUE7TUFDQSxPQUFBLGVBQUEsS0FBQSxZQUFBLFVBQUEsU0FBQSxTQUFBOzs7TUFHQSxPQUFBLG1CQUFBLFVBQUE7O1FBRUEsS0FBQTtVQUNBLE9BQUE7VUFDQSxNQUFBO1VBQ0EsTUFBQTtVQUNBLGtCQUFBO1VBQ0Esb0JBQUE7VUFDQSxtQkFBQTtVQUNBLGdCQUFBO2FBQ0EsVUFBQTs7WUFFQTtlQUNBLGlCQUFBLEtBQUE7ZUFDQSxRQUFBLFNBQUEsS0FBQTtnQkFDQSxXQUFBLGNBQUE7Z0JBQ0EsT0FBQSxPQUFBOzs7Ozs7O0FDckdBLFFBQUEsT0FBQTtHQUNBLFdBQUEsYUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxPQUFBLFFBQUEsVUFBQSxPQUFBLFlBQUE7OztNQUdBLElBQUEsV0FBQSxTQUFBO01BQ0EsT0FBQSxZQUFBLE1BQUEsVUFBQTs7O01BR0EsT0FBQSxhQUFBOztNQUVBLFNBQUEsWUFBQTtRQUNBLE9BQUEsR0FBQTs7O01BR0EsU0FBQSxRQUFBLEtBQUE7UUFDQSxPQUFBLFFBQUEsS0FBQTs7O01BR0EsU0FBQSxZQUFBO1FBQ0EsT0FBQSxRQUFBOzs7TUFHQSxPQUFBLFFBQUEsVUFBQTtRQUNBO1FBQ0EsWUFBQTtVQUNBLE9BQUEsT0FBQSxPQUFBLFVBQUEsV0FBQTs7O01BR0EsT0FBQSxXQUFBLFVBQUE7UUFDQTtRQUNBLFlBQUE7VUFDQSxPQUFBLE9BQUEsT0FBQSxVQUFBLFdBQUE7OztNQUdBLE9BQUEsZ0JBQUEsU0FBQSxPQUFBO1FBQ0EsT0FBQSxhQUFBOzs7TUFHQSxPQUFBLGlCQUFBLFdBQUE7UUFDQSxJQUFBLFFBQUEsT0FBQTtRQUNBLFlBQUEsZUFBQTtRQUNBLFdBQUE7VUFDQSxPQUFBO1VBQ0EsTUFBQTtVQUNBLE1BQUE7VUFDQSxvQkFBQTs7Ozs7OztBQ3BEQSxRQUFBLE9BQUE7R0FDQSxXQUFBLGFBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxjQUFBLFFBQUEsWUFBQTtNQUNBLElBQUEsUUFBQSxhQUFBOztNQUVBLE9BQUEsVUFBQTs7TUFFQSxPQUFBLGlCQUFBLFVBQUE7UUFDQSxJQUFBLFdBQUEsT0FBQTtRQUNBLElBQUEsVUFBQSxPQUFBOztRQUVBLElBQUEsYUFBQSxRQUFBO1VBQ0EsT0FBQSxRQUFBO1VBQ0EsT0FBQSxVQUFBO1VBQ0E7OztRQUdBLFlBQUE7VUFDQTtVQUNBLE9BQUE7VUFDQSxTQUFBLFFBQUE7WUFDQSxXQUFBO2NBQ0EsT0FBQTtjQUNBLE1BQUE7Y0FDQSxNQUFBO2NBQ0Esb0JBQUE7ZUFDQSxVQUFBO2NBQ0EsT0FBQSxHQUFBOzs7VUFHQSxTQUFBLEtBQUE7WUFDQSxPQUFBLFFBQUEsS0FBQTtZQUNBLE9BQUEsVUFBQTs7Ozs7QUNwQ0EsUUFBQSxPQUFBO0dBQ0EsV0FBQSxlQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFBLFlBQUEsUUFBQSxVQUFBLE9BQUEsYUFBQSxTQUFBLFdBQUE7O01BRUEsSUFBQSxXQUFBLFNBQUE7TUFDQSxJQUFBLE9BQUEsV0FBQTs7TUFFQSxPQUFBLGFBQUE7O01BRUEsT0FBQSxtQkFBQSxNQUFBLFFBQUEsS0FBQSxPQUFBOztNQUVBLE9BQUEsU0FBQSxVQUFBO1FBQ0EsWUFBQTs7O01BR0EsT0FBQSxjQUFBO01BQ0EsT0FBQSxnQkFBQSxVQUFBO1FBQ0EsT0FBQSxjQUFBLENBQUEsT0FBQTs7OztNQUlBLEVBQUEsU0FBQSxHQUFBLFNBQUEsVUFBQTtRQUNBLE9BQUEsY0FBQTs7Ozs7QUM3QkEsUUFBQSxPQUFBO0dBQ0EsV0FBQSxZQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBQSxRQUFBLGFBQUEsVUFBQSxPQUFBLGFBQUEsS0FBQTs7TUFFQSxJQUFBLFdBQUEsU0FBQTs7TUFFQSxPQUFBLFlBQUEsTUFBQSxVQUFBOztNQUVBLE9BQUEsT0FBQSxZQUFBOztNQUVBLE9BQUEsT0FBQTs7TUFFQSxTQUFBLHFCQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxNQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxZQUFBOzs7O01BSUEsSUFBQSxPQUFBLEtBQUEsU0FBQTtRQUNBOzs7TUFHQSxPQUFBLFdBQUEsVUFBQTtRQUNBO1dBQ0EsaUJBQUEsT0FBQTtXQUNBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxPQUFBO1lBQ0E7O1dBRUEsTUFBQSxTQUFBLElBQUE7WUFDQSxPQUFBLFFBQUEsSUFBQTs7OztNQUlBLE9BQUEsWUFBQSxVQUFBO1FBQ0E7V0FDQTtXQUNBLFFBQUEsU0FBQSxLQUFBO1lBQ0EsT0FBQSxRQUFBO1lBQ0EsT0FBQSxPQUFBO1lBQ0EsT0FBQSxZQUFBOztXQUVBLE1BQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxRQUFBLElBQUEsS0FBQTs7Ozs7O0FDckRBLFFBQUEsT0FBQTtHQUNBLFdBQUEsY0FBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQUEsUUFBQSxjQUFBLFlBQUE7TUFDQSxJQUFBLFFBQUEsYUFBQTs7TUFFQSxPQUFBLFVBQUE7O01BRUEsSUFBQSxNQUFBO1FBQ0EsWUFBQSxPQUFBO1VBQ0EsU0FBQSxLQUFBO1lBQ0EsT0FBQSxVQUFBOztZQUVBLE9BQUEsVUFBQTs7VUFFQSxTQUFBLElBQUE7O1lBRUEsT0FBQSxVQUFBOzs7O1FBSUEiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdyZWcnLCBbXG4gICd1aS5yb3V0ZXInLFxuXSk7XG5cbmFwcFxuICAuY29uZmlnKFtcbiAgICAnJGh0dHBQcm92aWRlcicsXG4gICAgZnVuY3Rpb24oJGh0dHBQcm92aWRlcil7XG5cbiAgICAgIC8vIEFkZCBhdXRoIHRva2VuIHRvIEF1dGhvcml6YXRpb24gaGVhZGVyXG4gICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdBdXRoSW50ZXJjZXB0b3InKTtcblxuICAgIH1dKVxuICAucnVuKFtcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdTZXNzaW9uJyxcbiAgICBmdW5jdGlvbihBdXRoU2VydmljZSwgU2Vzc2lvbil7XG5cbiAgICAgIC8vIFN0YXJ0dXAsIGxvZ2luIGlmIHRoZXJlJ3MgIGEgdG9rZW4uXG4gICAgICB2YXIgdG9rZW4gPSBTZXNzaW9uLmdldFRva2VuKCk7XG4gICAgICBpZiAodG9rZW4pe1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhUb2tlbih0b2tlbik7XG4gICAgICB9XG5cbiAgfV0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgICAuY29uc3RhbnQoJ0VWRU5UX0lORk8nLCB7XG4gICAgICAgIE5BTUU6ICdIYWNrQVUgMjAxNycsXG4gICAgfSlcbiAgICAuY29uc3RhbnQoJ0RBU0hCT0FSRCcsIHtcbiAgICAgICAgVU5WRVJJRklFRDogJ1lvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhbiBlbWFpbCBhc2tpbmcgeW91IHZlcmlmeSB5b3VyIGVtYWlsLiBDbGljayB0aGUgbGluayBpbiB0aGUgZW1haWwgYW5kIHlvdSBjYW4gc3RhcnQgeW91ciBhcHBsaWNhdGlvbiEnLFxuICAgICAgICBJTkNPTVBMRVRFX1RJVExFOiAnWW91IHN0aWxsIG5lZWQgdG8gY29tcGxldGUgeW91ciBhcHBsaWNhdGlvbiEnLFxuICAgICAgICBJTkNPTVBMRVRFOiAnSWYgeW91IGRvIG5vdCBjb21wbGV0ZSB5b3VyIGFwcGxpY2F0aW9uIGJlZm9yZSB0aGUgW0FQUF9ERUFETElORV0sIHlvdSB3aWxsIG5vdCBiZSBjb25zaWRlcmVkIGZvciB0aGUgYWRtaXNzaW9ucyBsb3R0ZXJ5IScsXG4gICAgICAgIFNVQk1JVFRFRF9USVRMRTogJ1lvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc3VibWl0dGVkIScsXG4gICAgICAgIFNVQk1JVFRFRDogJ0ZlZWwgZnJlZSB0byBlZGl0IGl0IGF0IGFueSB0aW1lLiBIb3dldmVyLCBvbmNlIHJlZ2lzdHJhdGlvbiBpcyBjbG9zZWQsIHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGVkaXQgaXQgYW55IGZ1cnRoZXIuXFxuQWRtaXNzaW9ucyB3aWxsIGJlIGRldGVybWluZWQgYnkgYSByYW5kb20gbG90dGVyeS4gUGxlYXNlIG1ha2Ugc3VyZSB5b3VyIGluZm9ybWF0aW9uIGlzIGFjY3VyYXRlIGJlZm9yZSByZWdpc3RyYXRpb24gaXMgY2xvc2VkIScsXG4gICAgICAgIENMT1NFRF9BTkRfSU5DT01QTEVURV9USVRMRTogJ1VuZm9ydHVuYXRlbHksIHJlZ2lzdHJhdGlvbiBoYXMgY2xvc2VkLCBhbmQgdGhlIGxvdHRlcnkgcHJvY2VzcyBoYXMgYmVndW4uJyxcbiAgICAgICAgQ0xPU0VEX0FORF9JTkNPTVBMRVRFOiAnQmVjYXVzZSB5b3UgaGF2ZSBub3QgY29tcGxldGVkIHlvdXIgcHJvZmlsZSBpbiB0aW1lLCB5b3Ugd2lsbCBub3QgYmUgZWxpZ2libGUgZm9yIHRoZSBsb3R0ZXJ5IHByb2Nlc3MuJyxcbiAgICAgICAgQURNSVRURURfQU5EX0NBTl9DT05GSVJNX1RJVExFOiAnWW91IG11c3QgY29uZmlybSBieSBbQ09ORklSTV9ERUFETElORV0uJyxcbiAgICAgICAgQURNSVRURURfQU5EX0NBTk5PVF9DT05GSVJNX1RJVExFOiAnWW91ciBjb25maXJtYXRpb24gZGVhZGxpbmUgb2YgW0NPTkZJUk1fREVBRExJTkVdIGhhcyBwYXNzZWQuJyxcbiAgICAgICAgQURNSVRURURfQU5EX0NBTk5PVF9DT05GSVJNOiAnQWx0aG91Z2ggeW91IHdlcmUgYWNjZXB0ZWQsIHlvdSBkaWQgbm90IGNvbXBsZXRlIHlvdXIgY29uZmlybWF0aW9uIGluIHRpbWUuXFxuVW5mb3J0dW5hdGVseSwgdGhpcyBtZWFucyB0aGF0IHlvdSB3aWxsIG5vdCBiZSBhYmxlIHRvIGF0dGVuZCB0aGUgZXZlbnQsIGFzIHdlIG11c3QgYmVnaW4gdG8gYWNjZXB0IG90aGVyIGFwcGxpY2FudHMgb24gdGhlIHdhaXRsaXN0LlxcbldlIGhvcGUgdG8gc2VlIHlvdSBhZ2FpbiBuZXh0IHllYXIhJyxcbiAgICAgICAgQ09ORklSTUVEX05PVF9QQVNUX1RJVExFOiAnWW91IGNhbiBlZGl0IHlvdXIgY29uZmlybWF0aW9uIGluZm9ybWF0aW9uIHVudGlsIFtDT05GSVJNX0RFQURMSU5FXScsXG4gICAgICAgIERFQ0xJTkVEOiAnV2VcXCdyZSBzb3JyeSB0byBoZWFyIHRoYXQgeW91IHdvblxcJ3QgYmUgYWJsZSB0byBtYWtlIGl0IHRvIEhhY2tNSVQgMjAxNSEgOihcXG5NYXliZSBuZXh0IHllYXIhIFdlIGhvcGUgeW91IHNlZSB5b3UgYWdhaW4gc29vbi4nLFxuICAgIH0pXG4gICAgLmNvbnN0YW50KCdURUFNJyx7XG4gICAgICAgIE5PX1RFQU1fUkVHX0NMT1NFRDogJ1VuZm9ydHVuYXRlbHksIGl0XFwncyB0b28gbGF0ZSB0byBlbnRlciB0aGUgbG90dGVyeSB3aXRoIGEgdGVhbS5cXG5Ib3dldmVyLCB5b3UgY2FuIHN0aWxsIGZvcm0gdGVhbXMgb24geW91ciBvd24gYmVmb3JlIG9yIGR1cmluZyB0aGUgZXZlbnQhJyxcbiAgICB9KTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAgIC5jb25maWcoW1xuICAgICAgICAnJHN0YXRlUHJvdmlkZXInLFxuICAgICAgICAnJHVybFJvdXRlclByb3ZpZGVyJyxcbiAgICAgICAgJyRsb2NhdGlvblByb3ZpZGVyJyxcbiAgICAgICAgZnVuY3Rpb24gKFxuICAgICAgICAgICAgJHN0YXRlUHJvdmlkZXIsXG4gICAgICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIsXG4gICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICAgICAgICAgICAvLyBGb3IgYW55IHVubWF0Y2hlZCB1cmwsIHJlZGlyZWN0IHRvIC9zdGF0ZTFcbiAgICAgICAgICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvNDA0XCIpO1xuXG4gICAgICAgICAgICAvLyBTZXQgdXAgZGUgc3RhdGVzXG4gICAgICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvbG9naW4vbG9naW4uaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZUxvZ2luOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnc2V0dGluZ3MnOiBmdW5jdGlvbiAoU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYmFzZS5odG1sXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2lkZWJhckBhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3Mvc2lkZWJhci9zaWRlYmFyLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2lkZWJhckN0cmwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NldHRpbmdzJzogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMb2dpbjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5kYXNoYm9hcmQnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRGFzaGJvYXJkQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbiAoVXNlclNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmFwcGxpY2F0aW9uJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwcGxpY2F0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FwcGxpY2F0aW9uQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyOiBmdW5jdGlvbiAoVXNlclNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogZnVuY3Rpb24gKFNldHRpbmdzU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBTZXR0aW5nc1NlcnZpY2UuZ2V0UHVibGljU2V0dGluZ3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdhcHAuY29uZmlybWF0aW9uJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2NvbmZpcm1hdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9jb25maXJtYXRpb24vY29uZmlybWF0aW9uLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbmZpcm1hdGlvbkN0cmwnLFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlcjogZnVuY3Rpb24gKFVzZXJTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnRlYW0nLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvdGVhbVwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy90ZWFtL3RlYW0uaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVGVhbUN0cmwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlVmVyaWZpZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uIChVc2VyU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbiAoU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC50ZWFtcycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi90ZWFtc1wiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi12aWV3cy90ZWFtcy90ZWFtcy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUZWFtc0N0cmwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXF1aXJlVmVyaWZpZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXI6IGZ1bmN0aW9uIChVc2VyU2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiBmdW5jdGlvbiAoU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNldHRpbmdzU2VydmljZS5nZXRQdWJsaWNTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hZG1pbicsIHtcbiAgICAgICAgICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICcnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvYWRtaW4vYWRtaW4uaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pbkN0cmwnXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVBZG1pbjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hZG1pbi5zdGF0cycsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hZG1pblwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi12aWV3cy9hZG1pbi9zdGF0cy9zdGF0cy5odG1sXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZG1pblN0YXRzQ3RybCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnVzZXJzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FkbWluL3VzZXJzP1wiICtcbiAgICAgICAgICAgICAgICAgICAgJyZwYWdlJyArXG4gICAgICAgICAgICAgICAgICAgICcmc2l6ZScgK1xuICAgICAgICAgICAgICAgICAgICAnJnF1ZXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvYWRtaW4tdmlld3MvYWRtaW4vdXNlcnMvdXNlcnMuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2Vyc0N0cmwnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuc3RhdGUoJ2FwcC5hZG1pbi51c2VyJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FkbWluL3VzZXJzLzppZFwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9hZG1pbi12aWV3cy9hZG1pbi91c2VyL3VzZXIuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2VyQ3RybCcsXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd1c2VyJzogZnVuY3Rpb24gKCRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gVXNlclNlcnZpY2UuZ2V0KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmFkbWluLnNldHRpbmdzJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FkbWluL3NldHRpbmdzXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL2FkbWluLXZpZXdzL2FkbWluL3NldHRpbmdzL3NldHRpbmdzLmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkbWluU2V0dGluZ3NDdHJsJyxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgncmVzZXQnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcmVzZXQvOnRva2VuXCIsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Jlc2V0L3Jlc2V0Lmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Jlc2V0Q3RybCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVMb2dpbjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnN0YXRlKCd2ZXJpZnknLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvdmVyaWZ5Lzp0b2tlblwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy92ZXJpZnkvdmVyaWZ5Lmh0bWxcIixcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1ZlcmlmeUN0cmwnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnNDA0Jywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiLzQwNFwiLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy80MDQuaHRtbFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlTG9naW46IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfV0pXG4gICAgLnJ1bihbXG4gICAgICAgICckcm9vdFNjb3BlJyxcbiAgICAgICAgJyRzdGF0ZScsXG4gICAgICAgICdTZXNzaW9uJyxcbiAgICAgICAgZnVuY3Rpb24gKFxuICAgICAgICAgICAgJHJvb3RTY29wZSxcbiAgICAgICAgICAgICRzdGF0ZSxcbiAgICAgICAgICAgIFNlc3Npb24pIHtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlcXVpcmVMb2dpbiA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlTG9naW47XG4gICAgICAgICAgICAgICAgdmFyIHJlcXVpcmVBZG1pbiA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlQWRtaW47XG4gICAgICAgICAgICAgICAgdmFyIHJlcXVpcmVWZXJpZmllZCA9IHRvU3RhdGUuZGF0YS5yZXF1aXJlVmVyaWZpZWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZUxvZ2luICYmICFTZXNzaW9uLmdldFRva2VuKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlQWRtaW4gJiYgIVNlc3Npb24uZ2V0VXNlcigpLmFkbWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlVmVyaWZpZWQgJiYgIVNlc3Npb24uZ2V0VXNlcigpLnZlcmlmaWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgW1xuICAgICdTZXNzaW9uJyxcbiAgICBmdW5jdGlvbihTZXNzaW9uKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVxdWVzdDogZnVuY3Rpb24oY29uZmlnKXtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IFNlc3Npb24uZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIGlmICh0b2tlbil7XG4gICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddID0gdG9rZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5zZXJ2aWNlKCdTZXNzaW9uJywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHdpbmRvdycsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHdpbmRvdyl7XG5cbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKHRva2VuLCB1c2VyKXtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dCA9IHRva2VuO1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UudXNlcklkID0gdXNlci5faWQ7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlciA9IEpTT04uc3RyaW5naWZ5KHVzZXIpO1xuICAgICAgJHJvb3RTY29wZS5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgfTtcblxuICAgIHRoaXMuZGVzdHJveSA9IGZ1bmN0aW9uKG9uQ29tcGxldGUpe1xuICAgICAgZGVsZXRlICR3aW5kb3cubG9jYWxTdG9yYWdlLmp3dDtcbiAgICAgIGRlbGV0ZSAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XG4gICAgICBkZWxldGUgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXI7XG4gICAgICAkcm9vdFNjb3BlLmN1cnJlbnRVc2VyID0gbnVsbDtcbiAgICAgIGlmIChvbkNvbXBsZXRlKXtcbiAgICAgICAgb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmdldFRva2VuID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS5qd3Q7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VXNlcklkID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZS51c2VySWQ7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0VXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSgkd2luZG93LmxvY2FsU3RvcmFnZS5jdXJyZW50VXNlcik7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0VXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UuY3VycmVudFVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKTtcbiAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgIH07XG5cbiAgfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnVXRpbHMnLCBbXG4gICAgZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUmVnT3BlbjogZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpID4gc2V0dGluZ3MudGltZU9wZW4gJiYgRGF0ZS5ub3coKSA8IHNldHRpbmdzLnRpbWVDbG9zZTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNBZnRlcjogZnVuY3Rpb24odGltZSl7XG4gICAgICAgICAgcmV0dXJuIERhdGUubm93KCkgPiB0aW1lO1xuICAgICAgICB9LFxuICAgICAgICBmb3JtYXRUaW1lOiBmdW5jdGlvbih0aW1lKXtcblxuICAgICAgICAgIGlmICghdGltZSl7XG4gICAgICAgICAgICByZXR1cm4gXCJJbnZhbGlkIERhdGVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkYXRlID0gbmV3IERhdGUodGltZSk7XG4gICAgICAgICAgLy8gSGFjayBmb3IgdGltZXpvbmVcbiAgICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXG4gICAgICAgICAgICBcIiBcIiArIGRhdGUudG9UaW1lU3RyaW5nKCkuc3BsaXQoJyAnKVsyXTtcblxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmZhY3RvcnkoJ0F1dGhTZXJ2aWNlJywgW1xuICAgICckaHR0cCcsXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICckd2luZG93JyxcbiAgICAnU2Vzc2lvbicsXG4gICAgZnVuY3Rpb24oJGh0dHAsICRyb290U2NvcGUsICRzdGF0ZSwgJHdpbmRvdywgU2Vzc2lvbikge1xuICAgICAgdmFyIGF1dGhTZXJ2aWNlID0ge307XG5cbiAgICAgIGZ1bmN0aW9uIGxvZ2luU3VjY2VzcyhkYXRhLCBjYil7XG4gICAgICAgIC8vIFdpbm5lciB3aW5uZXIgeW91IGdldCBhIHRva2VuXG4gICAgICAgIFNlc3Npb24uY3JlYXRlKGRhdGEudG9rZW4sIGRhdGEudXNlcik7XG5cbiAgICAgICAgaWYgKGNiKXtcbiAgICAgICAgICBjYihkYXRhLnVzZXIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGxvZ2luRmFpbHVyZShkYXRhLCBjYil7XG4gICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoUGFzc3dvcmQgPSBmdW5jdGlvbihlbWFpbCwgcGFzc3dvcmQsIG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XG4gICAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAgIC5wb3N0KCcvYXV0aC9sb2dpbicsIHtcbiAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBsb2dpblN1Y2Nlc3MoZGF0YSwgb25TdWNjZXNzKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGxvZ2luRmFpbHVyZShkYXRhLCBvbkZhaWx1cmUpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgYXV0aFNlcnZpY2UubG9naW5XaXRoVG9rZW4gPSBmdW5jdGlvbih0b2tlbiwgb25TdWNjZXNzLCBvbkZhaWx1cmUpe1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvbG9naW4nLCB7XG4gICAgICAgICAgICB0b2tlbjogdG9rZW5cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgbG9naW5TdWNjZXNzKGRhdGEsIG9uU3VjY2Vzcyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzQ29kZSl7XG4gICAgICAgICAgICBpZiAoc3RhdHVzQ29kZSA9PT0gNDAwKXtcbiAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KGxvZ2luRmFpbHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5sb2dvdXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAvLyBDbGVhciB0aGUgc2Vzc2lvblxuICAgICAgICBTZXNzaW9uLmRlc3Ryb3koY2FsbGJhY2spO1xuICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5yZWdpc3RlciA9IGZ1bmN0aW9uKGVtYWlsLCBwYXNzd29yZCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3JlZ2lzdGVyJywge1xuICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGxvZ2luU3VjY2VzcyhkYXRhLCBvblN1Y2Nlc3MpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgbG9naW5GYWlsdXJlKGRhdGEsIG9uRmFpbHVyZSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS52ZXJpZnkgPSBmdW5jdGlvbih0b2tlbiwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLmdldCgnL2F1dGgvdmVyaWZ5LycgKyB0b2tlbilcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgIFNlc3Npb24uc2V0VXNlcih1c2VyKTtcbiAgICAgICAgICAgIGlmIChvblN1Y2Nlc3Mpe1xuICAgICAgICAgICAgICBvblN1Y2Nlc3ModXNlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZiAob25GYWlsdXJlKSB7XG4gICAgICAgICAgICAgIG9uRmFpbHVyZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGF1dGhTZXJ2aWNlLnJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gZnVuY3Rpb24ob25TdWNjZXNzLCBvbkZhaWx1cmUpe1xuICAgICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgICAucG9zdCgnL2F1dGgvdmVyaWZ5L3Jlc2VuZCcsIHtcbiAgICAgICAgICAgIGlkOiBTZXNzaW9uLmdldFVzZXJJZCgpXG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbCA9IGZ1bmN0aW9uKGVtYWlsKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3Jlc2V0Jywge1xuICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBhdXRoU2VydmljZS5yZXNldFBhc3N3b3JkID0gZnVuY3Rpb24odG9rZW4sIHBhc3MsIG9uU3VjY2Vzcywgb25GYWlsdXJlKXtcbiAgICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgICAgLnBvc3QoJy9hdXRoL3Jlc2V0L3Bhc3N3b3JkJywge1xuICAgICAgICAgICAgdG9rZW46IHRva2VuLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3NcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zdWNjZXNzKG9uU3VjY2VzcylcbiAgICAgICAgICAuZXJyb3Iob25GYWlsdXJlKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBhdXRoU2VydmljZTtcbiAgICB9XG4gIF0pOyIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnU2V0dGluZ3NTZXJ2aWNlJywgW1xuICAnJGh0dHAnLFxuICBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICB2YXIgYmFzZSA9ICcvYXBpL3NldHRpbmdzLyc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UHVibGljU2V0dGluZ3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlUmVnaXN0cmF0aW9uVGltZXM6IGZ1bmN0aW9uKG9wZW4sIGNsb3NlKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3RpbWVzJywge1xuICAgICAgICAgIHRpbWVPcGVuOiBvcGVuLFxuICAgICAgICAgIHRpbWVDbG9zZTogY2xvc2UsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRpbWU6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnY29uZmlybS1ieScsIHtcbiAgICAgICAgICB0aW1lOiB0aW1lXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGdldFdoaXRlbGlzdGVkRW1haWxzOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UgKyAnd2hpdGVsaXN0Jyk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlV2hpdGVsaXN0ZWRFbWFpbHM6IGZ1bmN0aW9uKGVtYWlscyl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArICd3aGl0ZWxpc3QnLCB7XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHNcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlV2FpdGxpc3RUZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgJ3dhaXRsaXN0Jywge1xuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdXBkYXRlQWNjZXB0YW5jZVRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnYWNjZXB0YW5jZScsIHtcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvblRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2UgKyAnY29uZmlybWF0aW9uJywge1xuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICB9XG4gIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gICAgLmZhY3RvcnkoJ1RlYW1TZXJ2aWNlJywgW1xuICAgICAgICAnJGh0dHAnLFxuICAgICAgICBmdW5jdGlvbigkaHR0cCl7XG5cbiAgICAgICAgICAgIHZhciBiYXNlID0gJy9hcGkvdGVhbXMvJztcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRUZWFtczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNyZWF0ZVRlYW06IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH1cbiAgICBdKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuZmFjdG9yeSgnVXNlclNlcnZpY2UnLCBbXG4gICckaHR0cCcsXG4gICdTZXNzaW9uJyxcbiAgZnVuY3Rpb24oJGh0dHAsIFNlc3Npb24pe1xuXG4gICAgdmFyIHVzZXJzID0gJy9hcGkvdXNlcnMnO1xuICAgIHZhciBiYXNlID0gdXNlcnMgKyAnLyc7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBCYXNpYyBBY3Rpb25zXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBnZXRDdXJyZW50VXNlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgU2Vzc2lvbi5nZXRVc2VySWQoKSk7XG4gICAgICB9LFxuXG4gICAgICBnZXQ6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgaWQpO1xuICAgICAgfSxcblxuICAgICAgZ2V0QWxsOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2UpO1xuICAgICAgfSxcblxuICAgICAgZ2V0UGFnZTogZnVuY3Rpb24ocGFnZSwgc2l6ZSwgdGV4dCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXNlcnMgKyAnPycgKyAkLnBhcmFtKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICBwYWdlOiBwYWdlID8gcGFnZSA6IDAsXG4gICAgICAgICAgICBzaXplOiBzaXplID8gc2l6ZSA6IDUwXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZVByb2ZpbGU6IGZ1bmN0aW9uKGlkLCBwcm9maWxlKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgaWQgKyAnL3Byb2ZpbGUnLCB7XG4gICAgICAgICAgcHJvZmlsZTogcHJvZmlsZVxuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHVwZGF0ZUNvbmZpcm1hdGlvbjogZnVuY3Rpb24oaWQsIGNvbmZpcm1hdGlvbil7XG4gICAgICAgIHJldHVybiAkaHR0cC5wdXQoYmFzZSArIGlkICsgJy9jb25maXJtJywge1xuICAgICAgICAgIGNvbmZpcm1hdGlvbjogY29uZmlybWF0aW9uXG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgZGVjbGluZUFkbWlzc2lvbjogZnVuY3Rpb24oaWQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyAnL2RlY2xpbmUnKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gVGVhbVxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICBqb2luT3JDcmVhdGVUZWFtOiBmdW5jdGlvbihjb2RlKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlICsgU2Vzc2lvbi5nZXRVc2VySWQoKSArICcvdGVhbScsIHtcbiAgICAgICAgICBjb2RlOiBjb2RlXG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgbGVhdmVUZWFtOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gJGh0dHAuZGVsZXRlKGJhc2UgKyBTZXNzaW9uLmdldFVzZXJJZCgpICsgJy90ZWFtJyk7XG4gICAgICB9LFxuXG4gICAgICBnZXRNeVRlYW1tYXRlczogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgU2Vzc2lvbi5nZXRVc2VySWQoKSArICcvdGVhbScpO1xuICAgICAgfSxcblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gQWRtaW4gT25seVxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBnZXRTdGF0czogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlICsgJ3N0YXRzJyk7XG4gICAgICB9LFxuXG4gICAgICBhZG1pdFVzZXI6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoYmFzZSArIGlkICsgJy9hZG1pdCcpO1xuICAgICAgfSxcblxuICAgICAgY2hlY2tJbjogZnVuY3Rpb24oaWQpe1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlICsgaWQgKyAnL2NoZWNraW4nKTtcbiAgICAgIH0sXG5cbiAgICAgIGNoZWNrT3V0OiBmdW5jdGlvbihpZCl7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvY2hlY2tvdXQnKTtcbiAgICAgIH0sXG5cbiAgICAgIHJlbW92ZVVzZXI6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2UgKyBpZCArICcvcmVtb3ZlJyk7XG4gICAgICB9XG5cbiAgICB9O1xuICB9XG4gIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pbkN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdUZWFtc0N0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ2N1cnJlbnRVc2VyJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdVdGlscycsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICAnVGVhbVNlcnZpY2UnLFxuICAgICdURUFNJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIGN1cnJlbnRVc2VyLCBzZXR0aW5ncywgVXRpbHMsIFVzZXJTZXJ2aWNlLCBUZWFtU2VydmljZSwgVEVBTSl7XG4gICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgdXNlcidzIG1vc3QgcmVjZW50IGRhdGEuXG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuXG4gICAgICAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgJHNjb3BlLnVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuXG4gICAgICAkc2NvcGUuVEVBTSA9IFRFQU07XG5cbiAgICAgIFRlYW1TZXJ2aWNlLmdldFRlYW1zKClcbiAgICAgICAgICAuc3VjY2Vzcyh0ZWFtcyA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlYW1zKTtcbiAgICAgICAgICAgICAgJHNjb3BlLnRlYW1zID0gdGVhbXM7XG4gICAgICAgICAgfSlcblxuXG5cblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignQWRtaW5TZXR0aW5nc0N0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzY2UnLFxuICAgICdTZXR0aW5nc1NlcnZpY2UnLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJHNjZSwgU2V0dGluZ3NTZXJ2aWNlKXtcblxuICAgICAgJHNjb3BlLnNldHRpbmdzID0ge307XG4gICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgLmdldFB1YmxpY1NldHRpbmdzKClcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKXtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgIC8vIEZvcm1hdCB0aGUgZGF0ZXMgaW4gc2V0dGluZ3MuXG4gICAgICAgIHNldHRpbmdzLnRpbWVPcGVuID0gbmV3IERhdGUoc2V0dGluZ3MudGltZU9wZW4pO1xuICAgICAgICBzZXR0aW5ncy50aW1lQ2xvc2UgPSBuZXcgRGF0ZShzZXR0aW5ncy50aW1lQ2xvc2UpO1xuICAgICAgICBzZXR0aW5ncy50aW1lQ29uZmlybSA9IG5ldyBEYXRlKHNldHRpbmdzLnRpbWVDb25maXJtKTtcblxuICAgICAgICAkc2NvcGUuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgIH1cblxuICAgICAgLy8gV2hpdGVsaXN0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAuZ2V0V2hpdGVsaXN0ZWRFbWFpbHMoKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihlbWFpbHMpe1xuICAgICAgICAgICRzY29wZS53aGl0ZWxpc3QgPSBlbWFpbHMuam9pbihcIiwgXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZVdoaXRlbGlzdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVXaGl0ZWxpc3RlZEVtYWlscygkc2NvcGUud2hpdGVsaXN0LnJlcGxhY2UoLyAvZywgJycpLnNwbGl0KCcsJykpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgICAgc3dhbCgnV2hpdGVsaXN0IHVwZGF0ZWQuJyk7XG4gICAgICAgICAgICAkc2NvcGUud2hpdGVsaXN0ID0gc2V0dGluZ3Mud2hpdGVsaXN0ZWRFbWFpbHMuam9pbihcIiwgXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgLy8gUmVnaXN0cmF0aW9uIFRpbWVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSl7XG4gICAgICAgIGlmICghZGF0ZSl7XG4gICAgICAgICAgcmV0dXJuIFwiSW52YWxpZCBEYXRlXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYWNrIGZvciB0aW1lem9uZVxuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdCgnZGRkZCwgTU1NTSBEbyBZWVlZLCBoOm1tIGEnKSArXG4gICAgICAgICAgXCIgXCIgKyBkYXRlLnRvVGltZVN0cmluZygpLnNwbGl0KCcgJylbMl07XG4gICAgICB9O1xuXG4gICAgICAvLyBUYWtlIGEgZGF0ZSBhbmQgcmVtb3ZlIHRoZSBzZWNvbmRzLlxuICAgICAgZnVuY3Rpb24gY2xlYW5EYXRlKGRhdGUpe1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoXG4gICAgICAgICAgZGF0ZS5nZXRGdWxsWWVhcigpLFxuICAgICAgICAgIGRhdGUuZ2V0TW9udGgoKSxcbiAgICAgICAgICBkYXRlLmdldERhdGUoKSxcbiAgICAgICAgICBkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgZGF0ZS5nZXRNaW51dGVzKClcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gQ2xlYW4gdGhlIGRhdGVzIGFuZCB0dXJuIHRoZW0gdG8gbXMuXG4gICAgICAgIHZhciBvcGVuID0gY2xlYW5EYXRlKCRzY29wZS5zZXR0aW5ncy50aW1lT3BlbikuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgY2xvc2UgPSBjbGVhbkRhdGUoJHNjb3BlLnNldHRpbmdzLnRpbWVDbG9zZSkuZ2V0VGltZSgpO1xuXG4gICAgICAgIGlmIChvcGVuIDwgMCB8fCBjbG9zZSA8IDAgfHwgb3BlbiA9PT0gdW5kZWZpbmVkIHx8IGNsb3NlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgIHJldHVybiBzd2FsKCdPb3BzLi4uJywgJ1lvdSBuZWVkIHRvIGVudGVyIHZhbGlkIHRpbWVzLicsICdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcGVuID49IGNsb3NlKXtcbiAgICAgICAgICBzd2FsKCdPb3BzLi4uJywgJ1JlZ2lzdHJhdGlvbiBjYW5ub3Qgb3BlbiBhZnRlciBpdCBjbG9zZXMuJywgJ2Vycm9yJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVJlZ2lzdHJhdGlvblRpbWVzKG9wZW4sIGNsb3NlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKTtcbiAgICAgICAgICAgIHN3YWwoXCJMb29rcyBnb29kIVwiLCBcIlJlZ2lzdHJhdGlvbiBUaW1lcyBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIENvbmZpcm1hdGlvbiBUaW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICRzY29wZS51cGRhdGVDb25maXJtYXRpb25UaW1lID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGNvbmZpcm1CeSA9IGNsZWFuRGF0ZSgkc2NvcGUuc2V0dGluZ3MudGltZUNvbmZpcm0pLmdldFRpbWUoKTtcblxuICAgICAgICBTZXR0aW5nc1NlcnZpY2VcbiAgICAgICAgICAudXBkYXRlQ29uZmlybWF0aW9uVGltZShjb25maXJtQnkpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3Moc2V0dGluZ3MpO1xuICAgICAgICAgICAgc3dhbChcIlNvdW5kcyBnb29kIVwiLCBcIkNvbmZpcm1hdGlvbiBEYXRlIFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgLy8gQWNjZXB0YW5jZSAvIENvbmZpcm1hdGlvbiBUZXh0IC0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcblxuICAgICAgJHNjb3BlLm1hcmtkb3duUHJldmlldyA9IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICByZXR1cm4gJHNjZS50cnVzdEFzSHRtbChjb252ZXJ0ZXIubWFrZUh0bWwodGV4dCkpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZVdhaXRsaXN0VGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLndhaXRsaXN0VGV4dDtcbiAgICAgICAgU2V0dGluZ3NTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVdhaXRsaXN0VGV4dCh0ZXh0KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiV2FpdGxpc3QgVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnVwZGF0ZUFjY2VwdGFuY2VUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRleHQgPSAkc2NvcGUuc2V0dGluZ3MuYWNjZXB0YW5jZVRleHQ7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVBY2NlcHRhbmNlVGV4dCh0ZXh0KVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dhbChcIkxvb2tzIGdvb2QhXCIsIFwiQWNjZXB0YW5jZSBUZXh0IFVwZGF0ZWRcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgdXBkYXRlU2V0dGluZ3MoZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUudXBkYXRlQ29uZmlybWF0aW9uVGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0ZXh0ID0gJHNjb3BlLnNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQ7XG4gICAgICAgIFNldHRpbmdzU2VydmljZVxuICAgICAgICAgIC51cGRhdGVDb25maXJtYXRpb25UZXh0KHRleHQpXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBzd2FsKFwiTG9va3MgZ29vZCFcIiwgXCJDb25maXJtYXRpb24gVGV4dCBVcGRhdGVkXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdzKGRhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0FkbWluU3RhdHNDdHJsJyxbXG4gICAgJyRzY29wZScsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsIFVzZXJTZXJ2aWNlKXtcblxuICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgLmdldFN0YXRzKClcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oc3RhdHMpe1xuICAgICAgICAgICRzY29wZS5zdGF0cyA9IHN0YXRzO1xuICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuZnJvbU5vdyA9IGZ1bmN0aW9uKGRhdGUpe1xuICAgICAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZyb21Ob3coKTtcbiAgICAgIH07XG5cbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pblVzZXJDdHJsJyxbXG4gICAgJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAndXNlcicsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBVc2VyLCBVc2VyU2VydmljZSl7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWRVc2VyID0gVXNlci5kYXRhO1xuXG4gICAgICAvLyBQb3B1bGF0ZSB0aGUgc2Nob29sIGRyb3Bkb3duXG4gICAgICBwb3B1bGF0ZVNjaG9vbHMoKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBUT0RPOiBKQU5LIFdBUk5JTkdcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gcG9wdWxhdGVTY2hvb2xzKCl7XG5cbiAgICAgICAgJGh0dHBcbiAgICAgICAgICAuZ2V0KCcvYXNzZXRzL3NjaG9vbHMuanNvbicpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIHZhciBzY2hvb2xzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICB2YXIgZW1haWwgPSAkc2NvcGUuc2VsZWN0ZWRVc2VyLmVtYWlsLnNwbGl0KCdAJylbMV07XG5cbiAgICAgICAgICAgIGlmIChzY2hvb2xzW2VtYWlsXSl7XG4gICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIucHJvZmlsZS5zY2hvb2wgPSBzY2hvb2xzW2VtYWlsXS5zY2hvb2w7XG4gICAgICAgICAgICAgICRzY29wZS5hdXRvRmlsbGVkU2Nob29sID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG5cbiAgICAgICRzY29wZS51cGRhdGVQcm9maWxlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAudXBkYXRlUHJvZmlsZSgkc2NvcGUuc2VsZWN0ZWRVc2VyLl9pZCwgJHNjb3BlLnNlbGVjdGVkVXNlci5wcm9maWxlKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgJHNlbGVjdGVkVXNlciA9IGRhdGE7XG4gICAgICAgICAgICBzd2FsKFwiVXBkYXRlZCFcIiwgXCJQcm9maWxlIHVwZGF0ZWQuXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgc3dhbChcIk9vcHMsIHlvdSBmb3Jnb3Qgc29tZXRoaW5nLlwiKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdBZG1pblVzZXJzQ3RybCcsW1xuICAgICckc2NvcGUnLFxuICAgICckc3RhdGUnLFxuICAgICckc3RhdGVQYXJhbXMnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgVXNlclNlcnZpY2Upe1xuXG4gICAgICAkc2NvcGUucGFnZXMgPSBbXTtcbiAgICAgICRzY29wZS51c2VycyA9IFtdO1xuXG4gICAgICAvLyBTZW1hbnRpYy1VSSBtb3ZlcyBtb2RhbCBjb250ZW50IGludG8gYSBkaW1tZXIgYXQgdGhlIHRvcCBsZXZlbC5cbiAgICAgIC8vIFdoaWxlIHRoaXMgaXMgdXN1YWxseSBuaWNlLCBpdCBtZWFucyB0aGF0IHdpdGggb3VyIHJvdXRpbmcgd2lsbCBnZW5lcmF0ZVxuICAgICAgLy8gbXVsdGlwbGUgbW9kYWxzIGlmIHlvdSBjaGFuZ2Ugc3RhdGUuIEtpbGwgdGhlIHRvcCBsZXZlbCBkaW1tZXIgbm9kZSBvbiBpbml0aWFsIGxvYWRcbiAgICAgIC8vIHRvIHByZXZlbnQgdGhpcy5cbiAgICAgICQoJy51aS5kaW1tZXInKS5yZW1vdmUoKTtcbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzaXplIG9mIHRoZSBtb2RhbCBmb3Igd2hlbiBpdCBhcHBlYXJzLCB3aXRoIGFuIGFyYml0cmFyeSB1c2VyLlxuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHt9O1xuICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlci5zZWN0aW9ucyA9IGdlbmVyYXRlU2VjdGlvbnMoe3N0YXR1czogJycsIGNvbmZpcm1hdGlvbjoge1xuICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zOiBbXVxuICAgICAgfSwgcHJvZmlsZTogJyd9KTtcblxuICAgICAgZnVuY3Rpb24gdXBkYXRlUGFnZShkYXRhKXtcbiAgICAgICAgJHNjb3BlLnVzZXJzID0gZGF0YS51c2VycztcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gZGF0YS5wYWdlO1xuICAgICAgICAkc2NvcGUucGFnZVNpemUgPSBkYXRhLnNpemU7XG5cbiAgICAgICAgdmFyIHAgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnRvdGFsUGFnZXM7IGkrKyl7XG4gICAgICAgICAgcC5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5wYWdlcyA9IHA7XG4gICAgICB9XG5cbiAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgIC5nZXRQYWdlKCRzdGF0ZVBhcmFtcy5wYWdlLCAkc3RhdGVQYXJhbXMuc2l6ZSwgJHN0YXRlUGFyYW1zLnF1ZXJ5KVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICB1cGRhdGVQYWdlKGRhdGEpO1xuICAgICAgICB9KTtcblxuICAgICAgJHNjb3BlLiR3YXRjaCgncXVlcnlUZXh0JywgZnVuY3Rpb24ocXVlcnlUZXh0KXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAuZ2V0UGFnZSgkc3RhdGVQYXJhbXMucGFnZSwgJHN0YXRlUGFyYW1zLnNpemUsIHF1ZXJ5VGV4dClcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2UoZGF0YSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgJHNjb3BlLmdvVG9QYWdlID0gZnVuY3Rpb24ocGFnZSl7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmFkbWluLnVzZXJzJywge1xuICAgICAgICAgIHBhZ2U6IHBhZ2UsXG4gICAgICAgICAgc2l6ZTogJHN0YXRlUGFyYW1zLnNpemUgfHwgNTBcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuZ29Vc2VyID0gZnVuY3Rpb24oJGV2ZW50LCB1c2VyKXtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmFkbWluLnVzZXInLCB7XG4gICAgICAgICAgaWQ6IHVzZXIuX2lkXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnRvZ2dsZUNoZWNrSW4gPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XG4gICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBpZiAoIXVzZXIuc3RhdHVzLmNoZWNrZWRJbil7XG4gICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgICAgdGV4dDogXCJZb3UgYXJlIGFib3V0IHRvIGNoZWNrIGluIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIiFcIixcbiAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjREQ2QjU1XCIsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGNoZWNrIHRoZW0gaW4uXCIsXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICBVc2VyU2VydmljZVxuICAgICAgICAgICAgICAgIC5jaGVja0luKHVzZXIuX2lkKVxuICAgICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgICAgICAgJHNjb3BlLnVzZXJzW2luZGV4XSA9IHVzZXI7XG4gICAgICAgICAgICAgICAgICBzd2FsKFwiQ2hlY2tlZCBpblwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgaGFzIGJlZW4gY2hlY2tlZCBpbi4nLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIk5vdCBjaGVja2VkIGluXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBjb3VsZCBub3QgYmUgY2hlY2tlZCBpbi4gJywgXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgIC5jaGVja091dCh1c2VyLl9pZClcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgICAkc2NvcGUudXNlcnNbaW5kZXhdID0gdXNlcjtcbiAgICAgICAgICAgICAgc3dhbChcIkNoZWNrZWQgb3V0XCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBoYXMgYmVlbiBjaGVja2VkIG91dC4nLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJOb3QgY2hlY2tlZCBvdXRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGNvdWxkIG5vdCBiZSBjaGVja2VkIG91dC4gJywgXCJlcnJvclwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuYWNjZXB0VXNlciA9IGZ1bmN0aW9uKCRldmVudCwgdXNlciwgaW5kZXgpIHtcbiAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIC8vIGlmICghdXNlci5zdGF0dXMuYWRtaXR0ZWQpe1xuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBhY2NlcHQgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGFjY2VwdCB0aGVtLlwiLFxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyBhY2NlcHRlZCB0aGlzIHVzZXIuIFwiICtcbiAgICAgICAgICAgICAgICBcIlJlbWVtYmVyLCB0aGlzIHBvd2VyIGlzIGEgcHJpdmlsZWdlLlwiLFxuICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFwiWWVzLCBhY2NlcHQgdGhpcyB1c2VyLlwiLFxuICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2VcbiAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgICAgICAgICAuYWRtaXRVc2VyKHVzZXIuX2lkKVxuICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51c2Vyc1tpbmRleF0gPSB1c2VyO1xuICAgICAgICAgICAgICAgICAgICBzd2FsKFwiQWNjZXB0ZWRcIiwgdXNlci5wcm9maWxlLm5hbWUgKyAnIGhhcyBiZWVuIGFkbWl0dGVkLicsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIk5vdCBhZG1pdHRlZFwiLCB1c2VyLnByb2ZpbGUubmFtZSArICcgY291bGQgbm90IGJlIGFkbWl0dGVkLiAnLCBcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgICAgLy8gICAgIC8vIHVuYWRtaXQgdXNlclxuICAgICAgICAgICAgICBcbiAgICAgICAgICAvLyB9XG5cbiAgICAgIH07XG5cbiAgICAgIC8vIGRlbGV0ZSBVc2VyIGZyb20gcmVjb3Jkc1xuICAgICAgJHNjb3BlLnJlbW92ZVVzZXIgPSBmdW5jdGlvbigkZXZlbnQsIHVzZXIsIGluZGV4KSB7XG4gICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCJXaG9hLCB3YWl0IGEgbWludXRlIVwiLFxuICAgICAgICAgIHRleHQ6IFwiWW91IGFyZSBhYm91dCB0byBkZWxldGUgXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiIVwiLFxuICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNERDZCNTVcIixcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGRlbGV0ZSB1c2VyLlwiLFxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgICAgIHRleHQ6IFwiWW91ciBhY2NvdW50IHdpbGwgYmUgbG9nZ2VkIGFzIGhhdmluZyBkZWxldGVkIHRoaXMgdXNlci4gXCIgK1xuICAgICAgICAgICAgICAgIFwiUmVtZW1iZXIsIHRoaXMgcG93ZXIgaXMgYSBwcml2aWxlZ2UuXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogXCJZZXMsIGRlbGV0ZSB0aGlzIHVzZXIuXCIsXG4gICAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZVxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgICAgIC5yZW1vdmVVc2VyKHVzZXIuX2lkKVxuICAgICAgICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS51c2Vycy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgICAgICAgICAgICAgIHN3YWwoXCJEZWxldGVkXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBoYXMgYmVlbiBkZWxldGVkLicsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgc3dhbChcIk5vdCBkZWxldGVkXCIsIHVzZXIucHJvZmlsZS5uYW1lICsgJyBjb3VsZCBub3QgYmUgZGVsZXRlZC4gJywgXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfSk7XG5cbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSl7XG4gICAgICAgIGlmICh0aW1lKSB7XG4gICAgICAgICAgcmV0dXJuIG1vbWVudCh0aW1lKS5mb3JtYXQoJ01NTU0gRG8gWVlZWSwgaDptbTpzcyBhJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJHNjb3BlLnJvd0NsYXNzID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgICBpZiAodXNlci5hZG1pbil7XG4gICAgICAgICAgcmV0dXJuICdhZG1pbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVzZXIuc3RhdHVzLmNvbmZpcm1lZCkge1xuICAgICAgICAgIHJldHVybiAncG9zaXRpdmUnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJiAhdXNlci5zdGF0dXMuY29uZmlybWVkKSB7XG4gICAgICAgICAgcmV0dXJuICd3YXJuaW5nJztcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gc2VsZWN0VXNlcih1c2VyKXtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkVXNlciA9IHVzZXI7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZFVzZXIuc2VjdGlvbnMgPSBnZW5lcmF0ZVNlY3Rpb25zKHVzZXIpO1xuICAgICAgICAkKCcubG9uZy51c2VyLm1vZGFsJylcbiAgICAgICAgICAubW9kYWwoJ3Nob3cnKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWN0aW9ucyh1c2VyKXtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnQmFzaWMgSW5mbycsXG4gICAgICAgICAgICBmaWVsZHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdDcmVhdGVkIE9uJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VGltZSh1c2VyLnRpbWVzdGFtcClcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0xhc3QgVXBkYXRlZCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGZvcm1hdFRpbWUodXNlci5sYXN0VXBkYXRlZClcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NvbmZpcm0gQnknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSkgfHwgJ04vQSdcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0NoZWNrZWQgSW4nLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBmb3JtYXRUaW1lKHVzZXIuc3RhdHVzLmNoZWNrSW5UaW1lKSB8fCAnTi9BJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnRW1haWwnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmVtYWlsXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdUZWFtJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci50ZWFtQ29kZSB8fCAnTm9uZSdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgbmFtZTogJ1Byb2ZpbGUnLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmFtZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5uYW1lXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHZW5kZXInLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ2VuZGVyXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdTY2hvb2wnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuc2Nob29sXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHcmFkdWF0aW9uIFllYXInLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLnByb2ZpbGUuZ3JhZHVhdGlvblllYXJcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0Rlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5wcm9maWxlLmRlc2NyaXB0aW9uXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdFc3NheScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIucHJvZmlsZS5lc3NheVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBuYW1lOiAnQ29uZmlybWF0aW9uJyxcbiAgICAgICAgICAgIGZpZWxkczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1Bob25lIE51bWJlcicsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnBob25lTnVtYmVyXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdEaWV0YXJ5IFJlc3RyaWN0aW9ucycsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmRpZXRhcnlSZXN0cmljdGlvbnMuam9pbignLCAnKVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnU2hpcnQgU2l6ZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLnNoaXJ0U2l6ZVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTWFqb3InLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5tYWpvclxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnR2l0aHViJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uZ2l0aHViXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdXZWJzaXRlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24ud2Vic2l0ZVxuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgSGFyZHdhcmUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5uZWVkc0hhcmR3YXJlLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnSGFyZHdhcmUgUmVxdWVzdGVkJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaGFyZHdhcmVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgbmFtZTogJ0hvc3RpbmcnLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgSG9zdGluZyBGcmlkYXknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ob3N0TmVlZGVkRnJpLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgSG9zdGluZyBTYXR1cmRheScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmhvc3ROZWVkZWRTYXQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdHZW5kZXIgTmV1dHJhbCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLmdlbmRlck5ldXRyYWwsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdDYXQgRnJpZW5kbHknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5jYXRGcmllbmRseSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1Ntb2tpbmcgRnJpZW5kbHknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5zbW9raW5nRnJpZW5kbHksXG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdIb3N0aW5nIE5vdGVzJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uaG9zdE5vdGVzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIG5hbWU6ICdUcmF2ZWwnLFxuICAgICAgICAgICAgZmllbGRzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnTmVlZHMgUmVpbWJ1cnNlbWVudCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHVzZXIuY29uZmlybWF0aW9uLm5lZWRzUmVpbWJ1cnNlbWVudCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ1JlY2VpdmVkIFJlaW1idXJzZW1lbnQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5uZWVkc1JlaW1idXJzZW1lbnQgJiYgdXNlci5zdGF0dXMucmVpbWJ1cnNlbWVudEdpdmVuXG4gICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgIG5hbWU6ICdBZGRyZXNzJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXNlci5jb25maXJtYXRpb24uYWRkcmVzcyA/IFtcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3MubGluZTEsXG4gICAgICAgICAgICAgICAgICB1c2VyLmNvbmZpcm1hdGlvbi5hZGRyZXNzLmxpbmUyLFxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5jaXR5LFxuICAgICAgICAgICAgICAgICAgJywnLFxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5zdGF0ZSxcbiAgICAgICAgICAgICAgICAgIHVzZXIuY29uZmlybWF0aW9uLmFkZHJlc3MuemlwLFxuICAgICAgICAgICAgICAgICAgJywnLFxuICAgICAgICAgICAgICAgICAgdXNlci5jb25maXJtYXRpb24uYWRkcmVzcy5jb3VudHJ5LFxuICAgICAgICAgICAgICAgIF0uam9pbignICcpIDogJydcbiAgICAgICAgICAgICAgfSx7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0FkZGl0aW9uYWwgTm90ZXMnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB1c2VyLmNvbmZpcm1hdGlvbi5ub3Rlc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuc2VsZWN0VXNlciA9IHNlbGVjdFVzZXI7XG5cbiAgICB9XSk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignQXBwbGljYXRpb25DdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnJGh0dHAnLFxuICAgICdjdXJyZW50VXNlcicsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnU2Vzc2lvbicsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJGh0dHAsIGN1cnJlbnRVc2VyLCBTZXR0aW5ncywgU2Vzc2lvbiwgVXNlclNlcnZpY2Upe1xuXG4gICAgICAvLyBTZXQgdXAgdGhlIHVzZXJcbiAgICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcblxuICAgICAgLy8gSXMgdGhlIHN0dWRlbnQgZnJvbSBNSVQ/XG4gICAgICAkc2NvcGUuaXNNaXRTdHVkZW50ID0gJHNjb3BlLnVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXSA9PSAnbWl0LmVkdSc7XG5cbiAgICAgIC8vIElmIHNvLCBkZWZhdWx0IHRoZW0gdG8gYWR1bHQ6IHRydWVcbiAgICAgIGlmICgkc2NvcGUuaXNNaXRTdHVkZW50KXtcbiAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5hZHVsdCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFBvcHVsYXRlIHRoZSBzY2hvb2wgZHJvcGRvd25cbiAgICAgIHBvcHVsYXRlU2Nob29scygpO1xuICAgICAgX3NldHVwRm9ybSgpO1xuXG4gICAgICAkc2NvcGUucmVnSXNDbG9zZWQgPSBEYXRlLm5vdygpID4gU2V0dGluZ3MuZGF0YS50aW1lQ2xvc2U7XG5cbiAgICAgIC8qKlxuICAgICAgICogVE9ETzogSkFOSyBXQVJOSU5HXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHBvcHVsYXRlU2Nob29scygpe1xuXG4gICAgICAgICRodHRwXG4gICAgICAgICAgLmdldCgnL2Fzc2V0cy9zY2hvb2xzLmpzb24nKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICB2YXIgc2Nob29scyA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLnVzZXIuZW1haWwuc3BsaXQoJ0AnKVsxXTtcblxuICAgICAgICAgICAgaWYgKHNjaG9vbHNbZW1haWxdKXtcbiAgICAgICAgICAgICAgJHNjb3BlLnVzZXIucHJvZmlsZS5zY2hvb2wgPSBzY2hvb2xzW2VtYWlsXS5zY2hvb2w7XG4gICAgICAgICAgICAgICRzY29wZS5hdXRvRmlsbGVkU2Nob29sID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3VwZGF0ZVVzZXIoZSl7XG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZVByb2ZpbGUoU2Vzc2lvbi5nZXRVc2VySWQoKSwgJHNjb3BlLnVzZXIucHJvZmlsZSlcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoe1xuICAgICAgICAgICAgICB0aXRsZTogXCJBd2Vzb21lIVwiLFxuICAgICAgICAgICAgICB0ZXh0OiBcIllvdXIgYXBwbGljYXRpb24gaGFzIGJlZW4gc2F2ZWQuXCIsXG4gICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI2U3NjQ4MlwiXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5kYXNoYm9hcmQnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmVycm9yKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICBzd2VldEFsZXJ0KFwiVWggb2ghXCIsIFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIsIFwiZXJyb3JcIik7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF9zZXR1cEZvcm0oKXtcbiAgICAgICAgLy8gU2VtYW50aWMtVUkgZm9ybSB2YWxpZGF0aW9uXG4gICAgICAgICQoJy51aS5mb3JtJykuZm9ybSh7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICduYW1lJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGVudGVyIHlvdXIgbmFtZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2Nob29sOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzY2hvb2wnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgeW91ciBzY2hvb2wgbmFtZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeWVhcjoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAneWVhcicsXG4gICAgICAgICAgICAgIHJ1bGVzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtcHR5JyxcbiAgICAgICAgICAgICAgICAgIHByb21wdDogJ1BsZWFzZSBzZWxlY3QgeW91ciBncmFkdWF0aW9uIHllYXIuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdlbmRlcjoge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnZ2VuZGVyJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHNlbGVjdCBhIGdlbmRlci4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWR1bHQ6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ2FkdWx0JyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2hlY2tlZCcsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdZb3UgbXVzdCBiZSBhbiBhZHVsdCwgb3IgYW4gTUlUIHN0dWRlbnQuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUuc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICgkKCcudWkuZm9ybScpLmZvcm0oJ2lzIHZhbGlkJykpe1xuICAgICAgICAgIF91cGRhdGVVc2VyKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdDb25maXJtYXRpb25DdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHN0YXRlJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdVdGlscycsXG4gICAgJ1VzZXJTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgY3VycmVudFVzZXIsIFV0aWxzLCBVc2VyU2VydmljZSl7XG5cbiAgICAgIC8vIFNldCB1cCB0aGUgdXNlclxuICAgICAgdmFyIHVzZXIgPSBjdXJyZW50VXNlci5kYXRhO1xuICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuXG4gICAgICAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IERhdGUubm93KCkgPiB1c2VyLnN0YXR1cy5jb25maXJtQnk7XG5cbiAgICAgICRzY29wZS5mb3JtYXRUaW1lID0gVXRpbHMuZm9ybWF0VGltZTtcblxuICAgICAgX3NldHVwRm9ybSgpO1xuXG4gICAgICAkc2NvcGUuZmlsZU5hbWUgPSB1c2VyLl9pZCArIFwiX1wiICsgdXNlci5wcm9maWxlLm5hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJfXCIpO1xuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBBbGwgdGhpcyBqdXN0IGZvciBkaWV0YXJ5IHJlc3RyaWN0aW9uIGNoZWNrYm94ZXMgZm1sXG5cbiAgICAgIHZhciBkaWV0YXJ5UmVzdHJpY3Rpb25zID0ge1xuICAgICAgICAnVmVnZXRhcmlhbic6IGZhbHNlLFxuICAgICAgICAnVmVnYW4nOiBmYWxzZSxcbiAgICAgICAgJ0hhbGFsJzogZmFsc2UsXG4gICAgICAgICdLb3NoZXInOiBmYWxzZSxcbiAgICAgICAgJ051dCBBbGxlcmd5JzogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIGlmICh1c2VyLmNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zKXtcbiAgICAgICAgdXNlci5jb25maXJtYXRpb24uZGlldGFyeVJlc3RyaWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3RyaWN0aW9uKXtcbiAgICAgICAgICBpZiAocmVzdHJpY3Rpb24gaW4gZGlldGFyeVJlc3RyaWN0aW9ucyl7XG4gICAgICAgICAgICBkaWV0YXJ5UmVzdHJpY3Rpb25zW3Jlc3RyaWN0aW9uXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMgPSBkaWV0YXJ5UmVzdHJpY3Rpb25zO1xuXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgIGZ1bmN0aW9uIF91cGRhdGVVc2VyKGUpe1xuICAgICAgICB2YXIgY29uZmlybWF0aW9uID0gJHNjb3BlLnVzZXIuY29uZmlybWF0aW9uO1xuICAgICAgICAvLyBHZXQgdGhlIGRpZXRhcnkgcmVzdHJpY3Rpb25zIGFzIGFuIGFycmF5XG4gICAgICAgIHZhciBkcnMgPSBbXTtcbiAgICAgICAgT2JqZWN0LmtleXMoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcbiAgICAgICAgICBpZiAoJHNjb3BlLmRpZXRhcnlSZXN0cmljdGlvbnNba2V5XSl7XG4gICAgICAgICAgICBkcnMucHVzaChrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbmZpcm1hdGlvbi5kaWV0YXJ5UmVzdHJpY3Rpb25zID0gZHJzO1xuXG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLnVwZGF0ZUNvbmZpcm1hdGlvbih1c2VyLl9pZCwgY29uZmlybWF0aW9uKVxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgc3dlZXRBbGVydCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIldvbyFcIixcbiAgICAgICAgICAgICAgdGV4dDogXCJZb3UncmUgY29uZmlybWVkIVwiLFxuICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNlNzY0ODJcIlxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuZGFzaGJvYXJkJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgc3dlZXRBbGVydChcIlVoIG9oIVwiLCBcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiLCBcImVycm9yXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfc2V0dXBGb3JtKCl7XG4gICAgICAgIC8vIFNlbWFudGljLVVJIGZvcm0gdmFsaWRhdGlvblxuICAgICAgICAkKCcudWkuZm9ybScpLmZvcm0oe1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc2hpcnQ6IHtcbiAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ3NoaXJ0JyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIGdpdmUgdXMgYSBzaGlydCBzaXplISdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwaG9uZToge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAncGhvbmUnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgZW50ZXIgYSBwaG9uZSBudW1iZXIuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpZ25hdHVyZUxpYWJpbGl0eToge1xuICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnc2lnbmF0dXJlTGlhYmlsaXR5V2FpdmVyJyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2lnbmF0dXJlUGhvdG9SZWxlYXNlOiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVQaG90b1JlbGVhc2UnLFxuICAgICAgICAgICAgICBydWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbXB0eScsXG4gICAgICAgICAgICAgICAgICBwcm9tcHQ6ICdQbGVhc2UgdHlwZSB5b3VyIGRpZ2l0YWwgc2lnbmF0dXJlLidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaWduYXR1cmVDb2RlT2ZDb25kdWN0OiB7XG4gICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdzaWduYXR1cmVDb2RlT2ZDb25kdWN0JyxcbiAgICAgICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZW1wdHknLFxuICAgICAgICAgICAgICAgICAgcHJvbXB0OiAnUGxlYXNlIHR5cGUgeW91ciBkaWdpdGFsIHNpZ25hdHVyZS4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5zdWJtaXRGb3JtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCQoJy51aS5mb3JtJykuZm9ybSgnaXMgdmFsaWQnKSl7XG4gICAgICAgICAgX3VwZGF0ZVVzZXIoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ0Rhc2hib2FyZEN0cmwnLCBbXG4gICAgJyRyb290U2NvcGUnLFxuICAgICckc2NvcGUnLFxuICAgICckc2NlJyxcbiAgICAnY3VycmVudFVzZXInLFxuICAgICdzZXR0aW5ncycsXG4gICAgJ1V0aWxzJyxcbiAgICAnQXV0aFNlcnZpY2UnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgJ0VWRU5UX0lORk8nLFxuICAgICdEQVNIQk9BUkQnLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHNjZSwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgQXV0aFNlcnZpY2UsIFVzZXJTZXJ2aWNlLCBEQVNIQk9BUkQpe1xuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcbiAgICAgIHZhciB1c2VyID0gY3VycmVudFVzZXIuZGF0YTtcbiAgICAgICRzY29wZS51c2VyID0gdXNlcjtcblxuICAgICAgJHNjb3BlLkRBU0hCT0FSRCA9IERBU0hCT0FSRDtcbiAgICAgIFxuICAgICAgZm9yICh2YXIgbXNnIGluICRzY29wZS5EQVNIQk9BUkQpIHtcbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0FQUF9ERUFETElORV0nKSkge1xuICAgICAgICAgICRzY29wZS5EQVNIQk9BUkRbbXNnXSA9ICRzY29wZS5EQVNIQk9BUkRbbXNnXS5yZXBsYWNlKCdbQVBQX0RFQURMSU5FXScsIFV0aWxzLmZvcm1hdFRpbWUoU2V0dGluZ3MudGltZUNsb3NlKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRzY29wZS5EQVNIQk9BUkRbbXNnXS5pbmNsdWRlcygnW0NPTkZJUk1fREVBRExJTkVdJykpIHtcbiAgICAgICAgICAkc2NvcGUuREFTSEJPQVJEW21zZ10gPSAkc2NvcGUuREFTSEJPQVJEW21zZ10ucmVwbGFjZSgnW0NPTkZJUk1fREVBRExJTkVdJywgVXRpbHMuZm9ybWF0VGltZSh1c2VyLnN0YXR1cy5jb25maXJtQnkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBJcyByZWdpc3RyYXRpb24gb3Blbj9cbiAgICAgIHZhciByZWdJc09wZW4gPSAkc2NvcGUucmVnSXNPcGVuID0gVXRpbHMuaXNSZWdPcGVuKFNldHRpbmdzKTtcblxuICAgICAgLy8gSXMgaXQgcGFzdCB0aGUgdXNlcidzIGNvbmZpcm1hdGlvbiB0aW1lP1xuICAgICAgdmFyIHBhc3RDb25maXJtYXRpb24gPSAkc2NvcGUucGFzdENvbmZpcm1hdGlvbiA9IFV0aWxzLmlzQWZ0ZXIodXNlci5zdGF0dXMuY29uZmlybUJ5KTtcblxuICAgICAgJHNjb3BlLmRhc2hTdGF0ZSA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gICAgICAgIHZhciB1c2VyID0gJHNjb3BlLnVzZXI7XG4gICAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgICAgICAgY2FzZSAndW52ZXJpZmllZCc6XG4gICAgICAgICAgICByZXR1cm4gIXVzZXIudmVyaWZpZWQ7XG4gICAgICAgICAgY2FzZSAnb3BlbkFuZEluY29tcGxldGUnOlxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnZlcmlmaWVkICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlO1xuICAgICAgICAgIGNhc2UgJ29wZW5BbmRTdWJtaXR0ZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRJbmNvbXBsZXRlJzpcbiAgICAgICAgICAgIHJldHVybiAhcmVnSXNPcGVuICYmICF1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdjbG9zZWRBbmRTdWJtaXR0ZWQnOiAvLyBXYWl0bGlzdGVkIFN0YXRlXG4gICAgICAgICAgICByZXR1cm4gIXJlZ0lzT3BlbiAmJiB1c2VyLnN0YXR1cy5jb21wbGV0ZWRQcm9maWxlICYmICF1c2VyLnN0YXR1cy5hZG1pdHRlZDtcbiAgICAgICAgICBjYXNlICdhZG1pdHRlZEFuZENhbkNvbmZpcm0nOlxuICAgICAgICAgICAgcmV0dXJuICFwYXN0Q29uZmlybWF0aW9uICYmXG4gICAgICAgICAgICAgIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5jb25maXJtZWQgJiZcbiAgICAgICAgICAgICAgIXVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICAgIGNhc2UgJ2FkbWl0dGVkQW5kQ2Fubm90Q29uZmlybSc6XG4gICAgICAgICAgICByZXR1cm4gcGFzdENvbmZpcm1hdGlvbiAmJlxuICAgICAgICAgICAgICB1c2VyLnN0YXR1cy5hZG1pdHRlZCAmJlxuICAgICAgICAgICAgICAhdXNlci5zdGF0dXMuY29uZmlybWVkICYmXG4gICAgICAgICAgICAgICF1c2VyLnN0YXR1cy5kZWNsaW5lZDtcbiAgICAgICAgICBjYXNlICdjb25maXJtZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmFkbWl0dGVkICYmIHVzZXIuc3RhdHVzLmNvbmZpcm1lZCAmJiAhdXNlci5zdGF0dXMuZGVjbGluZWQ7XG4gICAgICAgICAgY2FzZSAnZGVjbGluZWQnOlxuICAgICAgICAgICAgcmV0dXJuIHVzZXIuc3RhdHVzLmRlY2xpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93V2FpdGxpc3QgPSAhcmVnSXNPcGVuICYmIHVzZXIuc3RhdHVzLmNvbXBsZXRlZFByb2ZpbGUgJiYgIXVzZXIuc3RhdHVzLmFkbWl0dGVkO1xuXG4gICAgICAkc2NvcGUucmVzZW5kRW1haWwgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZVxuICAgICAgICAgIC5yZXNlbmRWZXJpZmljYXRpb25FbWFpbCgpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHN3ZWV0QWxlcnQoJ1lvdXIgZW1haWwgaGFzIGJlZW4gc2VudC4nKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH07XG5cblxuICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIFRleHQhXG4gICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgdmFyIGNvbnZlcnRlciA9IG5ldyBzaG93ZG93bi5Db252ZXJ0ZXIoKTtcbiAgICAgICRzY29wZS5hY2NlcHRhbmNlVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmFjY2VwdGFuY2VUZXh0KSk7XG4gICAgICAkc2NvcGUuY29uZmlybWF0aW9uVGV4dCA9ICRzY2UudHJ1c3RBc0h0bWwoY29udmVydGVyLm1ha2VIdG1sKFNldHRpbmdzLmNvbmZpcm1hdGlvblRleHQpKTtcbiAgICAgICRzY29wZS53YWl0bGlzdFRleHQgPSAkc2NlLnRydXN0QXNIdG1sKGNvbnZlcnRlci5tYWtlSHRtbChTZXR0aW5ncy53YWl0bGlzdFRleHQpKTtcblxuXG4gICAgICAkc2NvcGUuZGVjbGluZUFkbWlzc2lvbiA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiV2hvYSFcIixcbiAgICAgICAgICB0ZXh0OiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd291bGQgbGlrZSB0byBkZWNsaW5lIHlvdXIgYWRtaXNzaW9uPyBcXG5cXG4gWW91IGNhbid0IGdvIGJhY2shXCIsXG4gICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6IFwiI0RENkI1NVwiLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBcIlllcywgSSBjYW4ndCBtYWtlIGl0LlwiLFxuICAgICAgICAgIGNsb3NlT25Db25maXJtOiB0cnVlXG4gICAgICAgICAgfSwgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAgICAgLmRlY2xpbmVBZG1pc3Npb24odXNlci5faWQpXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKHVzZXIpe1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuY3VycmVudFVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgICAgICRzY29wZS51c2VyID0gdXNlcjtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCdyZWcnKVxuICAuY29udHJvbGxlcignTG9naW5DdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyRzdGF0ZScsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnVXRpbHMnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlLCBzZXR0aW5ncywgVXRpbHMsIEF1dGhTZXJ2aWNlKXtcblxuICAgICAgLy8gSXMgcmVnaXN0cmF0aW9uIG9wZW4/XG4gICAgICB2YXIgU2V0dGluZ3MgPSBzZXR0aW5ncy5kYXRhO1xuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XG5cbiAgICAgIC8vIFN0YXJ0IHN0YXRlIGZvciBsb2dpblxuICAgICAgJHNjb3BlLmxvZ2luU3RhdGUgPSAnbG9naW4nO1xuXG4gICAgICBmdW5jdGlvbiBvblN1Y2Nlc3MoKSB7XG4gICAgICAgICRzdGF0ZS5nbygnYXBwLmRhc2hib2FyZCcpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBvbkVycm9yKGRhdGEpe1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJlc2V0RXJyb3IoKXtcbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICAgICAgcmVzZXRFcnJvcigpO1xuICAgICAgICBBdXRoU2VydmljZS5sb2dpbldpdGhQYXNzd29yZChcbiAgICAgICAgICAkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZCwgb25TdWNjZXNzLCBvbkVycm9yKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJlc2V0RXJyb3IoKTtcbiAgICAgICAgQXV0aFNlcnZpY2UucmVnaXN0ZXIoXG4gICAgICAgICAgJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQsIG9uU3VjY2Vzcywgb25FcnJvcik7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2V0TG9naW5TdGF0ZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICRzY29wZS5sb2dpblN0YXRlID0gc3RhdGU7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuc2VuZFJlc2V0RW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVtYWlsID0gJHNjb3BlLmVtYWlsO1xuICAgICAgICBBdXRoU2VydmljZS5zZW5kUmVzZXRFbWFpbChlbWFpbCk7XG4gICAgICAgIHN3ZWV0QWxlcnQoe1xuICAgICAgICAgIHRpdGxlOiBcIkRvbid0IFN3ZWF0IVwiLFxuICAgICAgICAgIHRleHQ6IFwiQW4gZW1haWwgc2hvdWxkIGJlIHNlbnQgdG8geW91IHNob3J0bHkuXCIsXG4gICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiBcIiNlNzY0ODJcIlxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9XG4gIF0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdSZXNldEN0cmwnLCBbXG4gICAgJyRzY29wZScsXG4gICAgJyRzdGF0ZVBhcmFtcycsXG4gICAgJyRzdGF0ZScsXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJHN0YXRlLCBBdXRoU2VydmljZSl7XG4gICAgICB2YXIgdG9rZW4gPSAkc3RhdGVQYXJhbXMudG9rZW47XG5cbiAgICAgICRzY29wZS5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgJHNjb3BlLmNoYW5nZVBhc3N3b3JkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHBhc3N3b3JkID0gJHNjb3BlLnBhc3N3b3JkO1xuICAgICAgICB2YXIgY29uZmlybSA9ICRzY29wZS5jb25maXJtO1xuXG4gICAgICAgIGlmIChwYXNzd29yZCAhPT0gY29uZmlybSl7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gXCJQYXNzd29yZHMgZG9uJ3QgbWF0Y2ghXCI7XG4gICAgICAgICAgJHNjb3BlLmNvbmZpcm0gPSBcIlwiO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIEF1dGhTZXJ2aWNlLnJlc2V0UGFzc3dvcmQoXG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgJHNjb3BlLnBhc3N3b3JkLFxuICAgICAgICAgIGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgICAgICAgc3dlZXRBbGVydCh7XG4gICAgICAgICAgICAgIHRpdGxlOiBcIk5lYXRvIVwiLFxuICAgICAgICAgICAgICB0ZXh0OiBcIllvdXIgcGFzc3dvcmQgaGFzIGJlZW4gY2hhbmdlZCFcIixcbiAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogXCIjZTc2NDgyXCJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBkYXRhLm1lc3NhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1NpZGViYXJDdHJsJywgW1xuICAgICckcm9vdFNjb3BlJyxcbiAgICAnJHNjb3BlJyxcbiAgICAnc2V0dGluZ3MnLFxuICAgICdVdGlscycsXG4gICAgJ0F1dGhTZXJ2aWNlJyxcbiAgICAnU2Vzc2lvbicsXG4gICAgJ0VWRU5UX0lORk8nLFxuICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgU2V0dGluZ3MsIFV0aWxzLCBBdXRoU2VydmljZSwgU2Vzc2lvbiwgRVZFTlRfSU5GTyl7XG5cbiAgICAgIHZhciBzZXR0aW5ncyA9IFNldHRpbmdzLmRhdGE7XG4gICAgICB2YXIgdXNlciA9ICRyb290U2NvcGUuY3VycmVudFVzZXI7XG5cbiAgICAgICRzY29wZS5FVkVOVF9JTkZPID0gRVZFTlRfSU5GTztcblxuICAgICAgJHNjb3BlLnBhc3RDb25maXJtYXRpb24gPSBVdGlscy5pc0FmdGVyKHVzZXIuc3RhdHVzLmNvbmZpcm1CeSk7XG5cbiAgICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xuICAgICAgJHNjb3BlLnRvZ2dsZVNpZGViYXIgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuc2hvd1NpZGViYXIgPSAhJHNjb3BlLnNob3dTaWRlYmFyO1xuICAgICAgfTtcblxuICAgICAgLy8gb2ggZ29kIGpRdWVyeSBoYWNrXG4gICAgICAkKCcuaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5zaG93U2lkZWJhciA9IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICB9XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgncmVnJylcbiAgLmNvbnRyb2xsZXIoJ1RlYW1DdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICdjdXJyZW50VXNlcicsXG4gICAgJ3NldHRpbmdzJyxcbiAgICAnVXRpbHMnLFxuICAgICdVc2VyU2VydmljZScsXG4gICAgJ1RFQU0nLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgY3VycmVudFVzZXIsIHNldHRpbmdzLCBVdGlscywgVXNlclNlcnZpY2UsIFRFQU0pe1xuICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IHVzZXIncyBtb3N0IHJlY2VudCBkYXRhLlxuICAgICAgdmFyIFNldHRpbmdzID0gc2V0dGluZ3MuZGF0YTtcblxuICAgICAgJHNjb3BlLnJlZ0lzT3BlbiA9IFV0aWxzLmlzUmVnT3BlbihTZXR0aW5ncyk7XG5cbiAgICAgICRzY29wZS51c2VyID0gY3VycmVudFVzZXIuZGF0YTtcblxuICAgICAgJHNjb3BlLlRFQU0gPSBURUFNO1xuXG4gICAgICBmdW5jdGlvbiBfcG9wdWxhdGVUZWFtbWF0ZXMoKSB7XG4gICAgICAgIFVzZXJTZXJ2aWNlXG4gICAgICAgICAgLmdldE15VGVhbW1hdGVzKClcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2Vycyl7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSBudWxsO1xuICAgICAgICAgICAgJHNjb3BlLnRlYW1tYXRlcyA9IHVzZXJzO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoJHNjb3BlLnVzZXIudGVhbUNvZGUpe1xuICAgICAgICBfcG9wdWxhdGVUZWFtbWF0ZXMoKTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmpvaW5UZWFtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAuam9pbk9yQ3JlYXRlVGVhbSgkc2NvcGUuY29kZSlcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICBfcG9wdWxhdGVUZWFtbWF0ZXMoKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5lcnJvcihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gcmVzLm1lc3NhZ2U7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUubGVhdmVUZWFtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgVXNlclNlcnZpY2VcbiAgICAgICAgICAubGVhdmVUZWFtKClcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XG4gICAgICAgICAgICAkc2NvcGUudGVhbW1hdGVzID0gW107XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9IHJlcy5kYXRhLm1lc3NhZ2U7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3JlZycpXG4gIC5jb250cm9sbGVyKCdWZXJpZnlDdHJsJywgW1xuICAgICckc2NvcGUnLFxuICAgICckc3RhdGVQYXJhbXMnLFxuICAgICdBdXRoU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIEF1dGhTZXJ2aWNlKXtcbiAgICAgIHZhciB0b2tlbiA9ICRzdGF0ZVBhcmFtcy50b2tlbjtcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICBpZiAodG9rZW4pe1xuICAgICAgICBBdXRoU2VydmljZS52ZXJpZnkodG9rZW4sXG4gICAgICAgICAgZnVuY3Rpb24odXNlcil7XG4gICAgICAgICAgICAkc2NvcGUuc3VjY2VzcyA9IHRydWU7XG5cbiAgICAgICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihlcnIpe1xuXG4gICAgICAgICAgICAkc2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfV0pOyJdfQ==
