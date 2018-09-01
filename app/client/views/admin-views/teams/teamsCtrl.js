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
                });

            $scope.deleteTeam = function(team, index) {
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

          $scope.createTeam = function() {
              if ($scope.teamTitle == null || $scope.teamDesc == null || $scope.teamTitle == "" || $scope.teamDesc == "") {
                  $scope.error = "Please fill in a title and description.";
              } else {
                  $scope.teamTitle = $scope.teamTitle.replace(/ +(?= )/g,'');
                  $scope.teamTitle = $scope.teamTitle.toUpperCase();
                  if (!isTitleExist()) {
                      TeamService.createTeam({
                          title: $scope.teamTitle,
                          description: $scope.teamDesc
                      })
                        .success(({team}) => {
                            console.log("team created:", team);
                            $scope.teams.push(team);
                        })
                  }
                  else {
                      $scope.error = "Team '" + $scope.teamTitle + "' already exists.";
                  }
              }
              $scope.teamTitle = "";
              $scope.teamDesc = "";
          }

          function isTitleExist() {
              for (var i = 0; i < $scope.teams.length; i++) {
                  if ($scope.teamTitle === $scope.teams[i].title) {
                      return true;
                  }
              }
              return false;
          }

        }
    ]);
