import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CommonButton from '../components/CommonButton';

const DetailsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const { t } = useTranslation();

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `https://picsum.photos/800/400?random=${id}` }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Title Section */}
          <Text style={styles.title}>{data.title}</Text>

          {/* Body Section */}
          <Text style={styles.body}>{data.body}</Text>

          {/* Button Section */}
          <View style={styles.buttonContainer}>
            <CommonButton
              title={t('Back to List')}
              onPress={() => navigation.goBack()}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingVertical: 16,
  },
  button: {
    backgroundColor: '#0066CC',
    borderRadius: 12,
    paddingVertical: 12,
  },
});

export default DetailsPage;