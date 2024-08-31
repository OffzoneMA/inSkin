import { Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors, images } from '../../../../constants'
import AppText from '../../../AppText'
import styles from './styles'

const CategoryOptionView = ({ value, selectedCategory, onPressOption }) => {
  const isSelected = selectedCategory == value.id
  console.log("isSelected",isSelected);
  return (
    <TouchableOpacity key={value.id} style={styles.touchContainer} onPress={() => {
      
      console.log("Selected Category ID:", value.id);
      console.log("Selected Category Text:", value.category);
      onPressOption(value.category); // Appeler la fonction de rappel
    }}>
      <View
        style={[
          styles.mainContainer,
          {
            borderWidth: isSelected ? 0 : 1,
            backgroundColor: isSelected ? colors.categoryOptionSelected : colors.white,
          },
        ]}>
        <Image
          source={isSelected ? images.radio_select : images.radio_unselect}
          style={styles.radioImage}
        />
        
        <AppText
          text={value.category}
          size='font15px'
          color={colors.inputTextColor}
          style={styles.titleText}
        />
      </View>
    </TouchableOpacity>
  )
}

export default CategoryOptionView
