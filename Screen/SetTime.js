import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

const hours = Array.from({length: 15}, (_, i) => {
    const startHour = i + 7;
    const endHour = startHour + 1;
    return { id: i, time: `${startHour}:00 - ${endHour}:00` };
});
const fieldTypes = [
    { id: 1, type: 'Sân cỏ nhân tạo' },
    { id: 2, type: 'Sân cỏ tự nhiên' }
];

const SetTime = ({ route }) => {
    const navigation = useNavigation();
    const { userId, product } = route.params;
    
    // Log userId and product to the console
    console.log('userId settime:', userId);
    console.log('product settime:', product);

    const [selectedHour, setSelectedHour] = useState(null);
    const [selectedFieldType, setSelectedFieldType] = useState(null);
    const [showFieldTypes, setShowFieldTypes] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handlePress = (item) => {
        if (selectedHour === item.id) {
            setShowFieldTypes(!showFieldTypes);
        } else {
            setSelectedHour(item.id);
            setSelectedFieldType(null); // Reset selected field type when a new hour is selected
            setShowFieldTypes(true); // Always show field types when a new hour is selected
        }
    };

    const handleFieldTypePress = (type) => {
        setSelectedFieldType(type.id);
    };

    const handlePaymentPress = () => {
        if (selectedHour !== null && selectedFieldType !== null) {
            const selectedTime = hours.find(hour => hour.id === selectedHour).time;
            const selectedField = fieldTypes.find(field => field.id === selectedFieldType).type;
            navigation.navigate('Payment', { selectedTime, selectedField, userId, product, date: date.toISOString() });
        } else {
            alert('Vui lòng chọn khung giờ và loại sân.');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Khung giờ đặt sân</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.headerTextTime}>Ngày: {date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            <FlatList
                data={hours}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={() => handlePress(item)}>
                        <View style={styles.timeSlot}>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                        {selectedHour === item.id && showFieldTypes && (
                            <View style={styles.fieldTypeContainer}>
                                {fieldTypes.map((type) => (
                                    <TouchableOpacity key={type.id} style={styles.fieldTypeOption} onPress={() => handleFieldTypePress(type)}>
                                        <Text style={styles.fieldTypeText}>{type.type}</Text>
                                        {selectedFieldType === type.id && (
                                            <Icon name="checkmark-circle" size={24} color="green" style={styles.checkmark} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handlePaymentPress}>
                <Text style={styles.buttonText}>Thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Icon name="arrow-back" size={25} color="white" />
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
    headerTextTime: {
        fontSize: 24,
        fontWeight: 'bold',
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
    fieldTypeContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#e9ecef',
        borderRadius: 20,
    },
    fieldTypeOption: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fieldTypeText: {
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 6,
    },
});
