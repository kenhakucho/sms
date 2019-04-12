FROM node:8.9.4-alpine
MAINTAINER Admin <admin@admin.com>
#CMD echo "now running..."

# ENV NODE_ENV production
ENV NODE_ENV development

RUN npm install -g express-generator
WORKDIR /home/node

# ADD src/ /home/node/sms/
#RUN express --view=pug sms
#WORKDIR /home/node/sms
#RUN npm install --save express
#RUN npm install --save websocket
#RUN npm install 
#RUN npm install log4js --save
# RUN npm install -g npm-install-missing

EXPOSE 3000
#CMD npm start
#RUN npm install -g forever
#RUN forever start /home/node/sms/app.js

