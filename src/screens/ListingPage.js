import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList, View, Text, ActivityIndicator, RefreshControl, Image,
  TouchableOpacity, Button, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const ListingPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchData = async (isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      // Fetch new data
      const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=100`);
      const posts = await postsResponse.json();

      // Add a unique key to each post by combining the ID with a timestamp
      const mergedData = posts.map((post) => ({
        ...post,
        thumbnailUrl: `https://picsum.photos/100/100?random=${post.id}`,
        uniqueKey: `${post.id}-${Date.now()}` // Unique key for each item
      }));

      // Append new data to the existing list
      setData(isRefresh ? mergedData : [...data, ...mergedData]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMore = () => {
    if (!loading) {
      fetchData(); // Fetch more data when the user scrolls to the end
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(true).then(() => setRefreshing(false));
  }, []);

  // 🔹 Logout Function
  const handleLogout = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('user');
      Alert.alert('Success', 'You have been logged out.');
      navigation.replace('Login'); // Redirect to Login screen
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🔹 Header with Logout Button */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 10 }}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>

      {/* 🔹 Post Listing */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.uniqueKey} // Use the unique key
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id })}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
              <Image source={{ uri: item.thumbnailUrl }} style={{ width: 100, height: 100 }} />
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
              <Text numberOfLines={2}>{item.body}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore} // Triggered when the user scrolls to the end
        onEndReachedThreshold={0.5} // Load more data when the user is halfway through the list
        ListFooterComponent={loading && <ActivityIndicator size="large" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default ListingPage;