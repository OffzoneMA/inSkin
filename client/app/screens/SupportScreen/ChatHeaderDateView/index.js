import { View } from 'react-native'
import React from 'react'
import { colors } from '../../../constants'
import styles from './styles'
import AppText from '../../../components/AppText'

const ChatHeaderDateView = () => {
  return (
    <View style={styles.mainContainer}>
      <AppText
        size='font12px'
        color={colors.subTitleGray}
        text={'June 23rd'}
        fontFamily='medium'
      />
    </View>
  )
}

export default ChatHeaderDateView
