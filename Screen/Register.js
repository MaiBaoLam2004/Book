import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    const role = 'user'; // Gán quyền hạn mặc định là 'user'

    try {
      const response = await fetch('http://192.168.0.104:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role: 'user',
          imageUri:
            'https://e7.pngegg.com/pngimages/505/761/png-clipart-login-computer-icons-avatar-icon-monochrome-black.png',
        }), // Bao gồm quyền hạn trong dữ liệu gửi lên server
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Đăng ký thành công');
        // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
        navigation.navigate('Login');
      } else {
        Alert.alert(
          'Lỗi',
          `Đăng ký thất bại: ${data.message || 'Unknown error'}`,
        );
      }
    } catch (error) {
      Alert.alert('Lỗi', `Đã xảy ra lỗi: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <Image
            resizeMode="center"
            style={[styles.logoapp, {marginTop: 0}]}
            source={require('../Images/icon_logo.png')}
          />
          <Text style={styles.title}>Đăng ký</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Mật khẩu"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
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
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }>
              <Icon
                name={confirmPasswordVisible ? 'eye' : 'eye-off'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
              Đăng ký
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Bạn đã có tài khoản? Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginTop: 0, // Thêm khoảng cách phía trên
  },
  logoapp: {
    width: 200,
    height: 200,
    //position: 'absolute',
    top: 0,
    //backgroundColor: 'black',
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
  registerButton: {
    width: '80%',
    height: 70,
    backgroundColor: 'blue', // Màu nền của nút
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
  loginText: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
