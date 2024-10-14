import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {URL} from './Home';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';


function Login(props) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [checkRemember, setCheckRemember] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const CheckLogin = async () => {
    if (email === "") {
      ToastAndroid.show("Email không được bỏ trống", ToastAndroid.SHORT);
      return;
    }
    if (pass === "") {
      ToastAndroid.show("Pass không được bỏ trống", ToastAndroid.SHORT);
      return;
    }

    let url = `${URL}/users?email=` + email + `&pass=` + pass;

    fetch(url)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.length !== 1) {
          ToastAndroid.show("Email không chính xác", ToastAndroid.SHORT);
          return false;
        }
        const user = data[0];
        if (user.pass !== pass) {
          ToastAndroid.show("Pass không chính xác", ToastAndroid.SHORT);
          return false;
        } else {
          await AsyncStorage.setItem("User", JSON.stringify(user, userRole));
          const userRole = user.role;
          rememberAccount();
          ToastAndroid.show("Login thành công", ToastAndroid.SHORT);
          props.navigation.navigate("Main");
        }
      });
  };

  const rememberAccount = async () => {
    try {
      if (checkRemember) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("pass", pass);
      } else {
        await AsyncStorage.setItem("email", "");
        await AsyncStorage.setItem("pass", "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const retrieveData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("pass");
      if (storedEmail !== null && storedPassword !== null) {
        setEmail(storedEmail);
        setPass(storedPassword);
        setCheckRemember(true);
      } else {
        setPass("");
        setCheckRemember(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      retrieveData();
      return () => {
        setEmail("");
        setPass("");
        setShowPass(true);
        setCheckRemember(false);
      };
    }, [])
  );

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <Image
            resizeMode="center"
            style={styles.logoapp}
            source={require('../Images/icon_logo.png')}
          />
          <Text style={styles.title}>Đăng nhập</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            placeholderTextColor="#888"
            onChangeText={(txt) => setEmail(txt)}
              value={email || ""}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, {flex: 1}]}
           
              placeholder="Nhập mật khẩu"
              placeholderTextColor="#888"
              onChangeText={(txt) => setPass(txt)}
                value={pass || ""}
                secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Icon
              name={confirmPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setCheckRemember(!checkRemember)}>
                <Image
                  style={{width: 20, height: 20}}
                  source={
                    checkRemember
                      ? require('../Image/check.png')
                      : require('../Image/circle.png')
                  }
                />
              </TouchableOpacity>
              <Text style={{marginLeft: 10}}>Nhớ tài khoản</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => props.navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => CheckLogin()}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Bạn chưa có tài khoản?</Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                props.navigation.navigate("Register");
              }}>
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textTransform: 'uppercase',
    marginTop: 100,
  },
  logoapp: {
    width: 200,
    height: 200,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '40%',
    transform: [{translateY: -12}],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#841584',
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: '80%',
    height: 70,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  registerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
  },
  registerButton: {
    marginTop: 5,
  },
  registerButtonText: {
    color: 'red',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
