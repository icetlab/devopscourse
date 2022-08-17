# Assignment 2

In the second assignment, our focus is on exploring the Google cloud services and Kubernetes, as well as Helm as a "package manager" for Kubernetes. 

**Deadline**: Wednesday Week 4

**Discussion Session**: Friday Week 4

**Related Lectures**: Lecture 3 and 4

**Deliverables:**
* Written report (submitted in Canvas, please use report template in Canvas)
* Updates in GitLab

## T2.1 - Create an account at Google cloud <span style="color:red">[basic]</span>
Your first step is to create an account at the [Google cloud](http://cloud.google.com/). **This will (unfortunately) require a valid credit card.** However, if you create a new account you will get access [to 300$ in credit and access to a free tier](https://cloud.google.com/free/docs/gcp-free-tier/#free-trial) for 90 days, which in combination should be more than enough to ensure that no costs will accrue while working on the course assignments. Further, not every member of the group needs to create an account - you can also create one billing account and individual sub-accounts for the all group members.

**It is important that you remember that, even though you are using a free tier, you are working with a real, billed, live service. Monitor your charges in the Google dashboard at least every few days, do not start large instances that you don't actually use, make sure to terminate clusters and instances that you are not using any longer, and keep your cloud credentials private. At no point should cloud or instance passwords be committed to Git or made public in some other manner.**

Your group will need at least one billing account, but every group member should have access to this account (that does not mean that somebody should give out the admin password to their Google account - create subaccounts with appropriate rights). Creating individual billing accounts for multiple or all students can be useful so that everybody can experiment on their own without impacting the overal "budget", but the CI pipeline we will build next week will need to deploy into a *single* Google cluster.

Please do not hesitate to contact Philipp or Hamdy on Slack or via email if you have any questions or feel insecure about any of this.

**This task does not require any explicit deliverable. *Do not* document your account credentials in your weekly report ;)**

## T2.2 - Getting started with Kubernetes <span style="color:red">[basic]</span>
Your next task is to get a grasp on the basics of Kubernetes and Helm. To do so, we will, for a brief moment, step away from ScalyShop and utilize an even simpler Node-based example application.

We will follow [this tutorial](https://web.archive.org/web/20200417012757/https://thecloud.christmas/2019/16). Scan it now, and familiarize yourself with the basic concepts of Kubernetes and Helm as discussed in Lecture 4.

Install gcloud (the Google cloud command line utilities), Kubectl (the Kubernetes commandline client), and Helm. Make sure that your gcloud client is authenticated against your Google cloud account using `gcloud auth login` and following the subsequent instructions.

Now follow the tutorial linked above. Create a Kubernetes cluster with **two** nodes, which we will continue using in the rest of the project (use the argument `--num-nodes 2` to start only two nodes rather than the default of three, and specify an explicit region `--region europe-north1-a` when running your `gcloud container cluster` command). Successfully deploy the example Node application described in the tutorial.

If you run into problems, use kubectl to narrow down the problem (`kubectl get pods` lists all pods and their state - CRASHLOOPBACKOFF means that the container failed at startup and Kubernetes tries to restart it; use `kubectl logs <pod>` to look at the log of the failing pod).

It *may* be useful to create a "development instance" using the [Google Compute Engine](https://cloud.google.com/compute), and use this instance as your client to run gcloud and kubectl commands from. This eliminates some networking, authentication, and Docker issues (and at least gcloud is already pre-installed on Google instances).

We are not going to be using the "christmas" example application further in the assignment. However, we *will* continue to use the cluster you created as part of the tutorial (so don't delete it just yet).

**Create a new project in your GitLab group, and commit your Helm chart there. Further, briefly document your working solution in your weekly report. Document with one or two screenshots your working solution, and briefly describe any major problems you run into. Make screenshots of the Google dashboard or appropriate kubectl output that shows that you actually have a working cluster.**

## T2.3 - Install MongoDB in your cluster <span style="color:red">[basic]</span>
One of the core promises of Helm as a "package manager" is that it should simplify installing new dependencies into our cluster. We will now explore this by installing a basic MongoDB database in the cluster we created in the previous task.

We will use the [Bitnami Helm chart](https://bitnami.com). Simply find the right package [here](https://bitnami.com/stack/mongodb/helm), and follow the installation instructions for the cluster you created (do *not* use the Azure marketplace version - we are not using Microsoft Azure).

When Helm successfully finishes, it will print a variety of "next steps", including instructions how to get the generated root password and how to log into your database. **Save these instructions**, and try them out. You should be able to log into your database.

Once you have logged into the database server, create a new database for ScalyShop called "scaly" and create a new user that our application will then use to connect to the new database. Execute the following commands from the database server shell (replace `<some-pw>` with a password of your choice):

`use scalyDB`

`db.createUser({user: "scaly", pwd: "<some-pw>", roles: ["readWrite"]})`

Refer to the [MongoDB documentation](https://docs.mongodb.com/manual/reference/method/db.createUser/) if you need more details about this step. Close the MongoDB shell and validate that you can log in using the user you just created.

**Briefly document your working solution in your weekly report. Make screenshots of the Google cloud dashboard or the kubectl outputs that show that your MongoDB database has been successfully deployed. Document any major problems you had.**

## T2.4 - Write Helm charts to deploy ScalyShop <span style="color:green">[optional, 25pts]</span>
As the final task for the week, you can go back to the tutorial we followed in task T2.2. You will note that writing Helm charts to deploy the frontend and the backend of ScalyShop to our new Kubernetes cluster should really not be *that* different since it's just two more, slightly larger, Node applications.

This is partially correct, but you *will* need to solve a few more open issues that the simple Christmas application kind of glanced over. One of those is how to dynamically tell the backend what database to use, and the frontend what the API endpoint of the backend is. Generally, environment variables are the common solution to such woes, and ScalyShop is implemented to make use of them (as we have already seen in Assignment 1).

Write two new Helm charts, one of the frontend and one for the backend. Use them to make a test deployment of our case study app in the cluster, and test that the application still works if it's running on Google hardware.

You are free modify the ScalyShop source code if you have to, but make sure that your local test deployment with docker-compose still works (as a general rule, you can make any changes you want, but you are not allowed to re-write the application in a way that would prevent you from local testing - for instance by hardcoding your Kubernetes connection strings in your application).

Evidently, you do not have to write a Helm chart to deploy MongoDB. Instead, your backend should be using the MongoDB instance we just installed in task T2.3, and it should be using the "scaly" user you just created, not the root account.

This is an optional task, since the CI pipeline we will build next week will use GitLab's Auto DevOps deployment rather than a custom Helm chart to install ScalyShop in the Google cloud. However, it's an excellent learning opportunity, even if we will end up deploying the application differently next week.

**Commit your Helm charts to the master of the backend and frontend repositories. Document your working solution in your weekly report. Make screenshots of the Google cloud dashboard or the kubectl outputs that show that ScalyShop has been successfully deployed, and that you can browse the store running on the Google cloud.**

## T2.5 - Configure an Autoscaling Deployment <span style="color:green">[optional, 20pts]</span>
So far, we did not really use Kubernetes for the "cool stuff" - namely writing a deployment that can automatically scale out. Time to fix this!

Extend one of the Helm packages you wrote (the one for the backend from T2.4 if you solved this task, or alternatively your T2.3 solution) and configure an autoscaling deployment based on CPU thresholds. Decide on reasonable CPU thresholds.

Test if your autoscaler works by generating load on your backend or Node.js application (what's the best way to do this?). If you have troubles generating enough load to get the autoscaler to start new pods you maybe have to change the CPU thresholds from above for experimentation purposes.

**Commit your updated Helm charts to GitLab. Document your working solution in your weekly report. Make screenshots of the Google cloud dashboard or the kubectl outputs that show that autoscaling is actually happening.**

## Extra Work  <span style="color:green">[optional, open pts]</span>

In every assignment, you are free to further explore the topic. Document in the report if you have done extra work that is not related to any of the tasks above. Depending on the scope of the extra work, we may award points towards a better grade for this extra work.