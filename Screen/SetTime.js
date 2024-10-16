import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const hours = Array.from({length: 15}, (_, i) => `${i + 7}:00`);

const SetTime = () => {
    const navigation = useNavigation();
    const [selectedHour, setSelectedHour] = useState(null);

    const handlePress = (item) => {
        setSelectedHour(item);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Khung giờ đặt sân</Text>
            <FlatList
                data={hours}
                keyExtractor={item => item}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => handlePress(item)}>
                        <View style={styles.timeSlot}>
                            <Text style={styles.timeText}>{item}</Text>
                            {selectedHour === item && (
                                <Icon name="checkmark-circle" size={24} color="green" style={styles.checkmark} />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Payment')}>
                <Text style={styles.buttonText}>Thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Icon name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default SetTime;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: 'black',
    },
    timeSlot: {
        padding: 20,
        marginVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 20,
        color: '#333',
    },
    checkmark: {
        marginLeft: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 6,
    },
});
