import React, { useContext } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import Page from "../../components/Page";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
import { useToast } from "react-native-toast-notifications";
import Button from "../../components/Button";

function ProfileHome({ navigation }) {
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const theme = useTheme();

  const handleLogOut = () => {
    toast.show("Logout Successful", { type: "success" });

    setTimeout(() => {
      authContext.setUser(null);
      authStorage.removeToken();
    }, 300);
  };

  // Placeholder for user profile data
  const userProfile = {
    profilePicture:"person-outline",
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
  };

  return (
    <Page>
      <View style={styles.profileContainer}>
        <View style={[styles.profilePictureContainer, { borderColor: theme["color-primary-default"] }]}>
          <View style={[styles.profileIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
            <Icon
              name={userProfile.profilePicture}
              style={styles.profilePicture} fill={theme["color-primary-unfocus"]}
            />
          </View>
          {/* Floating button for uploading profile picture */}
          
          <Pressable style={[styles.actionButtonIcon, { borderColor: "white", borderWidth: 3, borderRadius: 5, bottom: -10, right: -15, position: "absolute", margin: 5, padding: 8, borderRadius: 100,width: 40, height: 40, backgroundColor: theme["color-primary-disabled"] }]}>
              <Icon name="edit-outline" fill={theme["color-primary-default"]} style={styles.actionButtonIcon} />
          </Pressable>
        </View>

        <Text style={styles.profileName}>
          {userProfile.firstName} {userProfile.lastName}
        </Text>
        <Text style={[styles.profileUserName, { color: theme["color-primary-unfocus"] }]}>
          {userProfile.userName}
        </Text>

        <View style={styles.followersContainer}>
          <Pressable onPress={handleLogOut} style={styles.followersContainerButton}>
            <Text style={styles.followersNumber}>10,4m</Text>
            <Text style={[styles.followersText, { color: theme["color-primary-unfocus"] }]}>Followers</Text>
          </Pressable>

          <Pressable onPress={handleLogOut} style={styles.followersContainerButton}>
            <Text style={styles.followersNumber}>543</Text>
            <Text style={[styles.followersText, { color: theme["color-primary-unfocus"] }]}>Following</Text>
          </Pressable>
        </View>
        
        <Button style={styles.editProfileButton} onPress={handleLogOut}>Edit Profile</Button>
      </View>

      <View style={[styles.separator, { backgroundColor: theme["color-primary-disabled"] }]}></View>

      <Pressable onPress={handleLogOut} style={styles.logoutButton}>
        <View style={[styles.primaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="bookmark-outline" fill={theme["color-primary-default"]} style={styles.logoutIcon} />
        </View>
        <Text style={styles.logoutText}>Saved</Text>
        <View style={[styles.secondaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="arrow-ios-forward-outline" fill={theme["color-primary-unfocus"]} style={styles.logoutIcon} />
        </View>
      </Pressable>

      <Pressable onPress={handleLogOut} style={styles.logoutButton}>
        <View style={[styles.primaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="clock-outline" fill={theme["color-primary-default"]} style={styles.logoutIcon} />
        </View>
        <Text style={styles.logoutText}>Activity Feed</Text>
        <View style={[styles.secondaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="arrow-ios-forward-outline" fill={theme["color-primary-unfocus"]} style={styles.logoutIcon} />
        </View>
      </Pressable>

      <View style={[styles.separator, { backgroundColor: theme["color-primary-disabled"] }]}></View>

      <Pressable onPress={handleLogOut} style={styles.logoutButton}>
        <View style={[styles.primaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="info-outline" fill={theme["color-primary-default"]} style={styles.logoutIcon} />
        </View>
        <Text style={styles.logoutText}>About</Text>
        <View style={[styles.secondaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="arrow-ios-forward-outline" fill={theme["color-primary-unfocus"]} style={styles.logoutIcon} />
        </View>
      </Pressable>

      <Pressable onPress={handleLogOut} style={styles.logoutButton}>
        <View style={[styles.primaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="settings-outline" fill={theme["color-primary-default"]} style={styles.logoutIcon} />
        </View>
        <Text style={styles.logoutText}>Settings</Text>
        <View style={[styles.secondaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="arrow-ios-forward-outline" fill={theme["color-primary-unfocus"]} style={styles.logoutIcon} />
        </View>
      </Pressable>

      <Pressable onPress={handleLogOut} style={styles.logoutButton}>
        <View style={[styles.primaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="log-out" fill={theme["notification-error"]} style={styles.logoutIcon} />
        </View>
        <Text style={styles.logoutText}>Log Out</Text>
        <View style={[styles.secondaryIconWrapper, { backgroundColor: theme["color-primary-disabled"] }]}>
          <Icon name="arrow-ios-forward-outline" fill={theme["color-primary-unfocus"]} style={styles.logoutIcon} />
        </View>
      </Pressable>
    </Page>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  profilePictureContainer: {
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 2,
    padding: 2,
    width: 80,
    height: 80,
  },
  profileIconWrapper: {
    borderRadius: 98,
    padding: 5,
  },
  profilePicture: {
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileUserName: {
    fontSize: 14,
  },
  followersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Align to the left
    marginTop: 10,
  },
  followersContainerButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Align to the left
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  followersNumber: {
    fontSize: 17,
    fontWeight: "bold",
    justifyContent: "center",
  },
  followersText: {
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
  },
  editProfileButton: {
    marginTop: 25,
    borderRadius: 100,
    paddingVertical: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Align to the left
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  logoutText: {
    fontSize: 15,
    marginRight: 10,
    fontWeight: "bold",
  },
  primaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 5, // Make it a circle
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  secondaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 100, // Make it a circle
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  logoutIcon: {
    width: 18,
    height: 20,
    color: "white",
  },
  separator: {
    height: 1, // Adjust the width of the white line as needed
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },

});

export default ProfileHome;
