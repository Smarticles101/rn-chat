import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Text,
  Keyboard,
} from "react-native";

import * as firebase from "firebase";

import { connect } from "react-redux";

import { setChannel } from "../action/index";

class ChatScreen extends React.Component {
  state = {
    text: "",
    messages: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.channel !== this.props.channel) {
      this.props.navigation.setOptions({
        title: this.props.channel,
      });
      this.setState({ messages: [] });

      if (this.ref) this.ref.off();

      this.ref = firebase.database().ref("/channels/" + this.props.channel);
      this.ref.on("child_added", (snap) => {
        var messages = Array.from(this.state.messages);
        messages.push(snap.val());
        this.setState({ messages });
      });
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        this.scrollView.scrollToEnd({ animated: false });
      }
    );
    if (this.props.channel && this.props.channel !== "") {
      this.props.navigation.setOptions({
        title: this.props.channel
      });

      this.ref = firebase.database().ref("/channels/" + this.props.channel);
      this.ref.on("child_added", (snap) => {
        var messages = Array.from(this.state.messages);
        messages.push(snap.val());
        this.setState({ messages });
      });
    } else {
      if (
        this.props.profile.channels &&
        this.props.profile.channels.length !== 0
      ) {
        this.props.setChannel(
          this.props.profile.channels[this.props.profile.channels.length - 1]
        );
      } else {
        this.props.navigation.setOptions({
          title: "Join a channel"
        });
        this.props.navigation.navigate("Links");
      }
    }
  }

  submitMessage() {
    let time = firebase.database.ServerValue.TIMESTAMP;

    if (this.state.text !== "") {
      firebase
        .database()
        .ref("/channels/" + this.props.channel)
        .push({
          message: this.state.text,
          author: this.props.profile.username,
          time,
        });
    }

    this.setState({ text: "" });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          ref={(ref) => (this.scrollView = ref)}
          onContentSizeChange={() => {
            this.scrollView.scrollToEnd({ animated: true });
          }}
        >
          {this.props.channel === "" && (
            <LeftMessageBox
              message={{
                message:
                  'Join a channel clicking the "Search" icon on the tab bar.',
              }}
            />
          )}
          {this.state.messages &&
            this.state.messages.map((elm, i) =>
              this.props.profile.username === elm.author ? (
                <RightMessageBox message={elm} key={i} />
              ) : (
                <LeftMessageBox message={elm} key={i} />
              )
            )}
        </ScrollView>
        <View style={styles.textInput}>
          <TextInput
            editable={this.props.channel !== ""}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
            onSubmitEditing={this.submitMessage.bind(this)}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const LeftMessageBox = (props) => (
  <View style={styles.leftMessageBox}>
    <Text style={styles.authorText}>{props.message.author}</Text>

    <View style={styles.leftMessageText}>
      <Text>{props.message.message}</Text>
    </View>
  </View>
);

const RightMessageBox = (props) => (
  <View style={styles.rightMessageBox}>
    <Text style={styles.authorText}>{props.message.author}</Text>

    <View style={styles.rightMessageText}>
      <Text>{props.message.message}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "stretch",
  },
  contentContainer: {
    paddingTop: 30,
  },
  textInput: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "lightgrey",
    backgroundColor: "#fbfbfb",
  },
  leftMessageText: {
    padding: 10,
    marginTop: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "lightgrey",
    maxWidth: 200,
    alignSelf: "flex-start",
  },
  leftMessageBox: {
    alignSelf: "flex-start",
    margin: 10,
  },
  rightMessageText: {
    padding: 10,
    marginTop: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "lightblue",
    maxWidth: 200,
    alignSelf: "flex-end",
  },
  rightMessageBox: {
    alignSelf: "flex-end",
    margin: 10,
  },
  authorText: {
    fontSize: 10,
    color: "grey",
    margin: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    channel: state.channel,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setChannel: (channel) => dispatch(setChannel(channel)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
