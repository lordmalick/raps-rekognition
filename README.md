# Car Rapide Recognition

## What is this?
A web app that allows you to use Amazon's rekognition AI service to analyse image such as Senegalese Public Transport most known as Car-rapide. 

The app is written in Node.js and uses the Amazon Rekognition AI service to perform the image recognition and analysis. 



## Functionality
- upload image
- get textual description (labels) for image

## Installation overview

#### 1. Install Node.js
get it from https://nodejs.org/en/

#### 2. Clone this repository
```
git clone https://github.com/lordMalick/raps-rekognition
```

#### 3. Install project modules/dependencies
```
cd ml-project
npm install
```

#### 4. Create AWS credentials and add them to the configuration file in the /config directory
You will need a AWS IAM user configured with AmazonRekognitionFullAccess permissions
**please take care and don't commit your creds back to git if you clone this repo**
```
cd config
cp aws-config-sample.json aws-config.json
```
edit the aws-config.json file and add your IAM access key (for example, MGF2005EXAMPLE), the secret access key and your aws account region into the config file

IAM policy requires access to 'rekognition' APIs - e.g. arn:aws:iam::aws:policy/AmazonRekognitionFullAccess

## How to run it
run the webserver:
```
node app.js
```

## How to access the app
point your browser at the local/remoteIP port 3000 to load the HTML form

e.g http://127.0.0.1:3000/
