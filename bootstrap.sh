    echo "##########################################################################"
    echo "###################### Updating packages ##############################"

    sudo apt-get update

    echo "##########################################################################"    
    echo "###################### Installing Git ##############################"

    sudo apt-get install git -y
   
    echo "##########################################################################"
    echo "############### Installing NodeJS on an Ubuntu Machine ###############"

    sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

    sudo apt-get install nodejs -y

    echo "##########################################################################"
    echo "############# Installing and configuring Docker for Dev #######################"

    sudo apt-get install docker.io -y
    sudo usermod -G docker ubuntu    
    docker --version

    #echo "########################################################################"
    #echo "###################### Configuring Oracle DB Instant Client ##############################"

    # export LD_LIBRARY_PATH=/vagrant/oradbInstantClient
    # sudo apt-get install libaio1
    # See: https://oracle.github.io/odpi/doc/installation.html#linux