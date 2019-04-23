FROM node:8.9.4-alpine
MAINTAINER Admin <admin@admin.com>
#CMD echo "now running..."

# ENV NODE_ENV production
ENV NODE_ENV development

RUN npm install -g express-generator
WORKDIR /home/node

# ADD src/ /home/node/sms/

RUN express --view=ejs sms
WORKDIR /home/node/sms
RUN npm install --save express
RUN npm install --save websocket
RUN npm install 
RUN npm install log4js --save

# RUN npm install -g npm-install-missing
RUN npm install --save ejs
RUN npm i --save websocket
RUN npm install -g eslint eslint-config-airbnb eslint-plugin-react
RUN npm i -g nodemon
RUN npm i nodemon           # nodemon start
RUN npm i --save mysql
RUN npm install express-session --save
RUN npm install ejs-locals --save      
RUN npm install --save multer          # mkdir -p ./public/images/uploads
RUN npm install sass --save
RUN npm install node-sass
RUN npm i --save socket.io
RUN npm install --save socketio-file-upload

EXPOSE 3000
EXPOSE 13000
#CMD npm start
RUN npm install -g forever
#RUN forever start /home/node/sms/app.js

