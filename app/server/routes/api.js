const UserController = require('../controllers/UserController');
const SettingsController = require('../controllers/SettingsController');
const TeamController = require('../controllers/TeamController');

const request = require('request');

module.exports = function (router) {

    function getToken(req) {
        return req.headers['x-access-token'];
    }

    /**
     * Using the access token provided, check to make sure that
     * you are, indeed, an admin.
     */
    function isAdmin(req, res, next) {

        return next(); // for testing purposes,TODO: remove!!!!

        const token = getToken(req);

        UserController.getByToken(token, function (err, user) {

            if (err) {
                return res.status(500).send(err);
            }

            if (user && user.admin) {
                req.user = user;
                return next();
            }

            return res.status(401).send({
                message: 'Get outta here, punk!'
            });

        });
    }

    /**
     * [Users API Only]
     *
     * Check that the id param matches the id encoded in the
     * access token provided.
     *
     * That, or you're the admin, so you can do whatever you
     * want I suppose!
     */
    function isOwnerOrAdmin(req, res, next) {
        const token = getToken(req);
        const userId = req.params.id;

        UserController.getByToken(token, function (err, user) {

            if (err || !user) {
                return res.status(500).send(err);
            }

            if (user._id == userId || user.admin) {
                return next();
            }
            return res.status(400).send({
                message: 'Token does not match user id.'
            });
        });
    }

    /**
     * Default response to send an error and the data.
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    function defaultResponse(req, res) {
        return function (err, data) {
            if (err) {
                if (process.env.NODE_ENV === 'production') {

                } else {
                    return res.status(500).send(err);
                }
            } else {
                return res.status(200).json(data);
            }
        };
    }

    /**
     *  API!
     */


    // ---------------------------------------------
    // Teams
    // ---------------------------------------------

    router.get('/teams', isAdmin, function (req, res) {
        const query = req.query;

        if (query.page && query.size) {
            TeamController.getPage(query, defaultResponse(req, res));
        } else {
            TeamController.getAll(defaultResponse(req, res));
        }
    });

    router.post('/teams', isAdmin, function (req, res) {
        const team = req.body.team;
        TeamController.createTeam(team, defaultResponse(req, res));
    });

    router.put('/teams/:id', isOwnerOrAdmin, function (req, res) {
        const team = req.body.team;
        const id = req.params.id;

        TeamController.updateTeamById(id, team, defaultResponse(req, res));
    });

    router.delete('/teams/:id', isAdmin, function (req, res) {
        const id = req.params.id;
        const team = req.team;
        TeamController.removeTeamById(id, team, defaultResponse(req, res));
    });


    // ---------------------------------------------
    // Users
    // ---------------------------------------------

    /**
     * [ADMIN ONLY]
     *
     * GET - Get all users, or a page at a time.
     * ex. Paginate with ?page=0&size=100
     */
    router.get('/users', isAdmin, function (req, res) {
        const query = req.query;

        if (query.page && query.size) {

            UserController.getPage(query, defaultResponse(req, res));

        } else {

            UserController.getAll(defaultResponse(req, res));

        }
    });


    /**
     * [ADMIN ONLY]
     */
    router.get('/users/stats', isAdmin, function (req, res) {
        UserController.getStats(defaultResponse(req, res));
    });

    /**
     * [OWNER/ADMIN]
     *
     * GET - Get a specific user.
     */
    router.get('/users/:id', isOwnerOrAdmin, function (req, res) {
        UserController.getById(req.params.id, defaultResponse(req, res));
    });

    /**
     * [OWNER/ADMIN]
     *
     * PUT - Update a specific user's profile.
     */
    router.put('/users/:id/profile', isOwnerOrAdmin, function (req, res) {
        const profile = req.body.profile;
        const id = req.params.id;

        UserController.updateProfileById(id, profile, defaultResponse(req, res));
    });

    /**
     * [OWNER/ADMIN]
     *
     * PUT - Update a specific user's confirmation information.
     */
    router.put('/users/:id/confirm', isOwnerOrAdmin, function (req, res) {
        const confirmation = req.body.confirmation;
        const id = req.params.id;

        UserController.updateConfirmationById(id, confirmation, defaultResponse(req, res));
    });

    /**
     * [OWNER/ADMIN]
     *
     * POST - Decline an acceptance.
     */
    router.post('/users/:id/decline', isOwnerOrAdmin, function (req, res) {
        const confirmation = req.body.confirmation;
        const id = req.params.id;

        UserController.declineById(id, defaultResponse(req, res));
    });

    /**
     * Get a user's team member's names. Uses the code associated
     * with the user making the request.
     */
    router.get('/users/:id/team', isOwnerOrAdmin, function (req, res) {
        const id = req.params.id;
        UserController.getTeammates(id, defaultResponse(req, res));
    });

    /**
     * Update a teamcode. Join/Create a team here.
     * {
   *   code: STRING
   * }
     */
    router.put('/users/:id/team', isOwnerOrAdmin, function (req, res) {
        const teamId = req.body.teamId;
        const id = req.params.id;

        UserController.createOrJoinTeam(id, teamId, defaultResponse(req, res));

    });

    /**
     * Remove a user from a team.
     */
    router.delete('/users/:id/team', isOwnerOrAdmin, function (req, res) {
        const id = req.params.id;

        UserController.leaveTeam(id, defaultResponse(req, res));
    });

    /**
     * Update a user's password.
     * {
   *   oldPassword: STRING,
   *   newPassword: STRING
   * }
     */
    router.put('/users/:id/password', isOwnerOrAdmin, function (req, res) {
        return res.status(304).send();
        // Currently disable.
        // var id = req.params.id;
        // var old = req.body.oldPassword;
        // var pass = req.body.newPassword;

        // UserController.changePassword(id, old, pass, function(err, user){
        //   if (err || !user){
        //     return res.status(400).send(err);
        //   }
        //   return res.json(user);
        // });
    });

    /**
     * Admit a user. ADMIN ONLY, DUH
     *
     * Also attaches the user who did the admitting, for liabaility.
     */
    router.post('/users/:id/admit', isAdmin, function (req, res) {
        // Accept the hacker. Admin only
        const id = req.params.id;
        const user = req.user;
        UserController.admitUser(id, user, defaultResponse(req, res));
    });

    /**
     * Check in a user. ADMIN ONLY, DUH
     */
    router.post('/users/:id/checkin', isAdmin, function (req, res) {
        const id = req.params.id;
        const user = req.user;
        UserController.checkInById(id, user, defaultResponse(req, res));
    });

    /**
     * Check out a user. ADMIN ONLY, DUH
     */
    router.post('/users/:id/checkout', isAdmin, function (req, res) {
        const id = req.params.id;
        const user = req.user;
        UserController.checkOutById(id, user, defaultResponse(req, res));
    });

    /**
     * remove a user. ADMIN ONLY, DUH
     */
    router.post('/users/:id/remove', isAdmin, function (req, res) {
        const id = req.params.id;
        const user = req.user;
        UserController.removeUserById(id, user, defaultResponse(req, res));
    });


    // ---------------------------------------------
    // Settings [ADMIN ONLY!]
    // ---------------------------------------------

    /**
     * Get the public settings.
     * res: {
   *   timeOpen: Number,
   *   timeClose: Number,
   *   timeToConfirm: Number,
   *   acceptanceText: String,
   *   confirmationText: String
   * }
     */
    router.get('/settings', function (req, res) {
        SettingsController.getPublicSettings(defaultResponse(req, res));
    });

    /**
     * Update the acceptance text.
     * body: {
   *   text: String
   * }
     */
    router.put('/settings/waitlist', isAdmin, function (req, res) {
        const text = req.body.text;
        SettingsController.updateField('waitlistText', text, defaultResponse(req, res));
    });

    /**
     * Update the acceptance text.
     * body: {
   *   text: String
   * }
     */
    router.put('/settings/acceptance', isAdmin, function (req, res) {
        const text = req.body.text;
        SettingsController.updateField('acceptanceText', text, defaultResponse(req, res));
    });

    /**
     * Update the confirmation text.
     * body: {
   *   text: String
   * }
     */
    router.put('/settings/confirmation', isAdmin, function (req, res) {
        const text = req.body.text;
        SettingsController.updateField('confirmationText', text, defaultResponse(req, res));
    });

    /**
     * Update the confirmation date.
     * body: {
   *   time: Number
   * }
     */
    router.put('/settings/confirm-by', isAdmin, function (req, res) {
        const time = req.body.time;
        SettingsController.updateField('timeConfirm', time, defaultResponse(req, res));
    });

    /**
     * Set the registration open and close times.
     * body : {
   *   timeOpen: Number,
   *   timeClose: Number
   * }
     */
    router.put('/settings/times', isAdmin, function (req, res) {
        const open = req.body.timeOpen;
        const close = req.body.timeClose;
        SettingsController.updateRegistrationTimes(open, close, defaultResponse(req, res));
    });

    /**
     * Get the whitelisted emails.
     *
     * res: {
   *   emails: [String]
   * }
     */
    router.get('/settings/whitelist', isAdmin, function (req, res) {
        SettingsController.getWhitelistedEmails(defaultResponse(req, res));
    });

    /**
     * [ADMIN ONLY]
     * {
   *   emails: [String]
   * }
     * res: Settings
     *
     */
    router.put('/settings/whitelist', isAdmin, function (req, res) {
        const emails = req.body.emails;
        SettingsController.updateWhitelistedEmails(emails, defaultResponse(req, res));
    });

};
