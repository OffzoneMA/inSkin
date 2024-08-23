import React, { useContext } from 'react'
import { Image, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from './styles'
import { colors, images } from '../../constants'
import { LocalizationContext } from '../../context/LocalizationContext'
import { LocalesMessages } from '../../constants/locales'

const AppCommentTextArea = ({
  placeholderText = LocalesMessages.addAComment,
  mainContainerStyle,
  onPressSendButton,
  onChangeText,
  textValue,
}) => {
  
  return (
    <View style={[styles.container, mainContainerStyle]}>
      <TextInput
        placeholder={placeholderText ? placeholderText : ''}
        placeholderTextColor={colors.lightBlack}
        style={styles.textInputStyle}
        multiline
        value={textValue}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.sendButtonContainer} onPress={onPressSendButton}>
        <Image source={images.send} style={styles.sendButton} />
      </TouchableOpacity>
    </View>
  )
}

export default AppCommentTextArea
