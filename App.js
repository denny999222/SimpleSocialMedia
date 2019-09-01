import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from "react-navigation";
import { f, auth, database, storage } from "./app/config/config";

import feed from "./app/screens/feed";
import upload from "./app/screens/upload";
import profile from "./app/screens/profile";
import userProfile from "./app/screens/userProfile";
import comments from "./app/screens/comments";
import { initFirebaseFunc } from "./app/config/config";

const TabStack = createBottomTabNavigator({
  Feed: {
    screen: feed
  },
  Upload: {
    screen: upload
  },
  Profile: {
    screen: profile
  }
});

const MainStack = createStackNavigator(
  {
    Home: {
      screen: TabStack
    },
    User: {
      screen: userProfile
    },
    Comments: {
      screen: comments
    }
  },
  // apply features to your app-screen
  {
    initialRouteName: "Home",
    mode: "modal", // card and modal are same in android, this mode is only for iOS
    headerMode: "none"
  }
);

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // make sure app always returns AppContainer
    return <AppContainer />;
  }
}

// always pass your Navigation-module to AppContainer
const AppContainer = createAppContainer(MainStack);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;






// import { AppLoading } from 'expo';
// import { Asset } from 'expo-asset';
// import * as Font from 'expo-font';
// import React, { useState } from 'react';
// import { Platform, StatusBar, StyleSheet, View } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// import AppNavigator from './navigation/AppNavigator';

// export default function App(props) {
//   const [isLoadingComplete, setLoadingComplete] = useState(false);

//   if (!isLoadingComplete && !props.skipLoadingScreen) {
//     return (
//       <AppLoading
//         startAsync={loadResourcesAsync}
//         onError={handleLoadingError}
//         onFinish={() => handleFinishLoading(setLoadingComplete)}
//       />
//     );
//   } else {
//     return (
//       <View style={styles.container}>
//         {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
//         <AppNavigator />
//       </View>
//     );
//   }
// }

// async function loadResourcesAsync() {
//   await Promise.all([
//     Asset.loadAsync([
//       require('./assets/images/robot-dev.png'),
//       require('./assets/images/robot-prod.png'),
//     ]),
//     Font.loadAsync({
//       // This is the font that we are using for our tab bar
//       ...Ionicons.font,
//       // We include SpaceMono because we use it in HomeScreen.js. Feel free to
//       // remove this if you are not using it in your app
//       'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
//     }),
//   ]);
// }

// function handleLoadingError(error: Error) {
//   // In this case, you might want to report the error to your error reporting
//   // service, for example Sentry
//   console.warn(error);
// }

// function handleFinishLoading(setLoadingComplete) {
//   setLoadingComplete(true);
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });