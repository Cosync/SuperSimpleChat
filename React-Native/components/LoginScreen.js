 
import Realm from "realm";
import React, { useState, useRef } from 'react'; 
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Loader'; 
import Configure from '../config/Config'; 
import * as RealmLib from '../libs/RealmLib'; 

const LoginScreen = props => {
  
  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState('');
  const ref_input_pwd = useRef();
  

  global.appId = Configure.Realm.appId; 
  AsyncStorage.setItem('appId', global.appId);  


  const validateEmail = (text) => {
   
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) return false;
    else return true;
  }

  
  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!validateEmail(userEmail)) {
      alert('Please fill a valid email');
      return;
    }

    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    
    AsyncStorage.setItem('user_email', userEmail);  
    AsyncStorage.setItem('user_password', userPassword); 

    setLoading(true);  

    RealmLib.login(userEmail, userPassword).then(user => {
     
      AsyncStorage.setItem('user_id', user.id);
      
      RealmLib.openRealm().then(result => {
        setLoading(false);  
       
        let userData = result.privateRealm.objects(Configure.Realm.userData).filtered(`uid = '${global.user.id}'`); 
        global.userData = userData[0]; 
        props.navigation.navigate('DrawerNavigationRoutes'); 
      }).catch(err => {
        setErrortext(err.message);
      })
      
    }).catch(err => {
      setLoading(false);
      setErrortext(err.message);
    }) 
     
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      
      <ScrollView keyboardShouldPersistTaps="handled">

        <View style={{ marginTop: 100 }}>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../assets/cosynclogo.png')}
                style={{ 
                  height: 200,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                //underlineColorAndroid="#4638ab"
                placeholder="Enter Email" 
                autoCapitalize="none"
                keyboardType="email-address" 
                returnKeyType="next" 
                onSubmitEditing={() => ref_input_pwd.current.focus()}
                blurOnSubmit={false}
                
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                //underlineColorAndroid="#4638ab"
                placeholder="Enter Password" 
                keyboardType="default" 
                returnKeyType="go"
                onSubmitEditing={() => Keyboard.dismiss, handleSubmitPress}
                blurOnSubmit={false}
                secureTextEntry={true}
                ref={ref_input_pwd}
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>

            { <Text
              style={styles.registerTextStyle}
              onPress={() => props.navigation.navigate('RegisterScreen')}>
              Create New Account
            </Text>}

          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#4638ab',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: 'white',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: '#4638ab',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#4638ab',
  },
  registerTextStyle: {
    color: '#4638ab',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});