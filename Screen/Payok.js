import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const Payok = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Thanh toán thành công!</Text>
            <Button
                title="Quay lại màn hình chính"
                onPress={() => navigation.goBack()}
                color="#841584"
            />
        </View>
    )
}

export default Payok

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    message: {
        fontSize: 24,
        marginBottom: 20,
        color: '#333',
        fontWeight: 'bold',
    },
})