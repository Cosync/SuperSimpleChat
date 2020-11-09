import React, { Component } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Schema from '../config/Schema';
import Realm from "realm";

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: '',
            userEmail: '',
            userPassword: ''
        };
      }

   
    componentDidMount() {
        this.fetchData();
      }

    async fetchData() {

        global.currentScreenIndex = 'ChatScreen'; 
        this.state.user_id = await AsyncStorage.getItem('user_id');  
        this.state.userEmail = await AsyncStorage.getItem('user_email');
        this.state.userPassword = await AsyncStorage.getItem('user_password');  
        this.openRealm()
    }

    openRealm = async () => {
        const appConfig = {
        id: 'application-0-ltqom', 
        timeout: 10000,

        };

        const app = new Realm.App(appConfig); 
        const credentials = Realm.Credentials.emailPassword(this.state.userEmail, this.state.userPassword);

        let user = await app.logIn(credentials);
        global.user = user; 

        const config = {
            schema: [Schema.CosyncAsset],
            sync: {
                user: user,
                partitionValue: 'public',
            }
        };
        let realm = await Realm.open(config);
        realm.removeAllListeners();  

        const asset = realm.objects('CosyncAsset');
      
        asset.addListener(this.eventListener);

        
    }


    eventListener(assets, changes) {

        // Update UI in response to deleted objects
        changes.deletions.forEach((index) => {
            alert("deletions");
        });
        
        // Update UI in response to inserted objects
        changes.insertions.forEach((index) => { 
          alert("inserted")
        });
      
        // Update UI in response to modified objects
        changes.modifications.forEach((index) => {
            alert("modifications")
        });
      }

    render() {

        const { userEmail, inEuro, inPounds } = this.state;

        return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
            }}>
            <Text>Hello, {userEmail}!</Text>

            

        </View>
        );
    }

    
}

export default Chat;
