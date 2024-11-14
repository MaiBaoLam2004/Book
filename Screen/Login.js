import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { URL } from './Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async (usernameParam, passwordParam) => {
    const user = usernameParam || username;
    const pass = passwordParam || password;

    if (!user || !pass) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${URL}:3000/users`);
      const users = await response.json();

      const foundUser = users.find(
        u => u.username === user && u.password === pass,
      );

      if (foundUser) {
        if (rememberMe) {
          await AsyncStorage.setItem('rememberedUsername', user);
          await AsyncStorage.setItem('rememberedPassword', pass);
        } else {
          await AsyncStorage.removeItem('rememberedUsername');
          await AsyncStorage.removeItem('rememberedPassword');
        }

        navigation.navigate('BottomTabNav', {
          userId: foundUser,
        });
      } else {
        Alert.alert('Đăng nhập thất bại', 'Tài khoản hoặc mật khẩu không đúng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkRememberedUser = async () => {
      const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
      const rememberedPassword = await AsyncStorage.getItem('rememberedPassword');
      if (rememberedUsername && rememberedPassword) {
        setUsername(rememberedUsername);
        setPassword(rememberedPassword);
        handleLogin(rememberedUsername, rememberedPassword);
      }
    };
    checkRememberedUser();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
      <ScrollView>
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
              placeholder="Tài khoản"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, {flex: 1}]}
                placeholder="Mật khẩu"
                placeholderTextColor="#888"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name={rememberMe ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#888"
                  />
                  <Text style={styles.rememberMeText}>Nhớ tài khoản</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleLogin()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Bạn chưa có tài khoản?</Text>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerButtonText}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  rememberMeText: {
    marginLeft: 10,
    color: '#888',
  },
});
