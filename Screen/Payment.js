import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Payment = () => {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Thẻ Tín Dụng</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tên Chủ Thẻ"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nhập Số Thẻ Visa"
                    keyboardType="numeric"
                />
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Ngày Hết Hạn (MM/YY)"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="CVV"
                        keyboardType="numeric"
                        secureTextEntry={true}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.payButton} onPress={() => navigation.navigate('Payok')}>
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
        backgroundColor: '#4CAF50', // Màu xanh lá cây
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
        color: 'white', // Thêm màu chữ trắng
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '100%',
        backgroundColor: 'white', // Thêm màu nền trắng cho input
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
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
