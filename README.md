# SuperSimpleChat
Super Simple Chat app for MongoDB Realm

On the MongoDB Atlas side

* Create a Free Atlas Cluster. Under 'Additional Settings' select version 'MongoDB 4.4 - Betea'
* Name new Atlas Cluster SuperSimpleChat
* Hit Create Cluster

Once the cluster has been created, select the Realm tab 

* Select Create a New App
* Name the new Realm App 'SuperSimpleChat'
* Link it to the SuperSimpleChat cluster created above
* Hit Create Realm App

Set up Realm Sync

* Select Cluster to Sync 'SuperSimpleChat'
* Select a Database caleld 'SuperSimpleChatDB'
* Create a partition key called '_partition' as a string
- Hit save and turn on dev mode

Set up user provider

- In the Realm app go to the User tab
- Select the Providers tab
- Select Email/Password
- Toggle the Provider Enable control
- Select 'Automatically Confirm Users' as User Confirmation Method.
- Select 'Run a password reset function' as the Password Reset Method
- Select the default name 'resetFunc' 
- Hit save

Deploy the Realm App

XCode Project

- Download the source code from Github
- set up pods by typing 'pod install' at the command line
- open generated workspace file
- set the Realm id in Models.swift

Run the app


