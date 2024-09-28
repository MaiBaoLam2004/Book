import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

const Home = ({route, favorites, setFavorites}) => {
  const {userId} = route.params; // Nhận userId từ params
  const [footballFields, setFootballFields] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchFootballFields = async () => {
    try {
      const response = await fetch('http://192.168.1.10:3000/football_fields');
      const json = await response.json();
      setFootballFields(json);
    } catch (error) {
      console.error('Error fetching football fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const response = await fetch(`http://192.168.1.10:3000/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setFavorites(userData.favorites || []);
      } else {
        console.error('Failed to fetch user favorites');
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  useEffect(() => {
    fetchFootballFields();
    fetchUserFavorites(); // Lấy danh sách yêu thích của người dùng khi màn hình Home được mở
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFootballFields().then(() => setRefreshing(false));
  }, []);

  const toggleFavorite = async (item) => {
    const isFavorite = favorites.find(fav => fav.id === item.id);
  
    // Lấy danh sách yêu thích hiện tại từ server
    let currentFavorites = favorites;
  
    if (isFavorite) {
      try {
        console.log('Removing favorite:', item);
        const updatedFavorites = currentFavorites.filter(fav => fav.id !== item.id);
        console.log('Updated Favorites (Remove):', updatedFavorites);
  
        const response = await fetch(`http://192.168.1.10:3000/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: updatedFavorites, // Cập nhật danh sách yêu thích
          }),
        });
  
        if (response.ok) {
          setFavorites(updatedFavorites);
          console.log('Favorite removed successfully:', item);
          fetchUserFavorites(); // Cập nhật lại danh sách yêu thích
          fetchFootballFields(); // Cập nhật lại danh sách sân bóng
        } else {
          const errorText = await response.text();
          console.error('Failed to remove favorite:', errorText);
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    } else {
      // Nếu chưa phải yêu thích, thêm vào danh sách
      try {
        const updatedFavorites = [...currentFavorites, item];
        console.log('Updated Favorites (Add):', updatedFavorites);
  
        const response = await fetch(`http://192.168.1.10:3000/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: updatedFavorites, // Cập nhật danh sách yêu thích
          }),
        });
  
        if (response.ok) {
          setFavorites(updatedFavorites);
          console.log('Favorite added successfully:', item);
          fetchUserFavorites(); // Cập nhật lại danh sách yêu thích
          fetchFootballFields(); // Cập nhật lại danh sách sân bóng
        } else {
          const errorText = await response.text();
          console.error('Failed to add favorite:', errorText);
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };
  
  
  const renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={[styles.touchableContainer, ]}
          onPress={() => navigation.navigate('Detail', {product: item})}>
          <View>
            <Text style={styles.itemText}>Tên sân: {item.name}</Text>
            <Text style={styles.itemText}>Địa điểm: {item.location}</Text>
            <Text style={styles.itemText}>
              Giá mỗi giờ: {item.price_per_hour} VND
            </Text>
            <Text style={styles.itemText}>Tình trạng: {item.availability}</Text>
            <Text style={styles.itemText}>
              Loại mặt sân: {item.surface_type}
            </Text>
            <Text style={styles.itemText}>
              Số lượng người chơi tối đa: {item.max_players}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => toggleFavorite(item)}>
          <Text style={{fontSize: 25}}>
            {favorites.find(fav => fav.id === item.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <Image
          source={require('../Images/icon_logo.png')}
          style={styles.logo}
        />
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            alignSelf: 'flex-start',
            marginLeft: 25,
            color: 'black',
          }}>
          Tất cả các sân
        </Text>
        <FlatList
          data={footballFields}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'ceter',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  list: {
    flexGrow: 0,
    marginTop: 20,
  },
  listContent: {
    alignItems: 'center',
  },
  itemContainer: {
    padding: 10,
    //marginHorizontal: 5,
    //marginBottom: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'black',
    marginLeft: 10,
    //backgroundColor: 'blue',
    marginRight: 10,
  },
  touchableContainer:{
    //backgroundColor: 'white',
    //height: '70%',
    width: '100%',
    //backgroundColor:'gray',
    
  },
  itemText: {
    marginBottom: 5,
    color: 'black',
    fontSize: 16,
  },
  heartIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
});
