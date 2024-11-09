import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { URL } from './Home';

const SearchText = ({ route }) => {
    const { userId, product } = route.params;
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`${URL}:3000/football_fields?name_like=${searchQuery}`);
            const data = await response.json();
            const filteredData = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setResults(filteredData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            handleSearch();
        } else {
            setResults([]);
        }
    }, [searchQuery]);
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}>
                    <Icon name="arrow-back" size={25} color="white" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Tìm kiếm"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    placeholderTextColor="black"
                />
            </View>
            {results.length > 0 ? (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => navigation.navigate('Detail', { product: item })}>
                            <Image source={{ uri: item.image_url }} style={styles.image} />
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Tên sân: {item.name}</Text>
                                <Text style={styles.text}>Địa chỉ: {item.location}</Text>
                                <Text style={styles.text}>
                                    Số lượng người chơi: {item.max_players}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>Không có kết quả</Text>
                </View>
            )}
        </View>
    );
};

export default SearchText;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        color: 'black',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        fontSize: 20,
    },
    item: {
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'white',
        marginTop: 10,
        borderColor: 'black',
    },
    backButton: {
        marginRight: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 6,
    },
    text: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        width: '100%',
    },
    textContainer: {
        flex: 1,
        paddingLeft: 10,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultsText: {
        color: 'black',
        padding: 10,
        borderRadius: 5,
        fontSize: 25,
        fontWeight: 'bold',
    },
    image: {
        width: 150,
        height: 100,
        borderRadius: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'black',
    }
});
