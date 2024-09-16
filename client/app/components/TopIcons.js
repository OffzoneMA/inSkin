import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet ,Image, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, images } from '../constants'
const TopIcons = ({ selectedIcon, onIconSelect }) => {
  

  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={() => onIconSelect('grid')}>
      <Image source={selectedIcon === 'grid' ? images.selection1: images.noselection1} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onIconSelect('tree')}>
      <Image source={selectedIcon === 'tree' ? images.selection2: images.noselection2} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default TopIcons;
