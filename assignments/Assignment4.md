# Assignment 4

In the fourth assignment, we will re-architect ScalyShop for more fine-grained scalability. Our focus here will be on micro- and nanoservices. We will extract and deploy a microservice, and add simple new functionality using a [Google Cloud Function](https://cloud.google.com/functions).

**Deadline**: Wednesday Week 6

**Discussion Session**: Friday Week 6

**Related Lectures**: Primarily Lecture 3 and 6

**Deliverables:**
* Written report (submitted in Canvas, please use report template in Canvas)
* Updates in GitLab

## T4.1 - Extracting a Microservice  <span style="color:green">[optional, 25pts]</span>
Go back to the analysis of ScalyShop's architecture from assignment 1, and identify one feature that could be extracted into a microservice (in this assignment we are not going to worry too much if it would actually be _useful_ in practice to split up such a small application). Your next task is to implement this extraction.

Create a new code repository on GitLab and implement the new service. It's perfectly fine to copy over some of the existing code (in the sense of a "copy migration" as discussed in the lecture). Your new microservice should be a "true" microservice - it should manage its own data (which should be stored in its own database), and should offer access to this data through its REST API (if necessary). However, the database can be a different MongoDB database managed by the same MongoDB instance (you do not need to set up a new database management server in your Kubernetes cluster - but of course you can if you want to).

You are free to  implement your new microservice using Express (just like the original backend), or choose any other technology stack. Using NPM / Express / Javascript may ease code reuse from the original implementation, but if you are already familiar with some other Web technology stack (e.g., Java EJB, or Ruby on Rails) it may be faster to just use what you already know. 

Once your new service is implemented, switch the original implementation (e.g., by commenting out the relevant parts of the original code and replacing it by invocations to your new service). It is suggested that you do not actually remove code in this step, as two alternative implementations (one monolithic, one microservice-based) will be useful in the next assignment sheet. Write a Dockerfile for your new service, and update the `docker-compose.yml` you developed in the first assignment. Test your new service locally, and check if everything appears to be working correctly. 

Once you have validated that ScalyShop still operates correctly with your newly cut-out microservice, you should set up a deployment pipeline for your new service (similar to what you did in Assignment 3, but now for your new service repository) and push your new service to GitLab. Validate that your new service correctly gets deployed to your Kubernetes cluster, and then also push your changed front- and backend (so that the version deployed in Kubernetes is now using your new service instead of the original monolithic implementation). Validate that your new deployable architecture still works correctly end-to-end in your Kubernetes cluster.

**Briefly document in your weekly report what feature you have selected for microservice extraction, and describe your new implementation.**

## T4.2 - Integrating a Cloud Function <span style="color:green">[optional, 25pts]</span>
As a second optional step this week, we want to look at [Google cloud functions](https://cloud.google.com/functions) as a simple way to write, deploy, and use small, directly cloud-hosted nanoservices in Web projects.

First decide on a (small) additional feature for ScalyShop that you could implement using a FaaS nanoservice. If you can think of something useful that can make good use of the power of functions that's perfect, but if not you can also implement a demonstration that's a bit more artificial.

Follow the [tutorial](https://codelabs.developers.google.com/codelabs/cloud-starting-cloudfunctions#0) to set up, implement, and deploy your function. You can choose to implement your function in a wide variety of programming languages and select between different trigger types (for our project, you will most likely want to use an HTTP trigger, since that's the most straight-forward to integrate into ScalyShop). If your function is very simple you can implement it directly in the cloud IDE in the Google dashboard. However, even if you choose to do that, please save your function code (e.g., in a new Git repository) and submit it. Of course you can also edit your function code in a file and simply copy it into the Google dashboard once you are happy.

Once you have successfully deployed your function you'll need to test that it works appropriately. Depending on how complicated your function is and what types of HTTP requests it expects you can either do this very simply using a browser or a command line tool such as `wget` or `curl`, or use a full-blown API testing tool such as [Postman](http://postman.com/).

Once your function works as expected, you can integrate it into your ScalyShop frontend. You can use Axios, the same library that the frontend also uses to send HTTP requests to the ScalyShop backend, to send HTTP requests to your function. As usual, first test  if everything works locally (even though it's not entirely "locally" any longer), and then push to master to have the CI/CD pipeline we set up in Assignment 3 automatically deploy your changes to production. Then validate that your new feature also works when deployed to your Kubernetes cluster.

**Create a new project in your GitLab group and commit the source code of your function there. Briefly document in your weekly report what feature you have implemented and how. Also briefly elaborate how you have validated that your cloud function works correctly.**

## Extra Work  <span style="color:green">[optional, open pts]</span>

In every assignment, you are free to further explore the topic. Document in the report if you have done extra work that is not related to any of the tasks above. Depending on the scope of the extra work, we may award points towards a better grade for this extra work.