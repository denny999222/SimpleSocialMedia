import React, { Component } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { f, auth, database, storage } from "../config/config.js";
import Button from "../config/Button.js";

console.disableYellowBox = true;

class PhotoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true,
      empty: false,
      startKey: "",
      count: 0
    };
  }

  componentDidMount = () => {
    const { isUser, userId } = this.props;

    if (isUser == true) {
      // Profile, authenticated
      // userId, and show private photos of this user-only
      this.loadFeed(userId);
    } else {
      this.loadFeed("");
    }
  };

  incrementCounter= () => {
    this.setState({
      count:this.state.count+1
    })
  }
  
  decrementCounter= () => {
    this.setState({
      count:this.state.count-1
    })
  }

  // check singular or plural time for "ago"
  pluralCheck = s => {
    if (s == 1) return " ago";
    else return "s ago";
  };

  // function to convert timestamp to readable time
  timeConverter = timestamp => {
    let t = new Date(timestamp * 1000);
    let seconds = Math.floor((new Date() - t) / 1000);

    // check this interval is in years/months/days/hours/minutes?
    // total no of seconds in year are 31536000
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " year" + this.pluralCheck(interval);
    }

    // for months
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " month" + this.pluralCheck(interval);
    }
    // for days
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " day" + this.pluralCheck(interval);
    }
    // for hours
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hour" + this.pluralCheck(interval);
    }
    // for minutes
    interval = Math.ceil(seconds / 60);
    if (interval > 1) {
      return interval + " minute" + this.pluralCheck(interval);
    }

    // for seconds
    return Math.floor(seconds) + " second" + this.pluralCheck(seconds);
  };

  //***** */ display flatlist main function *****

  addToFlatList = (photo_feed, data, photo) => {
    // photo is index eg. for i in array
    let that = this;

    let photoObj = data[photo];

    // for each photo(photoObj) in data(snapshot-value),
    // get details of ea  ch user then push details to photo-feed-array
    database
      .ref("users")
      .child(photoObj.author)
      .child("username") // now taking data's username
      .once("value")
      .then(snapshot => {

        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();

        photo_feed.push({
          id: photo, // photo is like iterable=index eg. for i in array.
          url: photoObj.url,
          caption: photoObj.caption,
          posted: that.timeConverter(photoObj.posted),
          author: data,
          authorId: photoObj.author,
        });

        that.setState({
          refresh: false,
          loading: false
        });
      }) // end of then(snapshot=> function)
      .catch(e => {
        console.log("error in fetching photos object from db in photoList", e);
      });
  };

  // handleLoadMore = () => {
  //   //Fetch new
  //   startKey = this.state.startKey;
  //   this.runLoadMore(1, startKey);
  // };

  // runLoadMore = (perPage, startKey = "") => {
  //   //Fetch new photos
  //   let that = this;

  //   //Fetch most recent photo, we can't rely on firebase-output
  //   let fetchRecords = database
  //     .ref("photos")
  //     .orderByChild("posted")
  //     .limitToLast(perPage + 1 + that.state.startKey);
  //   fetchRecords
  //     .once("value")
  //     .then(function(snapshot) {
  //       const exists = snapshot.val() !== null;
  //       if (exists) {
  //         data = snapshot.val();
  //         let photo_feed = that.state.photo_feed;

  //         that.setState({ empty: false });
  //         let count = 1;
  //         for (let photo in data) {
  //           if (count == snapshot.numChildren()) {
  //             that.setState({ startKey: that.state.startKey + count });
  //           }
  //           that.addToFlatList(photo_feed, data, photo);

  //           count++;
  //         }
  //       } else {
  //         that.setState({ empty: true });
  //       }
  //     })
  //     .catch(error =>
  //       console.log("error in getting photos orderd by 'posted'", error)
  //     );
  // };

  loadFeed = (userId = "") => {

    this.setState({
      refresh: true,
      photo_feed: []
    });

    let that = this;

    let loadRef = database.ref("photos");
    if (userId != "") {
      loadRef = database
        .ref("users")
        .child(userId)
        .child("photos");
    }

    loadRef
      .orderByChild("posted")
      .once("value")
      .then(function(snapshot) {

        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          let photo_feed = that.state.photo_feed;

          that.setState({ empty: false });
          let count = 1;
          console.log("for loop starts in photoList");
          for (let photo in data) {

            if (count == snapshot.numChildren()) {
              that.setState({ startKey: count });
            }

            that.addToFlatList(photo_feed, data, photo);

            count++;
          }
        } else {
          that.setState({ empty: true });
        }
      })
      .catch(error =>
        console.log('error in photos in loadRef orderByChild("posted") ', error)
      );
  };

  loadNew = () => {
    //Load Feed
    this.loadFeed();
  };

  render() {

    let { count } = this.state
    
    return (
      
      <View style={styles.container}>
        
        {this.state.loading == true ? (
          <View style={styles.loadingView}>
            
            {this.state.empty == true ? (
              <Text>No photos found</Text>

            ) : (

              <Text>Loading Screen</Text>

            )}
          </View>

        ) : (

          <FlatList
            refreshing={this.state.refresh}
            onRefresh={this.loadNew}
            data={this.state.photo_feed}
            keyExtractor={(item, index) => index.toString()}
            style={{ backgroundColor: "#eee", flex: 1 }}
            renderItem={({ item, index }) => (
              <View key={index} style={styles.flatlistImage}>
                <View style={styles.postDetails}>
                  <Text>{item.posted}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("User", {
                        userId: item.authorId
                      })
                    }
                  >
                    <Text>{item.author}</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Image
                    source={{ uri: item.url }}
                    style={styles.profilephoto}
                  />
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', marginVertical: 5 }}>{item.caption}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("Comments", {
                            photoId: item.id
                          })
                        }
                        style={{    
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          backgroundColor: "blue",
                          borderRadius: 5,
                          marginHorizontal: 10,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: 16,
                            fontWeight: 'bold'
                          }}
                        >
                          Show all Comments
                        </Text>
                      </TouchableOpacity>
                      <View style={{ marginLeft: 35, flexDirection: 'row', alignItems: 'center'}}>
                        <Button
                            title = { "FAKE" }
                            task = { this.decrementCounter }
                          />
                          <Text style={{ fontSize: 20, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10  }}>{count}</Text>
                          <Button
                            title = { "REAL" }
                            task = { this.incrementCounter }
                          />
                        </View>
                    </View>
                </View>
              </View>
            )}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 70,
    paddingTop: 30,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  profilephoto: {
    resizeMode: "cover",
    width: "100%",
    height: 280
  },
  flatlistImage: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 5,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "grey"
  },
  postDetails: {
    padding: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  loadingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default PhotoList;