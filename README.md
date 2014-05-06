anyFetch.com website
==============

Welcome @ anyFetch

## How to install
Before running any of these commands you need to install all the requirements. To load all the dependents packages you will need to run:

```sh
npm install -g bower grunt-cli
npm install
gem install compass
```

## How to use
```sh
grunt serve				# launch the developement server
grunt test				# start the tests
grunt build				# create standalone application in the /build directory
```

## Deployment
This require push access to this repo.
 
```sh
grunt deploy            # Deploy on production server.
grunt stage             # Deploy on staging server / branch
```

