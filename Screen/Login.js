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
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.0.104:3000/users');
      const users = await response.json();
  
      const user = users.find(
        u => u.username === username && u.password === password,
      );
      
      if (user) {
        const userId = user.id; // Lấy userId từ đối tượng user
        // Điều hướng đến màn hình BottomTabNav và truyền thông tin người dùng
        navigation.navigate('BottomTabNav', { 
          screen: 'Trang chủ', 
          params: { 
            userId: userId, // Truyền userId
            username: user.username, 
            favorites: user.favorites // Truyền danh sách yêu thích
          } 
        });
      } else {
        Alert.alert('Đăng nhập thất bại', 'Tài khoản hoặc mật khẩu không đúng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Mật khẩu"
              placeholderTextColor="#888"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
          <View
            style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }}
          >
            <Text style={{ fontSize: 16 }}>Bạn chưa có tài khoản?</Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
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
    //position: 'absolute',
    top: 0,
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
    transform: [{ translateY: -12 }],
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
  registerButton: {
    marginTop: 5,
  },
  registerButtonText: {
    color: 'red',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 20,
  },
  loginButton: {
    width: '80%',
    height: 70,
    backgroundColor: 'blue', // Màu nền của nút
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
});
