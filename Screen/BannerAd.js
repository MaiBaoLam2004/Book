import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const BannerAd = ({ onPress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
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
        'https://kenh14cdn.com/zoom/600_315/2018/7/2/photo1530500879363-15305008793631926738934.jpg',
    },
    {
      id: 3,
      productId: 3,
      name: 'Sân bóng',
      availability: 'có sẵn',
      image_url:
        'https://cdn.bongdaplus.vn/Assets/Media/2022/11/25/41/ronaldo7.jpg',
    },
    {
      id: 4,
      productId: 4,
      name: 'Tình yêu nồng cháy',
      availability: 'có sẵn',
      image_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTowJiIx7fQdG7c8MmKzWrRAoC1NDA71uSkdQ&s',
    },
    {
      id: 5,
      productId: 5,
      name: 'Ván cờ định mệnh',
      availability: 'có sẵn',
      image_url:
        'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/11/20/1118715/Messi-Ronaldo.jpg',
    },
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex === banners.length - 1) {
        setCurrentIndex(0);
        flatListRef.current.scrollToIndex({ index: 0, animated: true });
      } else {
        setCurrentIndex(currentIndex + 1);
        flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex, banners.length]);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setCurrentIndex(index);
  };

  const BannerItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', { product: item })} style={styles.bannerItem}>
      <Image source={{ uri: item.image_url }} style={styles.bannerImage} />
      {/* <View style={styles.bannerInfo}>
        <Text style={styles.bannerName}>{item.name}</Text>
        <Text style={styles.bannerAvailability}>{item.availability}</Text>
      </View> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={({ item }) => <BannerItem item={item} onPress={onPress} />}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex ? styles.paginationDotActive : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  bannerItem: {
    width: screenWidth,
    height: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    padding: 10,
  },
  bannerInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  bannerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerAvailability: {
    color: 'white',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
});

export default BannerAd;