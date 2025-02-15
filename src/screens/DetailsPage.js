// DetailsPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const DetailsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        const details = await response.json();
        setData(details);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Image source={{ uri: `https://picsum.photos/300/200?random=${id}` }} style={{ width: '100%', height: 200 }} />
      <Text>{data.title}</Text>
      <Text>{data.body}</Text>
      <Button title="Back to List" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default DetailsPage;
