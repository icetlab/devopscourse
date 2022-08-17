# Assignment 5

In the fifth and last assignment, we will now integrate a Prometheus based monitoring solution. We will also investigate the feature toggling functionality integrated into GitLab.

**Deadline**: Wednesday Week 7

**Discussion Session**: Friday Week 7

**Related Lectures**: Lectures 8, 9, and 10

**Deliverables:**
* Written report (submitted in Canvas, please use report template in Canvas)
* Updates in GitLab

## T5.1 - Setting up Prometheus <span style="color:red">[basic]</span>
Your first task in this assignment will be to install yet another tool into your Kubernetes cluster, namely a [Prometheus](https://prometheus.io) monitoring solution. The easiest way to do so is to use our cluster management project from T3.3 in assignment 3. Simply open the configuration in the project, and enable Prometheus there, and push your changes. Your cluster management project should now install Prometheus in the cluster.

After that, we also need to enable a Prometheus integration in the GitLab UI. Navigate to your cluster configuration, select the rider "Integrations", and enable the checkbox "Enable Prometheus integration". GitLab should now be able to automatically assess the health of the cluster and of the applications deployed to the cluster. Find the "Health" tab of your cluster page in GitLab, and observe that you are now also able to track cluster CPU and memory usage directly in GitLab.

More importantly, Prometheus will also track performance and error rates of our deployed services. Select one of your services (e.g., the backend) and navigate to Operations / Metrics (it's normal if data for some metrics is not available, e.g., we are not using an AWS ELB so no data will be shown in this entry). It plausible that the data looks rather "boring" at the moment (many straight lines, and no errors) - after all, our application is not actually used by anybody, so at the moment there will probably be few requests to show here.

Experiment a bit with your monitoring solution - check what happens if you use the application. The admin view in the frontend has a few buttons that should help you to experiment with your monitoring:

- The buttons "Trigger 404 Fault" and "Trigger 500 Fault" ask the backend explicitly to send back an error (a 404 Not Found and 500 Internal Server Error, respectively).
- "Trigger Long-Running Request" can be used to batch-add a large amount of data to the database (to increase memory consumption and page load times). The slider below the button can be used to configure how many entries should be added to the database.
- "Remove Test Data" deletes all the test data that the previous button adds. Deleting a lot of data is a rather expensive operation.

**Experiment with your monitoring solution (for all your deployed services) and document your findings in your report. Show screenshots of your dashboard, and try to interpret what you see. What is expected, what is unexpected? What happens if you crash your server?**

## T5.2 - Setting Up a Custom Dashboard <span style="color:green">[optional, 10 - 25pts, depending on complexity]</span>
To actually generate the the dashboard we used so far, GitLab uses a system called [Grafana](https://grafana.com). Grafana (and GitLab) of course allow us to customize our monitoring dashboard, or define entirely new dashboards.

Refer to the GitLab [documentation about custom dashboards](https://docs.gitlab.com/ee/operations/metrics/dashboards/). Duplicate the default dashboard as a starting point (there is a button in the UI that allows you to do this). Remove the panels we are not actually using in your custom dashboard, and add at least one or two custom views that show metrics that the default view does not display.

**Document your custom dashboard in your report - include both, the necessary YAML code to define it and some screenshots of the custom dashbord in action.**

## T5.3 - Exploring Canary Releases with GitLab <span style="color:red">[basic]</span>
So far, whenever we pushed a change to our master branch, the change immediately got rolled out to all customers. This is often not the behavior we actually want for real applications. Instead, we often want to be able to "test" a change first on a subset of requests before exposing it to everybody. Let's implement this idea for the frontend service.

Our existing CD pipeline can be extended quite easily in this manner. Refer to the GitLab [documentation about customizing AutoDevOps](https://docs.gitlab.com/ee/topics/autodevops/customize.html). If you have not done so previously, now is the time where you need to create a `.gitlab-ci.yml` file in the root of the frontend project, as this is the place where we customize our deployment pipeline.

Configure an incremental rollout with 10 replicas by editing your `.gitlab-ci.yml` file. You can choose either a _timed_ or a _manual_ rollout strategy, and it's up to you how fine-grained the rollout should be (GitLab's default is to create 10%, 25%, 50%, and 100% deployments, which is probably not a bad starting point). Push your changes to master, and observe in the "CI / CD" rider of the GitLab UI how deployments now behave. Also check in "Operations / Environments" if you can see your canaries in action.

**Briefly document (e.g., using screenshots) your working CD pipeline using canary releases. Show your pipeline and also your active environments during different stages of the rollout. Validate that your application still works. If you want to _really_ see your canary in action, make a small change to the frontend (e.g., change the color of an element), push the change, roll it out to 50% of your pods, and test by reloading (or using different browsers) if you can see both versions of the application at different times.**

## T5.4 - Experimenting with Feature Flags in the Backend <span style="color:green">[optional, 20pts]</span>
Canary releases are useful if we want to test a risky change first on a subset of users. A related concept are feature toggles (also known as feature flags), which are source code level constructs (e.g., new features or UI changes) that can be turned on and off from GitLab (without redeploying the application). In this task we are going to experiment with feature toggling in our backend service.

GitLab implements feature toggling through support for the [Unleash library](https://github.com/Unleash/unleash), which is available for many different programming languages (including Javascript / Node.js, which we use to build our backend service). Inspect the [Getting Started guide](https://github.com/Unleash/unleash-client-node) for the Node.js Unleash client, and also check out [GitLab's documentation](https://docs.gitlab.com/ee/operations/feature_flags.html) on the topic.

Now add at least one simple feature toggle to your backend implementation as a demonstration (the easiest demonstration is probably to simply change the message that is being returned by the endpoint `/api/serverstatus` in `app.js`). The right version of the Unleash library is already added to the backend's dependencies in `package.json`, but you will need to initialize the Unleash client correctly in `app.js` (the [documentation](https://docs.gitlab.com/ee/operations/feature_flags.html#get-access-credentials) will tell you how to retrieve the correct configuration to use for your project). Once the Unleash client is set up correctly, you can create one or multiple feature toggles in your code, and enable / disable them at runtime through the GitLab UI (under "Operations / Feature Flags").

**Push your code changes to your master project, and validate that your feature toggle(s) actually work. Document briefly what code changes you had to do, and add screenshots that demonstrate your feature toggles at work.**

## T5.5 - Doing a Small Resilience Experiment <span style="color:green">[optional, 15pts]</span>
We can now to a small resilience experiment in the spirit of chaos engineering. Specifically, we want to check if our frontend (which should be replicated across 10 Kubernetes pods, after the work we did in task T5.3) is resilient towards a single pod stopping to respond.

The backend project already has one endpoint that is explicitly designed to crash the server by starting an endless loop (`/api/crash`, see `app.js` lines 78 to 83). Add a button to the frontend (e.g., in the Admin view) that explicitly invokes this endpoint for testing purposes, test it locally, and then push your change to production. Remember that with the canary release changes we did in task T5.3 you now need to manually trigger a rollout to 100% of your pods in the GitLab UI.

Now formulate a hypothesis what will happen in production when you press this button. Test your hypothesis (that is, actually press the button) and validate what actually happens in your system. Is your system resilient towards this outage? Does your system eventually recover on its own? If so, how long does it take to recover?

**Document your findings in your report. Specifically reflect on the impact that the outage of a single pod has on your customers, if your system can recover without manual intervention, and how long it takes to recover.**

## T5.6 - Planning an A/B Experiment <span style="color:green">[optional, open pts]</span>

As a final optional task for the project, we can now at least think about how we would conduct an A/B test in our setup. Which parts of our setup would we need to use, and how could you set it up?

Can you do at least a proof-of-concept of an A/B experiment in the system you have implemented?

**Describe in your report how you could do an A/B test using our experiments, and how you would set it up technically. Specifically focus on the technical implementation (e.g., which parts of our solution could we re-use, and how - and what new technologies or features we would need). If you have done a proof-of-concept implementation then describe it and also provide some screenshots and reflections.**

## Extra Work  <span style="color:green">[optional, open pts]</span>

In every assignment, you are free to further explore the topic. Document in the report if you have done extra work that is not related to any of the tasks above. Depending on the scope of the extra work, we may award points towards a better grade for this extra work.