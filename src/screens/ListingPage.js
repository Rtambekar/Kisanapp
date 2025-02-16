import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';
import CommonButton from '../components/CommonButton';

const ListingPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  // 🔹 Fetch API Data
  const fetchData = async (isRefresh = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=100`);
      const posts = await postsResponse.json();

      const formattedPosts = posts.map((post) => ({
        id: post.id,
        title: t("title") + ": " + post.title,
        body: t("body") + ": " + post.body,
        thumbnailUrl: `https://picsum.photos/100/100?random=${post.id}`,
        uniqueKey: `${post.id}-${Date.now()}`
      }));

      setData(isRefresh ? formattedPosts : [...data, ...formattedPosts]);
    } catch (error) {
      console.error(t("errorFetchingData"), error);
      Alert.alert(t("Error"), t("Failed to fetch data. Please try again."));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLoadMore = () => {
    if (!loading) {
      fetchData();
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
      Alert.alert(t('Success'), t('You have been logged out.'));
      navigation.replace('Login');
    } catch (error) {
      Alert.alert(t('Error'), error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { id: item.id })}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.thumbnailUrl }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("Posts")}</Text>
        <CommonButton 
          title={t("Logout")} 
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>

      {/* Post Listing */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.uniqueKey}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={() => 
          loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0066CC" />
            </View>
          )
        }
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#0066CC"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  listContent: {
    padding: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  thumbnail: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default ListingPage;