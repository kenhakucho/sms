FROM node:latest
MAINTAINER Admin <admin@admin.com>
CMD echo "now running..."
# ADD src/ /home/node/sms/
RUN npm install -g express-generator
WORKDIR /home/node
RUN express --view=pug sms
WORKDIR /home/node/sms
RUN npm install --save express
RUN npm install --save websocket
RUN npm install 
EXPOSE 3000
# ENV NODE_ENV production
ENV NODE_ENV development
RUN npm start

