# Assignment 1

In the first assignment, the goal is mostly to get set up and to familiarize yourself with [ScalyShop](https://git.chalmers.se/courses/dat490/resources/scalyshop), our little case study application for the course. You will clone the app, potentially extend it, and dockerize it. The following weekly assignments will see us use, extend, and modify this initial deployment in various ways.

**Deadline**: Wednesday Week 3

**Discussion Session**: Friday Week 3

**Related Lectures**: Lectures 1 to 3

**Deliverables:**
* Written report (submitted in Canvas, please use report template in Canvas)
* Updates in GitLab

## T1.1 - Cloning the project <span style="color:red">[basic]</span>
Your first task is simple - clone ScalyShop. Log in to GitLab and locate the "group" we created for you ("dat490-2022-groupid"). A "group" in GitLab is basically a folder containing related projects. Your group should already contain three repositories. Find the repos containing the frontend and backend, clone them, and follow the initial installation instructions. Make sure that you have [Node](https://nodejs.org/en/download/) and [MongoDB](https://www.mongodb.com) installed on your computer.

Start the application according to the installation instructions, and make sure that the application successfully starts and is operable. If you find problems in the installation instructions, please provide a pull request with suggested updates (or at least create an issue in the project repository).

**(Very briefly) document your working solution in your report. It's sufficient to add one or two screenshots of the working application, and describe problems you had to overcome (if any).**

## T1.2 - Write a small code extension (new feature) for ScalyShop <span style="color:green">[optional, 25 pts]</span>
Now that the application is nice and ready (and you are able to launch it locally), you could start exploring the implementation of ScalyShop by writing a small code change.

You are free to design and add any new feature you like. To get full credit for this extra task, you should devise a new feature that requires at least small changes in frontend, backend (API), and the database schema. However, it's ok if the feature isn't super-useful or sophisticated (most of ScalyShop is not ;) ), the main goal is for you to explore how Express, Vue.js, and Mongoose work in combination.

Some resources to help you get started:
* [Javascript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
* [Introduction to Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction) (used to write the backend)
* [Introduction to Mongoose](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose) (used in the backend to interface with MongoDB)
* [Video tutorial for Vue.js](https://www.vuemastery.com/courses/intro-to-vue-js/vue-instance/) (used to implement the frontend)
* [Building frontend layouts using Bootstrap-Vue](https://bootstrap-vue.org/docs/components/layout) (used in the frontend to make buttons, tables, layouts, etc.)

**Push your code changes to the master of your GitLab projects. Describe your feature (and its implementation) briefly in your report.**

## T1.3 - Dockerize the application  <span style="color:red">[basic]</span>
Much of our future delivery pipeline will assume that our application components are available as Docker containers, so now our next step is to dockerize the application.  As we learned in Lecture 3, [Docker](https://www.docker.com)  is a container format that is incredibly widely used in cloud computing. As a first step, make sure to install Docker on your computer.

Then you should build **two or three** working Docker images, one each for frontend and backend, and optionally one for the database (though you can also just start a [MongoDB image directly](https://hub.docker.com/_/mongo)). Build on suitable base images and configure each image correctly (the [Node.js docker image](https://hub.docker.com/_/node) may be a good starting point, but you can choose any base image that works for you). 

Run your images (in the right order - database, backend, frontend) and validate that all images start correctly. If you have configured everything accurately, you should now be able to test the application by navigating to [http://localhost:5046/](http://localhost:5046/) and clicking around in the application, in the same way as when you started your application without Docker. Check for errors in the Docker logs of your images.

*Tips:*
- A common source of errors are incorrect port numbers, incorrect port mapping, or other issues related to Docker's virtual networking. Refer to the lecture and the online documentation of Docker and make sure that you are exposing and using the correct ports for all services.
- ScalyShop uses environment variables to configure endpoints, ports, database username, database password, etc. Many of these options have suitable default values for this first deployment task, but it is possible that you will have to provide custom values for some. In this case, *make sure to set the right environment variable*, do not just change the value in the source code. If you do, this will trouble you (a lot) in later tasks and assignments.

**Push your Dockerfiles to the master of your GitLab projects. Document your working solution in your report. It's sufficient to describe the final solution in a few sentences.**

## T1.4 - Create a composition with docker-compose  <span style="color:red">[basic]</span>

Now create a *composition* that represents your entire application using [Docker-Compose](https://docs.docker.com/compose/) (you probably installed it already along with Docker). Write a single `docker-compose.yaml` file that starts your entire application, including the database (don't assume a MongoDB database is already running, even though you likely installed MongoDB in the first task). Again validate that your composition works by navigating to [http://localhost:5046/](http://localhost:5046/) and clicking around in the application.

Note that the CI pipeline we will build in subsequent assignments will *not* use this docker-compose file, but it will remain a tremendously helpful tool to quickly spin up the application for local development and testing.

*Tips:*
- You can either use the Docker images you wrote in the previous task, or define the services in your composition directly based on standard Node images.
- Don't forget that in a docker-compose composition, services can be addressed through their service name (i.e., the service name becomes the internal DNS name of that service).
- As in the previous task, make sure to use the right port numbers, and use environment variables to set parameters such as the database or backend host names.

**Push your docker-compose file to the master of the frontend GitLab project. Document your working solution in your report. It's sufficient to describe the final solution in a few sentences.**

## T1.5 - Reflect on the architecture of ScalyShop  <span style="color:green">[optional, open pts]</span>

As a last task, you may reflect in your report on the current architecture and implementation of ScalyShop. Assume that the application is in its infancy (a "minimal viable product", in startup terms), but eventually should serve an international, large customer base. In what ways is the application already prepared for a large deployment, and what will definitely need to be changed? Do you see any   design decisions that will hamper a large-scale deployment and that will be difficult to change later on?

*(focus on the architecture and deployment - it's obvious that ScalyShop would need more functional features to become an actual product)*

**Describe the outcomes of your analysis in your weekly report. Be specific, and describe alternatives if you can think of any. Architectural diagrams may be very helpful to bring your point across.**

## Extra Work  <span style="color:green">[optional, open pts]</span>

In every assignment, you are free to further explore the topic. Document in the report if you have done extra work that is not related to any of the tasks above. Depending on the scope of the extra work, we may award points towards a better grade for this extra work.
