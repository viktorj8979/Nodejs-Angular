# Hearst Charts

A charts and dashboard application for [Hearst](http://www.hearst.com).

## Introduction
Our application allows users to add data from multiple datasources and create shareable charts and dashboards to visualize and collaborate their data.

Our application uses the following things:

* Uses [auth0](http://auth0.com) to handle user authentication.
* Uses [NodeJS](https://nodejs.org) server-side javascript environment.
* Uses [ExpressJS](http://expressjs.com) a web framework for nodejs.
* Uses [krakenJS](http://krakenjs.com) extends express by providing structure and convention.
* Uses [MongoDB](http://www.mongodb.org) a document based database.
* Uses [cg-angular](https://github.com/cgross/generator-cg-angular) generates angular components.


## Prerequisites
* Not Required [MongoDB](http://www.mongodb.org), We host it.
* Requires [NodeJS](https://nodejs.org/download/) v0.12.7
* Requires [npm](https://nodejs.org/download/) v2.11.3

## Installation
Clone, install and run.

```shell
git clone https://tarajackson59@bitbucket.org/tarajackson59/dim-board.git
npm install
bower install
npm start
```
## Using cg-angular
Yeoman generator that follows the Angular Best Practice Guidelines for Project Structure.

```shell
yo cg-angular:directive my-awesome-directive
yo cg-angular:partial my-partial
yo cg-angular:service my-service
yo cg-angular:filter my-filter
yo cg-angular:module my-module
yo cg-angular:modal my-modal
```

## Working on tasks
# Documentation & Requirements [Confluence](https://charts.atlassian.net/wiki/display/DIM/Dashboard+In+a+Minute+Home)
# Tickets & Issues [Jira](https://charts.atlassian.net/secure/RapidBoard.jspa?rapidView=1&projectKey=HC&view=detail)
# Pull Requests & Code Review [bitbucket](https://bitbucket.org/tarajackson59/dim-board)

```shell
// Start by pulling the latest from develop
git pull origin develop
// Create a new task branch to work in (a copy of develop)
git checkout -b hc-name-ticket-branch develop
// Add the changes you made.
git add --all
// Commit the changes you made.
git commit -am "I fixed some issues."
// Push the changes you made.
git push origin hc-name-ticket-branch
```

## Explore the app

Visit [`http://localhost:8080`](http://localhost:8080)

Login with user:ash pass:ash or user: kraken pass: kraken.
