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
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BannerAd from './BannerAd';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

const Home = ({ route }) => {
  const { userId } = route.params || {};
  const [footballFields, setFootballFields] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [banners] = useState([
    {
      id: 1,
      productId: 1,
      name: 'Sân bóng',
      availability: 'có sẵn',
      image_url:
        'https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/hinh-nen-bong-da-1.jpg',
    },
    {
      id: 2,
      productId: 2,
      name: 'Sân bóng',
      availability: 'có sẵn',
      image_url:
        'https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/hinh-nen-bong-da-120.jpg',
    },
    {
      id: 3,
      productId: 3,
      name: 'Sân bóng',
      availability: 'có sẵn',
      image_url:
        'https://png.pngtree.com/thumb_back/fh260/back_our/20190621/ourmid/pngtree-guild-wars-world-cup-soccer-background-template-image_192600.jpg',
    },
    {
      id: 4,
      productId: 4,
      name: 'Sân bóng',
      availability: 'có sẵn',
      image_url:
        'https://png.pngtree.com/png-vector/20220211/ourmid/pngtree-abstract-soccer-football-banner-flashlight-professional-vector-png-image_35162972.jpg',
    },
  ]);

  const fetchData = async () => {
    try {
      const [fieldsResponse, favoritesResponse] = await Promise.all([
        fetch('http://192.168.0.104:3000/football_fields'),
        fetch(`http://192.168.0.104:3000/favorites?userId=${userId}`)
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
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const toggleFavorite = async (item) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== item.id)
      : [...favorites, { ...item, userId }];

    try {
      const response = await fetch(`http://192.168.0.104:3000/favorites${isFavorite ? `/${item.id}` : ''}`, {
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
        setFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error(`Lỗi khi kết nối đến server:`, error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => navigation.navigate('Detail', { product: item })}
      >
        <View>
          <Image source={{ uri: item.image_url }} style={styles.itemImage} />
          <Text style={styles.itemText}>Tên sân: {item.name}</Text>
          <Text style={styles.itemText}>Địa điểm: {item.location}</Text>
          <Text style={styles.itemText}>Giá mỗi giờ: {item.price_per_hour} VND</Text>
          <Text style={styles.itemText}>Tình trạng: {item.availability}</Text>
          <Text style={styles.itemText}>Loại mặt sân: {item.surface_type}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.heartIcon} onPress={() => toggleFavorite(item)}>
        <Text style={{ fontSize: 30, color: favorites.find(fav => fav.id === item.id) ? 'red' : 'gray' }}>
          {favorites.find(fav => fav.id === item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderBanner = () => (
    <BannerAd
      banners={banners}
      onPress={(item) => navigation.navigate('Detail', { product: item })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.container}>
          <Image source={require('../Images/icon_logo.png')} style={styles.logo} />
          {renderBanner()}
          <Text style={styles.sectionTitle}>Tất cả các sân</Text>
          <FlatList
            data={footballFields}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            horizontal
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity
            style={styles.favoritesButton}
            onPress={() => navigation.navigate('Favourite', { userId })}
          >
            <Icon name="heart" size={40} color="red" />
          </TouchableOpacity>
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
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    alignSelf: 'center',
  },
  listContent: {
    alignItems: 'center',
  },
  touchableContainer: {
    width: '100%',
  },
  itemText: {
    marginBottom: 5,
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },
  itemImage: {
    height: 150,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 0,
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
    marginHorizontal: 10,
  },
  bannerList: {
    width: screenWidth,
    marginBottom: 10,
  },
  bannerImage: {
    width: screenWidth,
    height: 250,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  list: {
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 30,
    alignSelf: 'flex-start',
    marginLeft: 25,
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
  },
  favoritesButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 100,
    padding: 6,
  },
});
