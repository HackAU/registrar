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
                    console.log(teams);
                    $scope.teams = teams;
                })


            $scope.deleteTeam = function (team) {

            }

            $scope.createTeam = function () {

                TeamService.createTeam({title: $scope.teamTitle, description: $scope.teamDesc})
                    .success( ({team}) => {
                        console.log("team created:", team);
                        $scope.teams.push(team);
                    })
            }


        }]);
