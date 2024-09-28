import { StyleSheet, Text, View, Button, Image } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';

const Detail = ({route}) => {
  const navigation = useNavigation();
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Button title="Quay lại" onPress={() => navigation.navigate('BottomTabNav')} />
      </View>
      <Image source={{ uri: product.image_url }} style={styles.image} />
      <Text style={styles.itemText}>Tên sân: {product.name}</Text>
      <Text style={styles.itemText}>Địa điểm: {product.location}</Text>
      <Text style={styles.itemText}>Giá mỗi giờ: {product.price_per_hour} VND</Text>
      <Text style={styles.itemText}>Tình trạng: {product.availability}</Text>
      <Text style={styles.itemText}>Loại mặt sân: {product.surface_type}</Text>
      <Text style={styles.itemText}>Số lượng người chơi tối đa: {product.max_players}</Text>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  image: {
    width: '50%',
    height: 200,
    marginBottom: 20,
  },
  itemText: {
    marginBottom: 10,
    fontSize: 16,
  },
});