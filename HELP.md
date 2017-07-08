

#Dependencies:
npm install
bower install

#Configuration:
npm run config

#MongoDB:
mkdir db
mongod --dbpath db --bind_ip 127.0.0.1 --nohttpinterface

#Building and running:
gulp server

