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
} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import BannerAd from './BannerAd';

const { width: screenWidth } = Dimensions.get('window');

const Home = ({route, favorites, setFavorites}) => {
  const {userId} = route.params; // Nhận userId từ params
  const [footballFields, setFootballFields] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef(null);

  // Danh sách banner có chứa id sản phẩm liên quan
  const [banners, setBanners] = useState([
    {
      id: 1,
      productId: 1,
      name: 'Sân bóng',
      availability:'có sẵn',
      image_url:
        'https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/hinh-nen-bong-da-1.jpg',
    },
    {
      id: 2,
      productId: 2,
      name: 'Sân bóng',
      availability:'có sẵn',
      image_url:
        'https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/hinh-nen-bong-da-120.jpg',
    },
    {
      id: 3,
      productId: 3,
      name: 'Sân bóng',
      availability:'có sẵn',
      image_url:
        'https://png.pngtree.com/thumb_back/fh260/back_our/20190621/ourmid/pngtree-guild-wars-world-cup-soccer-background-template-image_192600.jpg',
    },
    {
      id: 4,
      productId: 4,
      name: 'Sân bóng',
      availability:'có sẵn',
      image_url:
        'https://png.pngtree.com/png-vector/20220211/ourmid/pngtree-abstract-soccer-football-banner-flashlight-professional-vector-png-image_35162972.jpg',
    },
    // Thêm các ảnh banner khác tương ứng với id sản phẩm
  ]);

  const fetchFootballFields = async () => {
    try {
      const response = await fetch('http://192.168.0.104:3000/football_fields');
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
      const response = await fetch(`http://192.168.0.104:3000/users/${userId}`);
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
    
    // Nếu là yêu thích, xóa khỏi danh sách yêu thích
    if (isFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== item.id);
      setFavorites(updatedFavorites); // Cập nhật danh sách cục bộ ngay lập tức
  
      try {
        // Gửi yêu cầu PATCH đến server để cập nhật danh sách favorites
        const response = await fetch(`http://192.168.0.104:3000/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: updatedFavorites, // Cập nhật danh sách yêu thích
          }),
        });
  
        if (response.ok) {
          console.log('Xóa yêu thích thành công:', item);
        } else {
          const errorText = await response.text(); // Log nội dung lỗi
          console.error('Lỗi khi xóa yêu thích:', errorText);
        }
      } catch (error) {
        console.error('Lỗi khi kết nối đến server:', error);
        // Nếu có lỗi, phục hồi lại trạng thái danh sách yêu thích
        setFavorites([...updatedFavorites, item]);
      }
    } else {
      // Nếu chưa phải yêu thích, thêm vào danh sách
      const updatedFavorites = [...favorites, item];
      setFavorites(updatedFavorites); // Cập nhật danh sách cục bộ ngay lập tức
  
      try {
        // Gửi yêu cầu PATCH đến server để cập nhật danh sách favorites
        const response = await fetch(`http://192.168.0.104:3000/users/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            favorites: updatedFavorites, // Cập nhật danh sách yêu thích
          }),
        });
  
        if (response.ok) {
          console.log('Thêm yêu thích thành công:', item);
        } else {
          const errorText = await response.text(); // Log nội dung lỗi
          console.error('Lỗi khi thêm yêu thích:', errorText);
        }
      } catch (error) {
        console.error('Lỗi khi kết nối đến server:', error);
        // Nếu có lỗi, phục hồi lại trạng thái danh sách yêu thích
        setFavorites([...updatedFavorites.filter(fav => fav.id !== item.id)]);
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
        <Image
        source={{uri: item.image_url}}
        style={styles.itemImage}
        />
        <Text style={styles.itemText}>Tên sân: {item.name}</Text>
        <Text style={styles.itemText}>Địa điểm: {item.location}</Text>
        <Text style={styles.itemText}>
          Giá mỗi giờ: {item.price_per_hour} VND
        </Text>
        <Text style={styles.itemText}>Tình trạng: {item.availability}</Text>
        <Text style={styles.itemText}>
          Loại mặt sân: {item.surface_type}
        </Text>

        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.heartIcon}
        onPress={() => toggleFavorite(item)}>
        <Text style={{fontSize: 30, color: favorites.find(fav => fav.id === item.id) ? 'red' : 'gray'}}>
        {favorites.find(fav => fav.id === item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
      </View>
    );
  };

// Tự động cuộn banner sau mỗi 3 giây
// useEffect(() => {
//   const interval = setInterval(() => {
//     setCurrentBannerIndex(prevIndex =>
//       prevIndex === banners.length - 1 ? 0 : prevIndex + 1,
//     );

//     if (bannerRef.current) {
//       bannerRef.current.scrollToIndex({
//         index: currentBannerIndex === banners.length - 1 ? 0 : currentBannerIndex + 1,
//         animated: true,
//       });
//     }
//   }, 3000); // Thời gian cuộn banner 2 giây

//   return () => clearInterval(interval); // Xóa interval khi component unmount
// }, [currentBannerIndex, banners.length]);

// Hàm render banner
const renderBanner = () => (
  <BannerAd 
    banners={banners}
    onPress={(item) => navigation.navigate('Detail', { product: item })}
  />
);


  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <Image
          source={require('../Images/icon_logo.png')}
          style={styles.logo}
        />
        {renderBanner()}
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            alignSelf: 'flex-start',
            marginLeft: 25,
            color: 'black',
            marginTop: 10,
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
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  listContent: {
    alignItems: 'center',
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
    fontSize: 17,
    fontWeight: 'bold',
  },
  itemImage:{
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
    // marginLeft: 10,
    // marginRight: 10,
    marginHorizontal: 10,
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
  bannerList: {
    //backgroundColor: 'gray',
    width: screenWidth,
    marginBottom: 10,
  },
  bannerImage: {
    width: screenWidth, // Chiều rộng của màn hình
    height: 250, // Chiều cao của banner
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
});
