import React from 'react'
import { View } from 'react-native'
import ReactNativeModal from 'react-native-modal'
import styles from './styles'
import { LocalesMessages } from '../../../constants/locales'
import AppText from '../../../components/AppText'
import { colors, images } from '../../../constants'
import AppIconButton from '../../../components/AppIconButton'
import ProfileOptionView from '../../../components/ProfileOptionView'

const ActionModal = ({
  isVisible = false,
  isFromFavoriteProduct = false,
  onPressClose,
  onPressEditCategory,
  onPressDeleteCategory,
}) => {
  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      style={styles.modal}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <AppText
            text={LocalesMessages.action}
            size='font15px'
            fontFamily='medium'
            color={colors.inputTextColor}
          />
          <AppIconButton
            imageSource={images.close}
            imageStyle={styles.closeImage}
            imageContainerStyle={[styles.closeImageContainer]}
            onPress={onPressClose}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.bodyContainer}>
          <ProfileOptionView
            leftImageSource={isFromFavoriteProduct ? images.actionShare : images.edit}
            leftImageStyle={[styles.plusImage]}
            titleText={
              isFromFavoriteProduct
                ? LocalesMessages.shareProduct
                : LocalesMessages.editCategoryInfo
            }
            titleTextStyle={styles.createText}
            mainContainerStyle={styles.createMainContainer}
            leftImageTitleContainerStyle={styles.createLeftImageTitleContainer}
            onPress={onPressEditCategory}
          />
          <ProfileOptionView
            leftImageSource={images.delete}
            leftImageStyle={[styles.plusImage]}
            titleText={
              isFromFavoriteProduct ? LocalesMessages.deleteProduct : LocalesMessages.deleteCategory
            }
            titleTextStyle={styles.createText}
            mainContainerStyle={styles.createMainContainer}
            leftImageTitleContainerStyle={styles.createLeftImageTitleContainer}
            onPress={onPressDeleteCategory}
            isHideDivider={true}
          />
        </View>
      </View>
    </ReactNativeModal>
  )
}
export default ActionModal;
