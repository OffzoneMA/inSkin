import React, { useState } from 'react';
import { colors, images } from '../../constants';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { encode } from 'base-64';
// API
import authApi from "../../api/auth";
import { useNavigation } from '@react-navigation/native';
const SearchUser = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await authApi.searchUser(searchQuery, '', '');
      setUsers(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const onPressUser = (userId) => {
    navigation.navigate('SearchScreen', { userId });
    console.log('User ID:', userId);
  
  };

  const renderItem = ({ item }) => {
   
    let imageUrl = null;
    if (item.profileImage && item.profileImage.data && item.profileImage.data.data) {
      const imageData = item.profileImage.data.data;
      const base64ImageData = imageData.map(byte => String.fromCharCode(byte)).join('');
        imageUrl = 'data:' + item.profileImage.contentType + ';base64,' + encode(base64ImageData);
    }

    return (
      <TouchableOpacity style={styles.userCard} onPress={() => onPressUser(item)}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
        ) : (
          <Image 
            source={images.userAvatar} // Utilisez une image par défaut si imageUrl est null
            style={styles.avatar}
          />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.userDetails}>{item.followers.length} abonnés</Text>
          <Text style={styles.userDetails}>{item.posts.length} publications</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une personne"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchUsers}>
          <Icon name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: '#EA6479',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  userCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default SearchUser;
