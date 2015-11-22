'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var InvertibleScrollView = require('react-native-invertible-scroll-view');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var UtilsFunctions = require('../utils/functions');
var settings = require("../utils/settings");

var {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  AlertIOS,
  ActionSheetIOS,
  TextInput,
  ActivityIndicatorIOS,
  ScrollView,
  TouchableHighlight,
} = React;

var BUTTONS = [
    "举报",
    "取消"
];

var MessageDetails = React.createClass({
  mixins: [TimerMixin],
  _action: function(userId){
    ActionSheetIOS.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: 1
    },
    (buttonIndex) => {
        if(buttonIndex === 0){
          fetch(settings.serverAddress + "/api/purify/commit/user/", {method: "POST", body:
            UtilsFunctions.object2form({
              target_object_id: userId,
              description: "违规"
            })
          })
          .then((res) => {
            console.log(res);
            if(res.status === 201){
              AlertIOS.alert("举报成功");
            }
          })
          .catch(e => {
            console.log(e);
          })
          .done();
        }

      }
    )},
  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    console.log(ds);
    return {
      dataSource: ds.cloneWithRows([]),
      keyboardSpace: 0,
      input: ""
    }
  },
  updateKeyboardSpace: function(frames) {
    if (frames.end){
      this.setState({keyboardSpace: frames.end.height});
    }
  },
  resetKeyboardSpace: function() {
    this.setState({keyboardSpace: 0});
  },
  componentDidMount: function() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },
  componentWillUnmount: function() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },
  _post: function(){
    fetch(settings.serverAddress + "/api/message/interview/" + this.props.userId + "/", {method: "POST", body:
      UtilsFunctions.object2form({
        'body': this.state.input,
      })
    })
    .then((res) => res.json())
    .then((resJson) => {
      if (resJson.body){
        this.refs.input.clear();
        this._fetch();
      }
    })
    .catch(e => {console.log(e);})
    .done();
  },
  _fetch: function(){
    fetch(settings.serverAddress + "/api/message/interview/" + this.props.userId + "/").
    then(res => res.json()).
    then(res => {
      console.log(res);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(res.messages),
      });
    })
    .catch(e => console.log(e))
    .done()
  },
  _renderRow: function(rowData){
    if (rowData.sent_by_me){
      return (
        <View>
        <View style={{flex: 1, flexDirection: 'row', marginTop: 25, justifyContent: "flex-end"}}>
          {
            rowData.body.length > 22?
            <View style={{flex: 1, marginLeft: 14}}>
              <View style={{padding: 10, backgroundColor: "#48b8a7", borderRadius: 8, paddingRight: 10,}} >
                <Text style={{color: "#fff", fontSize: 14}}>
                  {rowData.body}
                </Text>
              </View>
              <Text style={{fontSize: 11, color: "#ac9ea0", marginTop: 8}}>{rowData.timesince}</Text>
            </View>:
            <View>
              <View style={{padding: 10, backgroundColor: "#48b8a7", borderRadius: 8, paddingRight: 10,}} >
                <Text style={{color: "#fff", fontSize: 14}}>
                  {rowData.body}
                </Text>
              </View>
              <Text style={{fontSize: 11, color: "#ac9ea0", marginTop: 8}}>{rowData.timesince}</Text>
            </View>
          }
          <Image source={{uri: rowData.sender.avatar}} style={[styles.avatar, {marginRight: 14, marginLeft: 10}]}/>
        </View>
        </View>
      );
    }
    else{
      return (
        <View style={{flex: 1, flexDirection: 'row', marginTop: 25}}>
          <Image source={{uri: rowData.sender.avatar}} style={[styles.avatar, {marginRight: 10, marginLeft: 14}]}/>
          <View>
            <View style={{padding: 10, backgroundColor: "#48b8a7", borderRadius: 8, paddingRight: 10,}} >
              <Text style={{color: "#fff", fontSize: 14}}>
                {rowData.body}
              </Text>
            </View>
            <Text style={{fontSize: 11, color: "#ac9ea0", textAlign: "right", marginTop: 8}}>{rowData.timesince}</Text>
          </View>
        </View>
      );
    }
  },
  componentWillMount: function(){
    // this.setInterval(
    //   () => { this._fetch(); },
    //   5000
    // );
    this._fetch();
    // this.setState({
    //   // dataSource: this.state.dataSource.cloneWithRows(res.messages)
    //   dataSource: this.state.dataSource.cloneWithRows([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99])
    // });
  },
  render: function(){
    return (
      <View style={{flex: 1, backgroundColor: "#fcfcf5"}}>
        <View style={{height: 60}} />
        <ListView
          ref="View"
          value={this.state.input}
          renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          style={[styles.container, {"marginBottom": 60,bottom: this.state.keyboardSpace}]}
          bounces={false}
          automaticallyAdjustContentInsets={false}
        />
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <TouchableHighlight underlayColor="#48b8a7" onPress={(e) => this.props.navigator.pop()}>
              <Image source={require("image!Profile2_but_Back_white")} />
            </TouchableHighlight>
          </View>
            <Text style={styles.headerText}>{this.props.userName}</Text>
          <View style={{flex: 1}}>
            <Text style={[styles.headerText, {textAlign: "right", marginRight: 7}]} onPress={() => this._action(this.props.userId)}>操作</Text>
          </View>
        </View>
        <View style={[styles.input, {bottom: this.state.keyboardSpace}]}>
          <TextInput
            ref="input"
            autoCorrect={false}
            onChangeText={(text) => {this.setState({input: text})}}
            autoCapitalize="none"
            style={{backgroundColor: "#fcfcf6", height: 50, borderColor: '#ebebe5', borderWidth: 1, flex: 1}}
            value={this.state.text}
            controlled={true}
          />
          <TouchableHighlight onPress={this._post} style={styles.publishContainer} underlayColor="#ccc">
            <Text style={styles.publish}>发布</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#48b8a7',
    flexDirection: 'row',
    paddingTop: 15,
    position: "absolute",
    right: 0,
    left: 0,
    top: 0
  },
  headerText: {
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    flex: 1
  },
  input:{
    flexDirection: "row",
    position: "absolute",
    right: 0,
    left: 0,
    bottom: 0
  },
  publishContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#ebebe5',
    borderWidth: 1,
    backgroundColor: "#ebebe5",
    width: 100,
  },
  publish:{
    paddingTop: 16,
    color: "#48b8a7",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18
  }
});

module.exports = MessageDetails;
