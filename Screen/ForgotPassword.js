import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = (props) => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Lỗi', 'Vui lòng nhập email.');
            return;
        }

        try {
            const response = await fetch('http://192.168.0.104:3000/users'); // Thay đổi URL thành URL của JSON Server của bạn
            const users = await response.json();

            const userExists = users.some(user => user.email === email);

            if (userExists) {
                Alert.alert('Thành công', 'Email hợp lệ.');
                // Handle further logic here
            } else {
                Alert.alert('Lỗi', 'Email không tồn tại.');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Lỗi mạng. Vui lòng thử lại.');
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
                    <Text style={styles.title}>Quên Mật Khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email của bạn"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
                            Gửi
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
                            Quay lại
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    submitButton: {
        width: '40%',
        height: 60,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 20,
    },
    backButton: {
        width: '40%',
        height: 60,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 20,
    },
});
