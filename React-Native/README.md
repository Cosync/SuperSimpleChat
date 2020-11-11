# SuperSimpleChat

Super Simple Chat app for MongoDB Realm

On the MongoDB Atlas side

- Create a Free Atlas Cluster. Under 'Additional Settings' select version 'MongoDB 4.4 - Betea'
- Name new Atlas Cluster SuperSimpleChat
- Hit Create Cluster

Once the cluster has been created, select the Realm tab

- Select Create a New App
- Select Mobile, iOS, No I'm starting from Scratch as your options
- Hit 'Start a new Realm App'
- Name the new Realm App 'SuperSimpleChat'
- Link it to the SuperSimpleChat cluster created above (default choice)
- Hit Create Realm Application

Set up Sync in Dev Mode

- Select Cluster to Sync 'SuperSimpleChat'
- Define a Database called 'SuperSimpleChatDB'
- Create a partition key called '\_partition' as a string
- Hit 'Turn Dev Mode On'

Set up user provider

- In the Realm app go to the User tab
- Select the Providers tab
- Select Email/Password
- Toggle the Provider Enable control to on
- Select 'Automatically confirm users' as User Confirmation Method.
- Select 'Run a password reset function' as the Password Reset Method
- Select 'New function' in function
- Select the default name 'resetFunc'
- Hit 'Save'

Deploy the Realm App

- Hit 'REVIEW & DEPLOY'

VSCode Project

- Download the source code from Github
- Set up React Native if you dont have it yet 'npm install -g react-native-cli'
- In the root folder of source code type 'npm install' at the command line
- Then type 'cd ios && pod install && cd ..'
- Set the Realm id in config/Config.js
- Copy the Realm id from the top left button in the Realm panel in the web UI
- Edit the appId in the config/Config.js

Run the app

- type 'react-native run-ios' for iOS
- type 'react-native run-android' for Android
