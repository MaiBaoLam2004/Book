import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { URL } from './Home';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const Payment = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedTime, selectedField, userId, email, product, date } = route.params; // Retrieve email from route params

    const handlePayment = async () => {
        const paymentData = {
            userId,
            email:email,
            time: selectedTime,
            fieldType: selectedField,
            fieldId: product,
            date: date,
            status: true,
        };

        try {
            const response = await fetch(`${URL}:3000/payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                navigation.navigate('Payok');
                console.log('Payment successful', response);
            } else {
                Alert.alert('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('An error occurred. Please try again.');
        }
    };

    const createNotification = async () => {
        const notificationData = {
            userId,
            message: `Thanh toán của bạn thành công.`,
            name: product.name,
            date: date,
            time: selectedTime,
            read: false,
        };

        try {
            const response = await fetch(`${URL}:3000/notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notificationData),
            });
            console.log('Notification created:', response);

            if (!response.ok) {
                console.error('Failed to create notification');
            }
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Thẻ Tín Dụng</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tên Chủ Thẻ"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nhập Số Thẻ Visa"
                    keyboardType="numeric"
                    placeholderTextColor="#888"
                />
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Ngày Hết Hạn (MM/YY)"
                        keyboardType="numeric"
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput1]}
                        placeholder="CVV"
                        keyboardType="numeric"
                        secureTextEntry={true}
                        placeholderTextColor="#888"
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.payButton} onPress={() => { handlePayment(), createNotification() }}>
                <Text style={styles.payButtonText}>Thanh Toán Ngay</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default Payment;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        width: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 50,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'left',
        color: 'white',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '100%',
        backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '65%',
    },
    halfInput1: {
        width: '30%',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 6,
    },
    payButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    payButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});
