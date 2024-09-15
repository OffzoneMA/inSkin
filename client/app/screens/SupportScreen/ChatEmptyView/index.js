import { View } from 'react-native'
import React from 'react'
import { colors } from '../../../constants'
import { LocalesMessages } from '../../../constants/locales'
import styles from './styles'
import AppText from '../../../components/AppText'

const ChatEmptyView = () => {
  return (
    <View style={styles.mainContainer}>
      <AppText
        size='font16px'
        color={colors.subTitleGray}
        text={LocalesMessages.youHaveNoMessages}
      />
    </View>
  )
}

export default ChatEmptyView
