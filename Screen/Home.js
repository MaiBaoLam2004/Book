import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BannerAd from './BannerAd';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');
export const URL = "http://192.168.0.104";

const Home = ({ route }) => {
  const { userId } = route.params || {};
  const [footballFields, setFootballFields] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null); // State for selected type
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [fieldsResponse, favoritesResponse] = await Promise.all([
        fetch(`${URL}:3000/football_fields`),
        fetch(`${URL}:3000/favorites?userId=${userId}`)
      ]);

      const fieldsData = await fieldsResponse.json();
      const favoritesData = await favoritesResponse.json();

      setFootballFields(fieldsData);
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [fetchData]);

  const toggleFavorite = useCallback(async (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== item.id)
      : [...favorites, { ...item, userId }];

    try {
      const response = await fetch(`${URL}:3000/favorites${isFavorite ? `/${item.id}` : ''}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: isFavorite ? null : JSON.stringify({ ...item, userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Lỗi khi ${isFavorite ? 'xóa' : 'thêm'} yêu thích:`, errorText);
      } else {
        console.log(`${isFavorite ? 'Xóa' : 'Thêm'} yêu thích thành công:`, item);
        console.log('Danh sách yêu thích:', userId);
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error(`Lỗi khi kết nối đến server:`, error);
    }
  }, [favorites, userId]);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => navigation.navigate('Detail', { product: item, userId })}
      >
        <View>
          <Image source={{ uri: item.image_url }} style={styles.itemImage} />
          <Text style={styles.itemText}>Tên sân: {item.name}</Text>
          <Text style={styles.itemText}>Loại mặt sân: {item.surface_type}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.heartIcon} onPress={() => toggleFavorite(item)}>
        <Text style={{ fontSize: 30, color: favorites.find(fav => fav.id === item.id) ? 'red' : 'gray' }}>
          {favorites.find(fav => fav.id === item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </View>
  ), [favorites, navigation, toggleFavorite]);

  const filteredFields = useMemo(() => {
    if (!selectedType) return footballFields;
    return footballFields.filter(field => field.surface_type === selectedType);
  }, [footballFields, selectedType]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/icon_logo.png')} style={styles.logo} />
        <View style={styles.iconsContainer}>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => navigation.navigate('SearchText', { userId })}
            >
              <Icon name="search" size={40} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoritesButton}
              onPress={() => navigation.navigate('Favourite', {  userId })}
            >
              <Icon name="heart" size={40} color="red" />
            </TouchableOpacity>
          </View>
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <BannerAd />
          <Text style={styles.sectionTitle}>Tất cả các sân</Text>
          <View style={styles.filterButtonsContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setSelectedType(null)}>
              <Text style={styles.filterButtonText}>Tất cả các sân</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => setSelectedType('cỏ nhân tạo')}>
              <Text style={styles.filterButtonText}>Cỏ nhân tạo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => setSelectedType('cỏ tự nhiên')}>
              <Text style={styles.filterButtonText}>Cỏ tự nhiên</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredFields}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
          />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 60,
    height: 70,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  touchableContainer: {
    width: '100%',
  },
  itemText: {
    marginBottom: 5,
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    borderRadius: 20,
  },
  heartIcon: {
    position: 'absolute',
    right: 5,
    top: 0,
  },
  itemContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'black',
    width: screenWidth / 2 - 20,
    margin: 5,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf: 'flex-start',
    marginLeft: 25,
    color: 'black',
    marginTop: 15,
    marginBottom: 10,
  },
  iconsContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
  },
  searchButton: {
    borderRadius: 100,
    padding: 7,
    marginRight: 0,
  },
  favoritesButton: {
    borderRadius: 100,
    padding: 7,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    justifyContent: 'space-between',
  },
  filterButton: {
    marginHorizontal: 10,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  filterButtonText: {
    fontSize: 16,
    color: 'black',
  },
});
