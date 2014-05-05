Anyfetch front
==============

Welcome @ anyFetch

## Requirements

* node.js
* compass
* [yeoman](http://yeoman.io/)


## How to use

Before running any of these commands you need to install all the requirements. To load all the dependents packages you will need to run:
```sh
gem install compass
npm install -g grunt bower bower-cli
npm install
bower install
```

```sh
grunt serve				# launch the developement server
grunt test				# start the tests
grunt build				# creation of a standalone application in the /build directory
```

## Deployment
 
 ```sh
 grunt deploy
 ```
 
 This require push access to this repo.
