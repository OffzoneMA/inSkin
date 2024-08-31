import React, { useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import styles from './styles';
import AppText from '../../../components/AppText';
import { colors, images } from '../../../constants';
import { LocalesMessages } from '../../../constants/locales';
import AppButton from '../../../components/AppButton';

const FilterModal = ({ isVisible = false, onPressClose, onApplyPress, listecategorie }) => {
  const [categoryList, setCategoryList] = useState(listecategorie || []);

  // Fonction de rendu des catégories
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.categoryContainer}
        onPress={() => {
          const updatedList = categoryList.map(value => {
            if (value.category === item.category) {
              value.isSelected = !item.isSelected;
            }
            return { ...value };
          });
          setCategoryList(updatedList);
        }}>
        <AppText text={item.category} size='font14px' color={colors.lightBlack} />
        <Image
          source={item.isSelected ? images.selectedcheckBox : images.checkBox}
          style={styles.checkBoxImage}
        />
      </TouchableOpacity>
    );
  };

  // Fonction pour récupérer les catégories sélectionnées
  const getSelectedCategories = () => {
    return categoryList.filter(category => category.isSelected);
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      hasBackdrop={true}
      backdropTransitionOutTiming={400}
      onBackdropPress={onPressClose}
      swipeDirection={'down'}
      onModalWillShow={() => {
        setCategoryList(listecategorie || []);
      }}
      style={styles.modal}>
      <View style={styles.mainContainer}>
        <View style={styles.dividerTop} />
        <AppText
          text={LocalesMessages.filter}
          size='font18px'
          style={styles.title}
          fontFamily='medium'
        />
        <View style={styles.headerContainer}>
          <AppText
            text={LocalesMessages.category}
            size='font16px'
            fontFamily='medium'
            color={colors.lightBlackSecondary}
          />
        </View>
        <View style={styles.divider} />
        <FlatList data={categoryList} renderItem={renderItem} keyExtractor={(item) => item.category} />
        <View style={styles.divider} />
        <AppButton
          localizedText={LocalesMessages.apply}
          buttonStyle={styles.confirmButton}
          labelStyle={[styles.confirmButtonText]}
          isDisable={
            categoryList.filter(value => value.isSelected).length === 0
          }
          onPress={() => {
            const selectedCategories = getSelectedCategories();
            onApplyPress(selectedCategories); // Transmettre les catégories sélectionnées
            onPressClose();
          }}
        />
      </View>
    </ReactNativeModal>
  );
};

export default FilterModal;
