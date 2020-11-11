import Schema from '../config/Schema';
import Realm from "realm"; 
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat' 
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ObjectId } from 'bson';
import AsyncStorage from '@react-native-community/async-storage';
import Configure from '../config/Config'; 

const ChatScreen = () => { 

  
  global.user = global.user ? global.user : {};

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    openRealm();

    async function openRealm(){  

      global.appId = Configure.Realm.appId;

      let userEmail = await AsyncStorage.getItem('user_email');
      let userPassword = await AsyncStorage.getItem('user_password'); 
      

      const appConfig = {
        id: global.appId, 
        timeout: 10000
      };

      if(!global.user.id){
        const app = new Realm.App(appConfig); 
        const credentials = Realm.Credentials.emailPassword(userEmail, userPassword); 
        let user = await app.logIn(credentials);
        AsyncStorage.setItem('user_id', user.id);  
        global.user = user; 
      }
      

      
      if(!global.realm) {
        const config = {
          schema: [Schema.ChatEntry],
          sync: {
              user: global.user,
              partitionValue: Configure.Realm.partition,
          }
        };

        let realm = await Realm.open(config);
        realm.removeAllListeners();  
        global.realm = realm;

        
      } 

      const results = global.realm.objects(Configure.Realm.table); 
      let chatEntryList =  results.sorted("createdAt", true); 
      results.addListener(eventListener);  

      let fetchedMessages = [];
    
      chatEntryList.forEach(message => {
        fetchedMessages.push(formatTextMessage(message))
      });
      setMessages(fetchedMessages); 
      
    } 

  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    let item = messages[0];
    global.realm.write(() => { 
      global.realm.create(Configure.Realm.table, 
        { _id: new ObjectId(),
          _partition: Configure.Realm.partition,
          name: global.user.id,
          text: item.text,  
          createdAt: new Date().toISOString()
      }); 
    });


    
  }, [])




  function eventListener(itemList, changes) {

    
    // Update UI in response to inserted objects
    changes.insertions.forEach((index) => { 
      let item = itemList[index]; 
      if(item.uid != global.user.id) setMessages(previousMessages => GiftedChat.append(previousMessages, formatTextMessage(item)))
      
    });
   
  }
 

  const formatTextMessage = (message) => { 
    let item = {
      _id: message._id, 
      text: message.text, 
      createdAt: new Date(message.createdAt).toLocaleString(),
      user: {
        _id: message._id,
        name: message.name,
        avatar: 'https://cosync-assets.s3-us-west-1.amazonaws.com/logo.png',
      }
    };

    if(item.name == global.user.id) item.user.avatar =  'https://placeimg.com/140/140/any';
    return item;
  };

 

  return (
    
    <GiftedChat
      renderLoading={() =>  <ActivityIndicator size="large" color="#0000ff"  animating={true} style={styles.activityIndicator}/>}
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{ _id: global.user.id}}/>
  )
}

export default ChatScreen;



const styles = StyleSheet.create({
   
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});