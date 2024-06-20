import { Image, View } from 'react-native'
import React from 'react'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import styles from './styles'

const ChatBubbleView = ({ index, item }) => {
  const isSender = item.isSender
  return (
    <View key={index}>
      <View
        key={index}
        style={[
          styles.mainBubbleContainer,
          isSender && {
            justifyContent: 'flex-end',
          },
        ]}>
        <View
          style={[
            styles.textContainer,
            {
              backgroundColor: isSender ? colors.pink : colors.receiverBubble,
            },
          ]}>
          <AppText
            size='font14px'
            color={!isSender ? colors.black : colors.white}
            text={item.message}
          />
        </View>
        <Image
          source={isSender ? images.senderBubbleMark : images.receiverBubbleMark}
          style={[styles.cornerMarkImage, !isSender ? { left: 0 } : { right: 1 }]}
        />
      </View>
      {isSender ? (
        <View style={styles.sendStatusContainer}>
          <Image source={images.messageSent} style={styles.sendStatusImage} />
          <AppText
            size='font12px'
            color={colors.subTitleGray}
            text={item.sentTime}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  )
}

export default ChatBubbleView
