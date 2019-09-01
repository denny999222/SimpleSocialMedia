import React, { Component } from "react";
import {
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  View,
  Text,
  StyleSheet
} from "react-native";

import PhotoList from "../components/photoList";
import UserAuth from "../components/auth";
import { f, auth, database, storage } from "../config/config";

class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false
    };
  }

  fetchUserInfo = userId => {
    let that = this;
    database
      .ref("users")
      .child(userId)
      .once("value")
      .then(snapshot => {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        // data = one userObject
        that.setState({
          username: data.username,
          name: data.name,
          avatar: data.avatar,
          loggedin: true,
          userId: userId
        });
      });
  };

  componentDidMount = () => {
    // set letiable that=this, for binding
    let that = this;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        // Loggedin
        that.fetchUserInfo(user.uid);
      } else {
        // Not-Loggedin
        that.setState({
          loggedin: false
        });
      }
    });
  };

  logOut = () => {
    f.auth().signOut();
    alert("Logged Out");
  };
  editProfile = () => {
    this.setState({
      editingProfile: true
    });
  };
  saveProfile = () => {
    let name = this.state.name;
    let username = this.state.username;

    if (name !== "") {
      database
        .ref("users")
        .child(this.state.userId)
        .child("name")
        .set(name);
    }
    if (username !== "") {
      database
        .ref("users")
        .child(this.state.userId)
        .child("username")
        .set(username);
    }

    this.setState({
      editingProfile: false
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loggedin == true ? (
          // true-> you are loggedin
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}> Profile </Text>
            </View>
            <View style={styles.profile}>
              <View style={styles.profileDetails}>
                <Text style={{ fontSize: 14 }}>Name: {this.state.name}</Text>
                <Text style={{ fontSize: 14 }}>Username: {this.state.username}</Text>
              </View>
            </View>
            {this.state.editingProfile == true ? (
              // editing is true, show page to edit profile.

              <View style={styles.editProfileView}>
                {/* View for Buttons Name and Username */}
                <View style={styles.editUserInfoName}>
                  <Text style={styles.inputLabelText}>Name:</Text>
                  <TextInput
                    style={styles.textInputArea}
                    editable={true}
                    placeholder={"Please enter your name"}
                    value={this.state.name}
                    onChangeText={text => {
                      this.setState({ name: text });
                    }}
                  />
                </View>
                <View style={styles.editUserInfoName}>
                  <Text style={styles.inputLabelText}>Username:</Text>
                  <TextInput
                    style={styles.textInputArea}
                    editable={true}
                    placeholder={"Please enter your username"}
                    value={this.state.username}
                    onChangeText={text => {
                      this.setState({ username: text });
                    }}
                  />
                </View>

                {/* view for two buttons */}
                <View style={styles.editAndCancellBtnView}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => this.setState({ editingProfile: false })}
                  >
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 14 }}>Cancel Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => this.saveProfile()}
                  >
                    <Text style={{ color: "white", fontWeight: 'bold', fontSize: 14 }}>Save Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // if editing is false, then show buttons, else if true, show edit-page
              /* // LogOut, Edit, UploadPhoto => 3 buttons */
              <View style={styles.buttonsView}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("Upload")}
                  style={styles.upload}
                >
                  <Text style={styles.uploadText}>Upload New Photo</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={styles.buttonEdit}
                    onPress={() => this.editProfile()}
                  >
                    <Text style={styles.labels}>Edit Profile</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.buttonLogout}
                    onPress={() => this.logOut()}
                  >
                    <Text style={styles.labels}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* <PhotoList
              isUser={true}
              userId={this.state.userId}
              navigation={this.props.navigation}
            /> */}
          </View>
        ) : (
          // if user is not authenticated
          <UserAuth message={"Please Login/Signup to View your Profile"} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    height: 70,
    paddingTop: 20,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  profile: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10
  },
  profileDetails: {
    marginRight: 10,
    alignItems: "flex-start"
  },
  buttonLogout: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "red",
    borderRadius: 5,
    width: 150,
    marginLeft: 10
  },
  buttonEdit: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "green",
    borderRadius: 5,
    width: 150,
    marginRight: 10,
  },
  upload: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    borderRadius: 5,
    width: 320,
    marginVertical: 10
  },
  labels: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: 'bold'
  },
  uploadText: {
    textAlign: "center",
    color: "white",
    fontWeight: 'bold',
    fontSize: 16,
  },
  photoLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green"
  },
  buttonsView: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  editProfileView: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  textInputArea: {
    width: 250,
    marginVertical: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: "grey",
    marginLeft: "auto"
  },
  cancelButton: {
    flex: 1,
    marginHorizontal: 10,
    fontWeight: "bold",
    backgroundColor: "blue",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  saveButton: {
    flex: 1,
    marginHorizontal: 5,
    fontWeight: "bold",
    backgroundColor: "green",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },

  editAndCancellBtnView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  editUserInfoName: {
    flexDirection: "row"
  },

  inputLabelText: {
    alignSelf: "center",
    marginRight: 20,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
export default profile;