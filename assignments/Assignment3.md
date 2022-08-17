# Assignment 3

In the third assignment, our goal is to set up a CI pipeline for ScalyShop, which will allow us to quickly and seamlessly release new versions of the application directly into "production" (the Google cloud cluster we created previous week). We will make heavy use of GitLab's [Auto DevOps](https://docs.gitlab.com/ee/topics/autodevops/) feature and learn about GitOps in the process.

**Deadline**: Wednesday Week 5

**Discussion Session**: Friday Week 5

**Related Lectures**: Lecture 5

**Deliverables:**
* Written report (submitted in Canvas, please use report template in Canvas)
* Updates in GitLab

## T3.1 - Connect your Kubernetes Cluster to GitLab <span style="color:red">[basic]</span>
Now it's time to put the Kubernetes cluster we created in the previous assignment to work, and deploy ScalyShop to it. To this end, we first need to connect your GitLab projects to the cluster. This will be required to set up a seamless CI pipeline, enabling GitLab to release new software versions directly in the cluster.

Log in to GitLab and again locate the "group" we created for you ("dat490-2022-groupid"). Select the entry "Kubernetes" from the navigation panel on the left. Choose to "Connect cluster with certificate" (green button), and then choose to connect an existing cluster.

Choose a name for your cluster, leave the environment scope as "*" (changing this would allow you to use separate clusters for staging, pre-production, and production builds - * just means that the cluster will be used for all kinds of deployments). Fill out the remaining fields according to the [detailed instruction provided by GitLab](https://git.chalmers.se/help/user/project/clusters/add_remove_clusters.md#add-existing-cluster). Following the instructions will require you to use the `kubectl` tool you have already gotten to know last week.

After successful configuration, the cluster will be listed in GitLab, along with some basic stats (number of nodes in the cluster, overall utilization, etc.). Ensure that you have added a "group" level cluster, since all of the different sub-projects (frontend, backend, etc.) will be using the same cluster and you don't want to configure it fresh for each project.

If you have created multiple Google accounts and clusters last week, you need to decide on one that you want to use going forward (in principle you can also connect multiple clusters to GitLab, but all your components should deploy into the same one to avoid networking issues).

**Briefly document in your weekly report using a screenshot that you have successfully connected to the cluster. You only need to write more about this in the report if you had to do some unexpected extra work.**

## T3.2 - Install a GitLab Runner <span style="color:red">[basic]</span>

Our ultimate goal for this week is to build a CI pipeline that not only deploys to the cluster, but also uses resources from the cluster itself for the various build and test steps. Hence, we now need to install (one or multiple) GitLab runners (a little helper tool that can execute GitLab jobs).

Runners can be registered on different "levels" (for an individual project, a group of projects, or everybody). We want to create a runner for your group. To do so, navigate to your project group on GitLab, and open "Settings / CI/CD". Expand the entry for "Runners". **Disable** shared runners (the default ones provided by Chalmers won't work for us), and note down the two configuration entries shown on the left side of the screen (the GitLab URL and a registration token). We will need those later.

Now we need to actually install a runner. We will use our old friend Helm to install the GitLab runner in our Kubernetes cluster. Check out the [extensive documentation](https://docs.gitlab.com/runner/install/kubernetes.html) before getting started, and create a `values.yaml` file to configure Helm. You will need to set the GitLab URL and registration token you saved earlier, and you will also need to enable [privileged mode](https://docs.gitlab.com/runner/install/kubernetes.html#running-privileged-containers-for-the-runners). It may also be useful to increase the [number of maximal concurrent builds](https://docs.gitlab.com/runner/install/kubernetes.html#controlling-maximum-runner-concurrency), since the default is just 1. Save your `values.yaml` file and run Helm according to the instructions (it's ok to just install your runner in the default Kubernetes namespace). Your runner should now appear in the GitLab UI under "Available runners". 

**Note:** 
Our Google Kubernetes cluster uses Role-Based Access Control (RBAC) to restrict cluster access. At the moment our new runner won't work yet, since Google won't allow it to start new pods. There are (of course) ways to set this up properly, but for simplicity you can fix this by giving all the cluster's "service accounts" superuser privileges. Run the following `kubectl` command to do so:

`kubectl create clusterrolebinding serviceaccounts-cluster-admin --clusterrole=cluster-admin --group=system:serviceaccounts`

Refer to [Google's documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions) to learn how to set this up properly (yes, the suggestion above is the "strongly discouraged" one - feel free to use one of the better options, namely creating a separate service account with the correct rights, but then you will need to adapt your `values.yaml` file to configure this service account with your runner).

**Briefly document your solution in your weekly report, and add a screenshot that demonstrates that your new runner is registered.**

## T3.3 - Set up Auto DevOps for the Backend and Frontend <span style="color:red">[basic]</span>

With these setup steps out of the way, we can start looking into setting up the CI pipelines for our two ScalyShop subprojects.

We will be using GitLab's handy [Auto DevOps feature](https://docs.gitlab.com/ee/topics/autodevops/). Familiarize yourself with the capabilities of Auto DevOps based on the documentation, and then enable it in the backend following the instructions (you can either enable it separately for both projects, or simply make Auto DevOps the default for the entire group). Configure your pipeline so that all builds should be pushed straight to production, and that a new build should be triggered on every new commit to master.

You can already test your CI/CD pipeline now, even though it won't entirely work yet. Navigate to CI / CD in the backend project, and press "Run Pipeline". Observe the (fairly sophisticated) default pipeline Auto DevOps has created for you. It should work until the build reaches the "Production" stage, the stage where the backend would actually be deployed to the cluster. To make this step also succeed, some additional work will be needed (which we will do a little later).

**Note:** if either your build stage or all stages fail, the problem is most likely in the runner that we created in the previous task. It is important that the runner has sufficient rights to create pods (see the comment above regarding admin access), and that the runner runs in privileged mode.

**Briefly document your new CI/CD pipelines in your weekly report. Add screenshots of the pipelines, and explore for each step what is actually happening there (summarize briefly in your report). As a reminder, it's ok (for now) if the build fails in the Production stage.**

## T3.4 - Customize your pipelines <span style="color:green">[optional, 10pts]</span>

So far, we have relied entirely on the "default" pipeline that we get from using Auto DevOps. However, as you have probably observed, not all stages really make sense for ScalyShop (and at least one stage takes a very long time to complete).

Your task is now to do some small customizations to the build pipelines for both projects. Create a `.gitlab-ci.yml` file in both projects [following the instructions](https://docs.gitlab.com/ee/topics/autodevops/customize.html#customizing-gitlab-ciyml). Disable some of the more unnecessary or annoying default stages. Also disable the default Postgres server that Auto DevOps automatically provisions in the standard configuration (and which we are not using at all).

Commit your `.gitlab-ci.yml` file and push it to master. If you have set up everything correctly, simply pushing to master should be enough to entice GitLab to run the build pipeline (and it will automatically pick up your new configuration from the file). Look at your build on GitLab and observe how your pipeline has changed from the previous default builds.

**Briefly document in the report what changes you have made to your pipelines, and why.**

## T3.5 - Getting Started with GitOps <span style="color:red">[basic]</span>

[GitOps](https://about.gitlab.com/topics/gitops/) is the idea of applying standard software engineering practices to operations and infrastructure automation, and to define cluster configurations in code in a dedicated cluster configuration project (rather than by manually running `kubectl` or Helm commands). Hence, we want to use a dedicated project in GitLab, where we will define our cluster configurations going forward (and let GitLab manage the cluster by running these configuration scripts).
In this task, we are going to use the project `cluster-management` that you can already find in your GitLab group.

First, configure your Kubernetes cluster to use this project for GitOps. Navigate to your cluster configuration in the GitLab UI, find the "Advanced Settings", and select this project as cluster management project. Save your changes.

GitLab has recently changed their approach to GitOps. For this course, we are going to stick with the older-but-simpler "Managed Applications" approach (rather than managing the cluster through an agent). Explore the code in the cluster management project following the [instructions](https://docs.gitlab.com/ee/user/clusters/applications.html). Configure the project to install two additional applications - the `certManager` application (which will handle SSL certificates) and `ingress` (an Nginx based HTTP proxy and load balancer). Both of these will be required to make our production deployment work.

Commit your changes to the cluster management project and push them to the master. This should trigger the pipeline, which should install the additional applications in our cluster (this may take a while). You can follow what happens by looking at the build stage in the CI/CD pipeline of the cluster management project. From now on, when we want to install additional applications (or remove existing ones) we can do so simply by re-configuring our cluster configuration project and re-running the build.

**The cluster management project should have installed two new applications ("workloads") in your cluster. Explore what has happened in the Google Kubernetes GUI or using kubectl. Demonstrate using some screenshots what has happened in your weekly report.**

## T3.6 - Fix the production deployment stages <span style="color:red">[basic]</span>

Now with the certManager and ingress installed, we are finally ready to fix the production deployment of the backend and frontend, which has been failing so far. Three steps will be required:

- We need to configure a base URL for our application.
- We need to configure both frontend and backend to expose their services on port 5000, since this is what [Auto DevOps expects by default](https://docs.gitlab.com/ee/topics/autodevops/stages.html#auto-build-using-a-dockerfile).
- We need to find a way to dynamically configure our application correctly (tell the backend what database to use, tell the frontend the API endpoint of the backend, etc.).

The first is easy enough. Navigate (yet again) to your cluster in the GitLab UI and find the (currently empty) field *base domain*. Normally we would be entering the domain name of our application here. Unfortunately, we don't own domains for this project. However, we can use [nip.io](https://nip.io), a simple service that can simulate domains for IP addresses. Find out the public IP address of your ingress controller (an easy way is to locate the ingress controller in your Google Cloud dashboard, and copy the public IP address from there - it is likely the only workload you have with the type "Load Balancer"). Now use the following as base domain name: `IPADDRESS.nip.io` (where you replace dots in the IP address with dashes, e.g., `34-88-168-112.nip.io`). Save your change.

As for the second and third problems: as we know from the first assignment, ScalyShop is already implemented in a way to enable dynamically setting all important deployment parameters through environment variables. You will most likely need to use them now.

Some tips:

- Both front- and backend support an environment variable `PORT` to configure what port the respective service uses. Set both to 5000. It's ok now that both services use the same port, since they will be running in different Kubernetes pods!
- Solving the second and third problems will likely require you to slightly extend the Dockerfiles you created in the first assignment. You can use `ARG` commands in Docker to define variables that can be passed into a Dockerfile during build, and you can use `ENV` to set environment variables that will also be available at container runtime. A short discussion is available [here](https://vsupalov.com/docker-arg-vs-env/).
- You can pass arguments to the GitLab build using the [AUTO_DEVOPS_BUILD_IMAGE_EXTRA_ARGS CI variable](https://docs.gitlab.com/ee/topics/autodevops/customize.html#passing-arguments-to-docker-build). You can either set this variable in the GitLab UI under Settings / CI/CD / Variables, or, if you have already created custom `.gitlab-ci.yml` files in task T3.4, it may be nicer and easier to set the correct variables there.
- In the backend, simply setting the environment variables should do the trick. However, for the frontend, you will need to dynamically generate a correct [`.env` file](https://cli.vuejs.org/guide/mode-and-env.html#environment-variables) in the root of the frontend project (this is how Vue.js expects environment variables to be passed). This can be done quite easily in the Dockerfile of the frontend project.

This task is completed if you can run the builds of the backend and frontend projects end-to-end. The Production stage in the build pipeline should install the application in your cluster. If everything goes right, your backend should be publicly available at an address that looks something like this: `https://courses-dat490-example-solution-dat490-backend-example.34-88-168-112.nip.io`, and your frontend should be available under an address like `https://courses-dat490-example-solution-dat-490-frontend-example.34-88-168-112.nip.io`. You may have to accept some invalid certificates, though (our certificate manager would need a little more love to actually issue valid certificates). Click around in your frontend and ensure that everything works as expected. Particularly, ensure that the status message on the landing page reads `Your server appears to be live and well.` (if you see a `Connection Refused` there, your frontend is running but not able to connect to the backend).

**Push all changes that were necessary in your Dockerfiles and other code to your repositories. Briefly document everything you have done in this task in your weekly report, and show screenshots of your frontend running in your cluster.**

## T3.7 - Reflect on your CI/CD pipeline  <span style="color:green">[optional, open pts]</span>

As a last task, you may reflect in your report on what we have built in this week and the last. What's good about the setup we ended up with after task T3.5, and what limitations does our deployment pipeline still have? What extensions or changes would you like to implement if you were building ScalyShop as part of your daily work? Especially try to relate to what we discussed in the lecture, and discuss what concepts and ideas from the lecture our solution already implements.

**Describe the outcomes of your analysis in your weekly report. Be specific, and refer to the lecture content or Internet resources as apprpriate.**

## T3.8 - Write a Custom CD Quality Gate <span style="color:green">[optional, 10 - 20pts, depending on complexity] (new!)</span>

So far, we have only used the quality gates (steps in our CD pipeline) that come automatically with Auto DevOps. As you have seen, this already gives us access to most of the "typical" activities one wants to conduct when deploying a Web-based system.

Now, as a learning opportunity, you can try to write your own additional quality gate (what this step entails is up to you). You do this by extending the file `.gitlab-ci.yml` (see the documentation [here](https://docs.gitlab.com/ee/ci/yaml/gitlab_ci_yaml.html)). This should not completely replace the pipeline you built using Auto DevOps, it should just be an additional step in the Auto DevOps pipeline.

**Describe the goals of your custom quality gate as well as its implementation. Document it using a screenshot in your weekly report.**

## Extra Work  <span style="color:green">[optional, open pts]</span>

In every assignment, you are free to further explore the topic. Document in the report if you have done extra work that is not related to any of the tasks above. Depending on the scope of the extra work, we may award points towards a better grade for this extra work.