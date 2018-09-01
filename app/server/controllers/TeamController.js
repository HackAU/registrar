const Team = require('../models/Team');
const User = require('../models/User');
const _ = require('lodash');
const TeamController = {};


TeamController.createTeam = function (data, callback) {
    const team = new Team();
    _.merge(team, data);
    team.save(function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null, {team})

    });
};


/**
 * Get a user by id.
 * @param  {String}   id       User id
 * @param  {Function} callback args(err, user)
 */
TeamController.getById = function (id, callback){
  Team.findById(id, callback);
};


TeamController.removeTeamById = function(id, team, callback) {
    Team.findByIdAndRemove(id, callback);
};


TeamController.getAll = function (callback) {
    Team.find({}, (err, teams) => {
        const teamsIds =_.map(teams, team => team.id);
        User.find(User.where('teamId').in(teamsIds), (err, users) => {
            callback(err,_.map(teams, team => {
                team._doc.members =  _.filter(users, {'teamId': team.id})
                return team;
            }));
        } );
    });
};


TeamController.getPage = function(query, callback) {
    const page = query.page;
    const size = parseInt(query.size);
    const searchText = query.text;

    const findQuery = {};
    if (searchText.length > 0){
        const queries = [];
        const re = new RegExp(searchText, 'i');
        queries.push({ title: re });
        queries.push({ description: re });

        findQuery.$or = queries;
    }

    Team
        .find(findQuery)
        .sort({
            'lastUpdated': 'asc'
        })
        .skip(page * size)
        .limit(size)
        .exec(function (err, teams){
            if (err || !users){
                return callback(err);
            }

            Team.count(findQuery).exec(function(err, count){

                if (err){
                    return callback(err);
                }

                return callback(null, {
                    teams,
                    page: page,
                    size: size,
                    count,
                    totalPages: Math.ceil(count / size)
                });
            });

        });
};


module.exports = TeamController;
