FROM node:8.11.4

RUN apt-get update

#
# Create working directory and copy project into it
#
WORKDIR /myApp
ADD . /myApp

#
# Installing and Configuring Node-Oracledb with Oracle DB Instant Client
#
RUN apt-get install libaio1 -y
ENV LD_LIBRARY_PATH="/myApp/oradbInstantClient"
ENV TNS_ADMIN="/myApp/oradbInstantClient/network/admin"

# 
# Download Package dependencies and run app...
RUN npm install
EXPOSE 3000
CMD npm start
