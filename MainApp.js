import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';

import { connect } from 'react-redux';
import { setSignedIn, setUserProfile } from "./action/index"

import * as firebase from 'firebase';

class MainApp extends React.Component {
    
  componentWillMount() {
    var config = {
      apiKey: "AIzaSyA_kCF11ubrhfEvQn7TAYHC3OQy6UbNisU",
      authDomain: "chat-app-bd176.firebaseapp.com",
      databaseURL: "https://chat-app-bd176.firebaseio.com",
      projectId: "chat-app-bd176",
      storageBucket: "chat-app-bd176.appspot.com",
      messagingSenderId: "549872912747"
    };

    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
    
    firebase.auth().useDeviceLanguage();
    firebase.auth().onAuthStateChanged((user) => {
        this.props.onAuthStateChanged(!!user)

        if (user) {
            firebase.database()
            .ref('/users/' + user.uid)
            .once('value', (o) => {
                this.props.onUserProfile(o.val())
            })
        }
    });
  }

  render() {

    if (!this.props.signedIn) {
        return <LoginScreen />;
    } else {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                <AppNavigator />
            </View>
        )
    }
  }
}

const mapStateToProps = state => ({
  signedIn: state.signedIn
})

const mapDispatchToProps = dispatch => ({
    onAuthStateChanged: signedIn => dispatch(setSignedIn(signedIn)),
    onUserProfile: profile => dispatch(setUserProfile(profile))
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
