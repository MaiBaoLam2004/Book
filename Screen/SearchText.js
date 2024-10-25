import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { URL } from './Home';

const SearchText = () => {
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
                            <Text style={styles.text}>{item.name}</Text>
                            <Text style={styles.text}>{item.location}</Text>
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
        padding: 16,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'white',
        marginTop: 10,
        borderWidth: 1,
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
});
