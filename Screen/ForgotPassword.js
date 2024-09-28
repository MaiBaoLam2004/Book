import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native'
import React, { useState } from 'react'

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('')

    const handleBack = () => {
        navigation.goBack()
    }

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Lỗi', 'Vui lòng nhập email.')
            return
        }

        try {
            const response = await fetch('http://192.168.1.10:3000/users') // Thay đổi URL thành URL của JSON Server của bạn
            const users = await response.json()

            const userExists = users.some(user => user.email === email)

            if (userExists) {
                Alert.alert('Thành công', 'Email hợp lệ.')
                // Handle further logic here
            } else {
                Alert.alert('Lỗi', 'Email không tồn tại.')
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Lỗi mạng. Vui lòng thử lại.')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quên Mật Khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <Button title="Gửi" onPress={handleSubmit} />
            <View style={styles.buttonSpacing} />
            <Button title="Quay lại" onPress={handleBack} />
        </View>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    buttonSpacing: {
        marginTop: 10, // Adjust this value to increase or decrease the spacing
    },
})
