import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TextInput, TouchableOpacity, ScrollView  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// con
const PostDetails = ({ route }) => {
  const { post } = route.params;
  console.log('post :', post);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'; // Formater en K avec une décimale
    }
    return num.toString();
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <View style={styles.starContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <Icon key={`full-${i}`} name="star" size={20} color="gold" />
        ))}
        {halfStars === 1 && <Icon key="half" name="star-half" size={20} color="gold" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Icon key={`empty-${i}`} name="star-outline" size={20} color="gold" />
        ))}
      </View>
    );
  };

  const renderComment = (comment, index) => (
    <View key={index} style={styles.comment}>
      <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentName}>{comment.name}</Text>
        <Text style={styles.commentDate}>{comment.date}</Text>
        <Text style={styles.commentText}>{comment.comment}</Text>
        <View style={styles.reactions}>
          <View style={styles.reaction}>
            <Text style={styles.reactionText}><Icon name="caret-up" size={20} color="#EA6479" /> {formatNumber(comment.upvotes)}</Text>
          </View>
          <View style={styles.reaction}>
            <Text style={styles.reactionText}><Icon name="caret-down" size={20} color="#EA6479" /> {formatNumber(comment.downvotes)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const [commentText, setCommentText] = useState('');

  const handleSend = () => {
    // Logic to handle sending the comment
    console.log('Comment sent:', commentText);
    setCommentText('');
  };


  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: post.image }} style={styles.productImage} />
      <View style={styles.star}>
        {renderStars(post.user.rating)}
        <Text style={{ fontSize: 18, marginLeft:10 }}>{post.user.rating}</Text>
        <View style={styles.productStats}>
          <Text style={styles.productStat}><Icon name="heart-outline" size={18} /> {post.likes}</Text>
          <Text style={styles.productStat}><Icon name="eye-outline" size={18} /> {post.views}</Text>
          <Text style={styles.productStat}><Icon name="share-outline" size={18} /> {post.shares}</Text>
        </View>
      </View>
      <View style={styles.product}>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{post.title}</Text>
          <Text style={styles.productBrand}>{post.brand}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bookmark-outline" size={21} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="heart-outline" size={21} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.descriptionHeader}>Description</Text>
        <Text style={styles.productDescription}>{post.content}</Text>
      </View>
      <Text style={styles.commentsHeader}>Comments</Text>
      {post.comments.map((comment, index) => renderComment(comment, index))}
      
      <View style={styles.commentInputContainer}>
      <TextInput
        style={styles.commentInput}
        placeholder="Add a Comment"
        value={commentText}
        onChangeText={(text) => setCommentText(text)}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Icon name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: 'white',
    },
    productImage: {
      width: '100%',
      height: 300,
      borderRadius: 8,
    },
    star: {
        marginVertical: 8,
        flexDirection: 'row',
        // justifyContent: 'space-around',
        marginLeft:2,

    },
    productInfo: {
      marginTop: 10,
    //   alignItems: 'center',
    },
    productTitle: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    productBrand: {
      fontSize: 16,
      color: 'gray',
    },
    starContainer: {
      flexDirection: 'row',
    },
    productStats: {
      flexDirection: 'row',
      marginVertical: 3,
      justifyContent: 'space-between',
      width: '50%',
      marginLeft: 50,
    },
    productStat: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 14,
    },
    productDescription: {
      // marginTop: 2,
      fontSize: 16,
      color: 'gray',
    },
    descriptionHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 6,
    },
    product:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        width: '18%',
        marginTop:14,
    },
    iconButton: {
        marginLeft: 10,
    },
    commentsHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 16,
    },
    comment: {
      flexDirection: 'row',
      marginVertical: 8,
    },
    commentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    commentContent: {
      marginLeft: 8,
      flex: 1,
    },
    
    commentName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },

    commentDate: {
      fontSize: 14,
      color: '#888',
      marginLeft:3,
      marginTop:2,
    },

    commentText:{
      fontSize: 14,
      marginVertical: 6,
      color: '#888',
    },

    reactions: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      alignItems: 'center',
      // marginTop: 4,
    },
    reaction: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight:10,
    },

    reactionText: {
      marginLeft: 5,
      fontSize: 14,
      color: '#888',
    },

    commentInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: 'white',
      // borderRadius: 10,
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.2,
      // shadowRadius: 2,
      // elevation: 2,
      margin: 10,
    },

    commentInput: {
      flex: 1,
      height: 45,
      borderColor: '#e0e0e0',
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 10,
      marginRight: 8,
    },
    
    sendButton: {
      backgroundColor: '#EA6479',
      borderRadius: 6,
      padding: 10,
    },
});

export default PostDetails;
