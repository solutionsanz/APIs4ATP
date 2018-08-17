FROM node:9.11.1
WORKDIR /myApp
ADD . /myApp
RUN npm install
EXPOSE 3000
CMD npm start
