---
order: 3
path: '/running-cypress-ci-tests-with-jenkins-on-aws-linux'
title: 'Running Cypress on an Amazon Linux AMI with Docker and Jenkins'
subtitle: 'Get cypress working together with AWS Linux on your CI'
published: true
date: '20190820'
type: 'post'
keywords: 'Cypress, Continuous Integration, AWS Linux, Docker, Jenkins'
tags:
  - jenkins
  - docker
year: 2019
---

## Integration Testing with Cypress as part of our CI

[Cypress](http://cypress.io) is a great tool for running integration tests and end2end tests. The browser integration is amazing and allows us to write sophisticated tests against a real browser quickly. In our case we already had a Continuous Deployment (CI) pipeline setup, which uses Jenkins to test our services, build and distribute Docker images and deploy them on AWS. When we tried to integrate the Cypress tests, we realized that Cypress (v. 3.4.1 at the time of writing) was complaining about missing dependencies.

```
[jenkins@xx-xx-xx tmp]$ cypress run
It looks like this is your first time using Cypress: 3.4.1

 ✖  Verifying Cypress can run /var/lib/jenkins/.cache/Cypress/3.4.1/Cypress
   → Cypress Version: 3.4.1
Cypress failed to start.

This is usually caused by a missing library or dependency.

The error below should indicate which dependency is missing.

https://on.cypress.io/required-dependencies

If you are using Docker, we provide containers with all required dependencies installed.

----------

/var/lib/jenkins/.cache/Cypress/3.4.1/Cypress/Cypress: error while loading shared libraries: libgtk-3.so.0: cannot open shared object file: No such file or directory

----------

Platform: linux (Raspbian - 2018.03)
Cypress Version: 3.4.1
```

## Install all deps on the AWS AMI?

We were already using [AMIs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) to power our CI build server, so my first take was just installing the missing dependencies and creating a new AMI revision.
I tried following [this excellent blog post](https://medium.com/aubergine-solutions/install-cypress-io-front-end-testing-tool-dependencies-on-amazon-linux-ami-ec2-instance-f676da4abbdd) and to install all these dependencies manually per SSH directly on the AWS Linux machine. Unfortunately I still could not get it to work as some of the deps were already out of date because we use the latest cypress version (3.4.1 at the time of writing) and the deps changed since this post was written.

## Docker to the rescue

The solution is to use the 'cypress:included' docker image as described here:

- https://docs.cypress.io/guides/guides/continuous-integration.html#Docker
- https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/

This let's you run your cypress tests inside a docker container with a single command.

The magic here is that `-v $PWD:/e2e` maps the current folder (where you run this command from) to /e2e inside the container and thus there is no copying needed. The docker image literally picks it up from there and uses its included Cypress environment to run our mounted specs from the local `./cypress` folder.

The next challenge is to make sure our app is running on the CI server before the cypress tests start and that Cypress can access it from inside the docker container.
To start the server we followed [what the documentation suggested](https://docs.cypress.io/guides/guides/continuous-integration.html#Boot-your-server) and use the npm module [`start-server-and-test`](https://github.com/bahmutov/start-server-and-test):

Our npm script would look like this:

```json
{
  "start": "cross-env webpack-dev-server --port 3000 --host 0.0.0.0",
  "cypress:integration": "start-server-and-test start http://localhost:3000 cy:run:ci",
  "cy:run:ci": "docker run -e CYPRESS_baseUrl=http://172.17.0.1:3000 -v $PWD:/e2e -w /e2e --entrypoint=cypress cypress/included:3.4.1"
}
```

Because we are starting our server to test against on `localhost:3000` we now pass in `CYPRESS_baseUrl=http://172.17.0.1:3000` as and env for the `docker run` command.
172.17.0.1 is a magic IP in docker that points to `localhost` of the host machine. You can find more info on this [on the Docker website](https://docs.docker.com/network/network-tutorial-standalone/).

On docker for mac we can use the `docker.host.internal` DNS entry but this will not work on linux machines yet. See [this issue on Github for details](https://github.com/docker/for-linux/issues/264).

## Conclusion

If you are already using docker on your build server it can solve many problems that arise with missing dependencies for us. Especially you can save a lot of headache that arises from different versioning. Luckily, the great people at Cypress already provided an everything-included Docker image for us, which we can use to solve this problem.
So there you have it, now Cypress runs our integration tests from Jenkins in headless chrome from inside a Docker container.

Happy Testing 😌
