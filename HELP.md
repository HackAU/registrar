

# Dependencies:
npm install
bower install

# Configuration:
npm run config

# MongoDB:
mkdir db
mongod --dbpath db --bind_ip 127.0.0.1 --nohttpinterface

# Building and running:
gulp server


# Deploying to Heroku:
1. add Procfile like this:
`web: node server_app.js`
2. add node version to package.json
 `"engines": {
    "node": "6.10.3",
    "npm": "3.10.10"
  }
  `
3. add to scripts in package.json
- for front-end package managers e.g
`"postinstall": "bower install"`
or use "preinstall" as needed.

- `"start": "node server_app.js"`

4. Make sure you're not using local .env e.g:
`require('dotenv').load();`

5. dont forget to define all env variables in heroku env in settings.
otherwise expect lots of crashes.




