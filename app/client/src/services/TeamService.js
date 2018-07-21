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
