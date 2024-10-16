import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const BannerItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)} style={styles.bannerItem}>
    <Image source={{ uri: item.image_url }} style={styles.bannerImage} />
    {/* <View style={styles.bannerInfo}>
      <Text style={styles.bannerName}>{item.name}</Text>
      <Text style={styles.bannerAvailability}>{item.availability}</Text>
    </View> */}
  </TouchableOpacity>
);

const BannerAd = ({ banners, onPress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

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
        getItemLayout={(data, index) => ({
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
    resizeMode: 'cover',
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