Acorn project
------

This repository contains Acorn project, that is a quick way to create REST APIs out of a CSV data file. 

Containerise Acorn Application
------

   - Ensure you have installed Vagrant on your laptop/PC. If you need help, [read this blog](https://redthunder.blog/2018/02/13/teaching-how-to-use-vagrant-to-simplify-building-local-dev-and-test-environments/). 

   - Download or Git clone this Github repo: 

			git clone https://github.com/solutionsanz/acorn

   - In a terminal window, go to where you cloned/downloaded the repository (acorn) – Notice that the Vagrantfile is already in there.

    - Start up your Vagrant Dev VM:

	        vagrant up

    - A new Ubuntu VM will be provisioned and a bootstrap script will install all required utilities (e.g. docker).
    
    - You can now **vagrant ssh** into it.

    - Go to your working directory (mounted from host OS).

            cd /vagrant

    - Use the setEnv_template to create your own environment properties file. As a minimum, make sure to set the MongoDB server, username and password.

            cp setEnv_template setEnv && vi setEnv

    - Switch user to **ubuntu**

            sudo su ubuntu

    - Containerise the application by using the provided Dockerfile:

	        docker build .

    - Execute locally your new Docker Image of your Acorn Application:

	        docker run --env-file setEnv -p 3000:3000 -it [image_id] 

        Note, if you are unsure about the actual **image_id**, you can use **docker images** to gather all images being generated.

        Also note that by default port 3000 was configured in by vagrant as part of your VM setup.

    - In your host OS, open a browser and go to: http://localhost:3000/ws - Test your app. 
    
    - Upload some data via the CSV file uploader, then open up the included Swagger UI (http://localhost:3000) and play with the various APIs.
    
            Authenticate as: demo

    - Once you feel confortable with the Docker image, push it to Docker Hub. First, login to Docker Hub:

            docker login

            Enter docker hub username, password and email.

Deploy Acorn application in Kubernetes
------

   - Go to where you have installed and configured **kubectl**.

        Note: [Read this blog](https://redthunder.blog/2018/04/18/teaching-how-to-quickly-provision-a-dev-kubernetes-environment-locally-or-in-oracle-cloud/) if you need assistance to provision Kubernetes.

   - Download or Git clone this Github repo: 

			git clone https://github.com/solutionsanz/acorn

   - Go to where you cloned/downloaded the repository (acorn)

    - Change directory to deploy

            cd deploy

    - Deploy Acorn Kubernetes application resources (deployment, service, ingress)

            ./deploy.sh

    - Open up Kubernetes Dashboard UI or equivalent (e.g. WeaveScope) and validate all Acorn resources were deployed successfully.

    - Test your application, open a browser and go to: **http://[LB|IP]/acorn/ws/** - Test your app. 
    
    - Upload some data via the CSV file uploader, then open up the included Swagger UI **http://[LB|IP]/acorn/** and play with the various APIs.
    
            Authenticate as: demo
    
If you need any assistance, feel free to [contact me](https://www.linkedin.com/in/citurria/).