angular.module('reg')
    .controller('TeamsCtrl', [
        '$scope',
        'currentUser',
        'settings',
        'Utils',
        'UserService',
        'TeamService',
        'TEAM',
        function($scope, currentUser, settings, Utils, UserService, TeamService, TEAM) {
            // Get the current user's most recent data.
            var Settings = settings.data;

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

            $scope.createTeam = function() {
                if ($scope.teamTitle == null || $scope.teamDesc == null || $scope.teamTitle == "" || $scope.teamDesc == "") {
                    alert("Please fill in a title and description.")
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
                        alert("Team '" + $scope.teamTitle + "' already exists.");
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
