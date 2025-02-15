// ListingPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, Text, ActivityIndicator, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ListingPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchData = async (isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${isRefresh ? 1 : page}`);
      const posts = await postsResponse.json();
      
      const mergedData = posts.map((post) => ({
        ...post,
        thumbnailUrl: `https://picsum.photos/100/100?random=${post.id}` // Using Lorem Picsum for images
      }));

      setData(isRefresh ? mergedData : [...data, ...mergedData]);
      if (isRefresh) setPage(2); // Reset page after refresh
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleLoadMore = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(true).then(() => setRefreshing(false));
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id })}>
          <View>
            <Image source={{ uri: item.thumbnailUrl }} style={{ width: 100, height: 100 }} />
            <Text>{item.title}</Text>
            <Text numberOfLines={2}>{item.body}</Text>
          </View>
        </TouchableOpacity>
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading && <ActivityIndicator size="large" />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

export default ListingPage;
