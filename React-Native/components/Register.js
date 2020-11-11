 
import React, { useState, useEffect, useRef } from 'react';

//Import all required component
import {  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView, } from 'react-native';
import { set } from 'react-native-reanimated';
import Loader from './Loader'; 

const Register = props => {
  
  let [errortext, setErrortext] = useState('');
  let [infotext, setInfotext] = useState('');

  let [userEmail, setUserEmail] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [userConfPassword, setUserConfPassword] = useState('');
  let [loading, setLoading] = useState(false); 
  const ref_input_pwd = useRef();
  const ref_input_conf_pwd = useRef();

  useEffect(() => {
    
  }, []);

    const validateEmail = (text) => {
    
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) return false;
      else return true;
    }

    
    const handleSubmitPress = () => {

      setErrortext('');
      setInfotext('');

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
      if (!userConfPassword) {
        alert('Please fill Confirmed Password');
        return;
      } 
      
      if (userPassword != userConfPassword) {
        alert('Password and Confirmed Password doesn\'t match.');
        return;
      } 
      if (userPassword.length < 6) {
        alert('Password and Confirmed Password must be at least 6 charactor.');
        return;
      } 

      setLoading(true);   
      
      const appConfig = {
        id:  global.appId,
        timeout: 10000,
      };

      const app = new Realm.App(appConfig);
      if(app.currentUser) app.currentUser.logOut();
      
      app.emailPasswordAuth.registerUser(userEmail, userPassword).then(result => {
         
        setLoading(false);  
        setInfotext('Your account has been created. Please log in to the app.');

      }).catch(err => { 
        setLoading(false);   
        setErrortext(`Error: ${err.message}`);
      })
     
      
    };



  return (
    <View style={styles.mainBody}>  
      <Loader loading={loading} />
      <ScrollView keyboardShouldPersistTaps="handled">

    
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
                underlineColorAndroid="#4638ab"
                placeholder="Enter Email" //dummy@abc.com
                //placeholderTextColor="#4638ab"
                autoCapitalize="none" 
                autoCorrect={false}
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
                underlineColorAndroid="#4638ab"
                placeholder="Enter Password"
                keyboardType="default" 
                returnKeyType="next" 
                blurOnSubmit={false}
                secureTextEntry={true}
                ref={ref_input_pwd}
                onSubmitEditing={() => ref_input_conf_pwd.current.focus()}
              />
            </View>

            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserConfPassword => setUserConfPassword(UserConfPassword)}
                underlineColorAndroid="#4638ab"
                placeholder="Enter Confirmed Password"
                keyboardType="default"
                returnKeyType="go" 
                blurOnSubmit={false}
                secureTextEntry={true}
                ref={ref_input_conf_pwd}
                onSubmitEditing={() => Keyboard.dismiss, handleSubmitPress}
              />
            </View>

            {errortext != '' ? (
              <Text style={styles.errorTextStyle}> {errortext} </Text>
            ) : null}

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>REGISTER</Text>
            </TouchableOpacity>

            {infotext != '' ? (
              <Text style={styles.registerTextStyle}> {infotext} </Text>
            ) : null}

        </KeyboardAvoidingView>
      </ScrollView>
    </View>

  );
};
export default Register;

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