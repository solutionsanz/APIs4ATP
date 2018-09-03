APIs 4 ATP project
------

This repository contains APIs 4 ATP project, that is a quick way consume REST APIs to interact with Oracle Autonomous Database for Online Transaction Processing (ATP). 

Containerise APIs 4 ATP Application
------

   - Ensure you have installed Vagrant on your laptop/PC. If you need help, [read this blog](https://redthunder.blog/2018/02/13/teaching-how-to-use-vagrant-to-simplify-building-local-dev-and-test-environments/). 

   - Download or Git clone this Github repo: 

			git clone https://github.com/solutionsanz/APIs4ATP

   - In a terminal window, go to where you cloned/downloaded the repository (APIs 4 ATP) – Notice that the Vagrantfile is already in there.

   - Start up your Vagrant Dev VM:

        vagrant up

   - A new Ubuntu VM will be provisioned and a bootstrap script will install all required utilities (e.g. docker).

   - You can now **vagrant ssh** into it.

   - Go to your working directory (mounted from host OS).

        cd /vagrant

   - Switch user to **ubuntu**

        sudo su ubuntu

   - Containerise the application by using the provided Dockerfile:

        docker build .

   - Execute locally your new Docker Image of your APIs 4 ATP Application:

        docker run --env-file setEnv -p 3000:3000 -it [image_id] 

     Note, if you are unsure about the actual **image_id**, you can use **docker images** to gather all images being generated.

     Also note that by default port 3000 was configured in by vagrant as part of your VM setup.

   - In your host OS, open a browser and go to: http://localhost:3000 - Test your app. 
    

For more information see the [full blog here](https://redthunder.blog/2018/08/22/teaching-how-to-get-microservices-to-consume-oracle-autonomous-transaction-processing-database-atp/)

    
If you need any assistance, feel free to [contact me](https://www.linkedin.com/in/citurria/).