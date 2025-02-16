import { 
    View, Text, StyleSheet, FlatList, TouchableOpacity, Image, BackHandler 
  } from 'react-native';
  import React, { useState, useEffect, useCallback } from 'react';
  import ReactNativeModal from 'react-native-modal';
  import { useFocusEffect } from '@react-navigation/native';
  
  const SelectLangModal = ({ visible, onClose, onSelect, selectedLang }) => {
    const [languages] = useState([
      { title: 'English' },
      { title: 'ਪੰਜਾਬੀ' },
      { title: 'தமிழ்' },
      { title: 'हिंदी' },
    ]);
  
    const getSelected = () => {
      return languages.findIndex(lang => lang.title === selectedLang);
    };
  
    const [selectedIndex, setSelectedIndex] = useState(getSelected());
  
    // Update selected index when selectedLang changes
    useEffect(() => {
      setSelectedIndex(getSelected());
    }, [selectedLang]);
  
    // Handle Android back button when modal is visible
    useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (visible) {
          onClose();
          return true; // Prevent default behavior
        }
        return false;
      });
  
      return () => backHandler.remove(); // Cleanup
    }, [visible]);
  
    // Close modal when screen loses focus
    useFocusEffect(
      useCallback(() => {
        return () => {
          if (visible) {
            onClose();
          }
        };
      }, [visible])
    );
  
    return (
      <ReactNativeModal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={onClose}
        isVisible={visible}
        style={styles.modalView}
      >
        <View style={styles.modal}>
          <Text style={styles.heading}>Select Language</Text>
          <FlatList
            data={languages}
            keyExtractor={(item) => item.title}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setSelectedIndex(index);
                  onSelect(item.title);
                }}
              >
                <Image
                  source={
                    selectedIndex === index
                      ? require('../images/radio.png')
                      : require('../images/radio-button.png')
                  }
                  style={styles.icon}
                />
                <Text style={styles.itemTxt}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ReactNativeModal>
    );
  };
  
  export default SelectLangModal;
  
  const styles = StyleSheet.create({
    modalView: { margin: 0 },
    icon: { width: 18, height: 18 },
    modal: {
      width: '100%',
      paddingBottom: 20,
      backgroundColor: 'white',
      position: 'absolute',
      bottom: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    heading: {
      fontSize: 20,
      fontWeight: '600',
      color: 'black',
      margin: 20,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 20,
      height: 50,
      borderWidth: 0.5,
      width: '90%',
      alignSelf: 'center',
      marginTop: 10,
      borderRadius: 8,
    },
    itemTxt: { marginLeft: 10 },
  });
  