require('dotenv').load();
var mongoose        = require('mongoose');
var database        = process.env.MONGODB_URI;
dbConnectionPromise = mongoose.connect(database);
dbConnectionPromise.then(() => { // if all is ok we will be here
var UserController = require('../app/server/controllers/UserController');

var users = 1000;
var username = 'hacker';

for (var i = 0; i < users; i++){

  if(i== 999) {
    console.log("Done.")
    return;
  }
  console.log(username + i);
  UserController
    .removeUserByEmail(username + i + '@school.edu', 'foobar', function(){
        
    });
}
});


dbConnectionPromise.catch(() => {
    console.log("[ERROR] connecting to database...");
})