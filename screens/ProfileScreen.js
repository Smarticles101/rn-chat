import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import * as firebase from 'firebase';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => firebase.auth().signOut()}
        >
          <Text>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
