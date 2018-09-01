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
