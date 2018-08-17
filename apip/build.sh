################################
################################
######
######	This script was designed to be invoked into DevCS as a Shell step.
######
######	It can alternaticely be run standalone. If so just adjust the paths and ensure 
######	you have the right json configuration files.
######
######  Author: Carlos Rodriguez Iturria.
######  See: https://redthunder.blog/2017/03/08/teaching-how-to-devops-automate-the-provisioning-of-external-apis-using-oracle-api-platform-and-developer-cloud-service/ for more information
################################
################################

####
#
# The next parameters can be in DevCS as Build Properties or in your script as export system variables...
# It's up to you, whatever works best. 
#
# Just make sure you set the right values:
#
####

#export APIPCS_USERNAME=''
#export APIPCS_PASSWD=''
#export APIPCS_LOCATION=''
#export API_GW_ID=''
#export API_NAME=''
#export API_VERSION=''
#export API_URI=''
#export INTERNAL_API=''
#export API_DESC=''

# Use the next line to get an API template, in case you don't have one yet:
# Note: This is just a once-off task.
#curl -i -X GET -u ${APIPCS_USERNAME}:${APIPCS_PASSWD}" "${APIPCS_LOCATION}/apiplatform/management/v1/apis/{API_ID}" -v

#1) POST Create a new API

####
# Fork required json files from templates
####


cp apiBodyTemplate.json apiBody.json
cp apiDeploymentBodyTemplate.json apiDeploymentBody.json
cp apiIdBodyTemplate.json apiIdBody.json

####
# Configuring apiBody.json:
####

#-> Setting: "@API_NAME@"
sed -i "s/@API_NAME@/${API_NAME}/g" apiBody.json

#-> Setting: "@API_URI@"
sed -i "s/@API_URI@/${API_URI}/g" apiBody.json

#-> Setting: "@INTERNAL_API@"
sed -i "s/@INTERNAL_API@/${INTERNAL_API}/g" apiBody.json

#-> Setting: "@API_DESC@"
sed -i "s/@API_DESC@/${API_DESC}/g" apiBody.json

####
# Calling POST to create new API:
####

curl -u "${APIPCS_USERNAME}:${APIPCS_PASSWD}" -X POST -H "Content-Type: application/json" -d @apiBody.json "${APIPCS_LOCATION}/apiplatform/management/v1/apis/" -v > out

####
# Extracting API ID from response:
####

export API_ID=`sed "s/\"//g" out | awk -F, '{print $1}' | awk -F: '{print $2}'`


#3) Update API state to RELEASED:

####
# Calling PUT to set API state to RELEASED:
####

curl -u "${APIPCS_USERNAME}:${APIPCS_PASSWD}" -X PUT -H "Content-Type: application/json" -d '{"state": "RELEASED","stateComments": "API Released"}' "${APIPCS_LOCATION}/apiplatform/management/v1/apis/${API_ID}/state" -v


#4) Update API Identity:

####
# Configuring apiIdBody.json:
####

#-> Setting: "@API_NAME@"
sed -i "s/@API_NAME@/${API_NAME}/g" apiIdBody.json

#-> Setting: "@API_VERSION@"
sed -i "s/@API_VERSION@/${API_VERSION}/g" apiIdBody.json

####
# Calling PUT to set API identity:
####

curl -u "${APIPCS_USERNAME}:${APIPCS_PASSWD}" -X PUT -H "Content-Type: application/json" -d @apiIdBody.json "${APIPCS_LOCATION}/apiplatform/management/v1/apis/${API_ID}/identity" -v


#5) Publish API to Development Portal:

####
# Calling PUT to publish API to Developers Portal:
####

curl -u "${APIPCS_USERNAME}:${APIPCS_PASSWD}" -X PUT -H "Content-Type: application/json" -d '{"state":"PUBLISHED"}' "${APIPCS_LOCATION}/apiplatform/management/v1/apis/${API_ID}/publication" -v


#6) Deploy API to API Gateway:

####
# Configuring apiDeploymentBody.json:
####

#-> Setting: "@API_GW_ID@"
sed -i "s/@API_GW_ID@/${API_GW_ID}/g" apiDeploymentBody.json

####
# Calling POST to deploy API to configured API Gateway:
####

curl -u "${APIPCS_USERNAME}:${APIPCS_PASSWD}" -X POST -H "Content-Type: application/json" -d @apiDeploymentBody.json "${APIPCS_LOCATION}/apiplatform/management/v1/apis/${API_ID}/deployments" -v




