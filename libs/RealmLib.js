////////////////////////////////////////////////////////////////////////////
//
// Copyright 2020 Cosync, Inc. All Rights Reserved.
// For questions about this license, you may write to mailto:info@cosync.io
//
//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Cosync, Inc., either version 3 of the License, or
//(at your option) any later version.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.
//
//You should have received a copy of the GNU General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
////////////////////////////////////////////////////////////////////////////

/**
 * © 2020, Cosync, Inc. All Rights Reserved.
 * 
 * @author Tola VOEUNG
 * 
 * @Editor Tola VOEUNG  
 * For questions about this license, you may write to mailto:info@cosync.io
*/
 
import Realm from "realm";
import AsyncStorage from '@react-native-community/async-storage';
import Schema from '../config/Schema';

let allSchemas = [
    Schema.CosyncAsset, 
    Schema.ChatEntry
];

exports.emaillogin = async function(data, callback){  
    const app = new Realm.App({ id: data.appId });  
    let userEmail = await AsyncStorage.getItem('user_email');
    let userPassword = await AsyncStorage.getItem('user_password'); 

    let user = await login(userEmail, userPassword);

    if(user){ 
      callback(user);
    }
    else{ 
      
      callback(null);
    }
  
     
}


exports.appInstance = function(_schemas, _partition){
  return new Promise((resolve, reject) => {
      login().then(user => {
          openRealm(_schemas, _partition).then(realm => {
              resolve(realm);
          }); 
      });
          
  });
}


function getRealmApp(){
  const appConfig = {
      id:global.appId,
      timeout: 10000,
  };

  return new Realm.App(appConfig);  
}




function openRealm(){
  return new Promise((resolve, reject) => {  

      if(global.privateRealm && global.realm ){
        resolve(global.realm);
        return;
      } 
     
      let configPublic = {
        schema:  allSchemas,
        sync: {
          user: global.user,
          partitionValue: "public"
        }
      }; 

      let configPrivate = {
        schema: allSchemas,
        sync: {
          user: global.user,
          partitionValue: `user_id=${global.uid}`
        }
      };

      try {
        Realm.open(configPublic).then(realm => {
          global.realm = realm;
          Realm.open(configPrivate).then(realmPrivate => {
            global.privateRealm = realmPrivate;
            resolve(true);
          });
        }); 
        
      } catch (error) { 
        
      }
  })
}




function login(email, password){
  return new Promise((resolve, reject) => {

      if(global.user && global.uid){
          resolve(global.user);
          return;
      } 
      
      const app = getRealmApp(); 

      const allUsers = app.allUsers;
      for (let index = 0; index < allUsers.length; index++) {
          const user = allUsers[index];
          user.logOut();
      }

      const credentials = Realm.Credentials.emailPassword(
        email,
        password
      );

      // Authenticate the user
      app.logIn(credentials).then(user => { 

          global.user = user;
          global.app = app;
          global.uid = user.id;  
          resolve(user);

      }).catch(err => {

        
      });
  });
}
 
 

exports.logout = async function(callback){  
  
 
  callback();
}

