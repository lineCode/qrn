'use strict';

var React = require('react-native');
var utilsMixin = require('../utils/utilsMixin');
var NavHeader = require("../component/NavHeader");
var Address = require("../component/Address");
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;
var UtilsFunctions = require('../utils/functions');
var settings = require("../utils/settings");

var {
   StyleSheet,
   Text,
   Image,
   Dimensions,
   PixelRatio,
   View,
   ScrollView,
   ListView,
   TouchableOpacity,
   TextInput,
   TouchableHighlight,
   AlertIOS
 } = React;


var Reply = React.createClass({
  mixins: [utilsMixin],
  getInitialState: function(){
    // this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    // this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      keyboardSpace: 0,
      dataSource: ds.cloneWithRows([]),
      content: null,
      reply: "",
      placeholderText: "发布回复"
    };
  },
  updateKeyboardSpace(frames) {
    if(frames.end){
      this.setState({keyboardSpace: frames.end.height});
    }
  },
  resetKeyboardSpace() {
    this.setState({keyboardSpace: 0});
  },
  componentWillMount: function(){
    this._fetch();
  },
  componentDidMount: function() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },
  componentWillUnmount: function() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },
  _fetch: function(){
    fetch(settings.serverAddress + "/core/api/discussion/" + this.props.pk + "/detail/")
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(res => {
        console.log(res);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.dataset)
        });
      }
    )
    .catch(e => console(e))
    .done
  },
  _post: function(){
    fetch(settings.serverAddress + "/api/core/comment/create/", {method: "POST", body:
      UtilsFunctions.object2form({
        'discussion': this.props.pk,
				"content": this.state.content,
				"reply": this.state.reply,
      })
    })
    .then((res) => {
			console.log(res);
			return res.json()
		})
    .then((resJson) => {
			// AlertIOS.alert("发表成功");
      this.refs.sss.clear();
			console.log(resJson);
			this._fetch();
    })
    .catch(e => {console.log(e);})
    .done();
  },
  _hideKeyboard: function(){
    this.refs.sss.blur();
  },
  _reply: function(pk, nickname){
    console.log("go");
    console.log(pk);
    this.setState({
      reply: pk,
      placeholderText: "回复: " + nickname
    });
  },
  _delete: function(pk){
    AlertIOS.alert(
    null,
    '确认删除',
      [
        {text: '取消', onPress: () =>
          {
            console.log('取消 Pressed!')
          }
        },
        {text: '删除', onPress: () =>
          {
            fetch(settings.serverAddress + "/api/core/comment/" + pk + "/operate/", {method: "DELETE"})
            .then((res) => {
              if(res.status === 204){
                this._fetch();
              }
            })
            .catch(e => {console.log(e);})
            .done();
          }
        },
      ]
    )
  },
  _renderRow: function(rowData){
    console.log(rowData);
    return (
      <TouchableHighlight onPress={() => {
          if(rowData.is_mine){
            // alert("无法回复自己");
            return null
          }
          this._reply(rowData.pk, rowData.user.nickname)
        }
      }
      underlayColor="#ccc">
        <View>
          <View style={styles.commentHead}>
            <Image source={{uri: rowData.user.avatar}} style={styles.avater} />
            <Text style={styles.nickname}>{rowData.user.nickname}</Text>
            <View style={{flex: 1}}>
              <Text style={styles.pub_time}>{rowData.timesince}</Text>
            </View>
          </View>
          <Text style={styles.content}>{rowData.reply_user?<Text style={{color: "#48b8a7"}}>@{rowData.reply_user.nickname} </Text>:null}{rowData.content}</Text>
          {
            rowData.is_mine?
            <View style={{flexDirection: "row"}}>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
                <View style={{marginRight: 14}}>
                  <Text style={{color: "#0e27e8"}} onPress={()=>this._delete(rowData.pk)}>删除</Text>
                </View>
              </View>
            </View>:
            null
          }
          <View style={[styles.thickLine, {marginTop: 10}]} />
        </View>
      </TouchableHighlight>
    );
  },
  render: function(){
    return (
      <View style={{"flex" :1}}>
        <ScrollView
          stickyHeaderIndices={[0]}
          automaticallyAdjustContentInsets={false}
        >
        <View style={styles.header}>
          <TouchableHighlight underlayColor="#48b8a7" onPress={this._back}  style={{flex: 1}}>
            <Image source={require("image!Profile2_but_Back_white")} />
          </TouchableHighlight>
          <Text style={styles.headerText}>{this.props.title}</Text>
          <TouchableHighlight style={styles.headerRight} underlayColor="#48b8a7" onPress={this._hideKeyboard}>
            <Image source={require("image!Profile2_but_share_white")} />
          </TouchableHighlight>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          automaticallyAdjustContentInsets={false}
        />
        <View style={{height: 50}} />
        </ScrollView>
        <View style={[styles.input,{bottom: this.state.keyboardSpace}]}>
          <TextInput
            ref="sss"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={this.state.placeholderText}
            placeholderTextColor="#bab9a8"
            style={{backgroundColor: "#fcfcf6", height: 50, borderColor: '#ebebe5', borderWidth: 1, flex: 1, fontSize: 13, color: "#384543", paddingLeft: 10}}
            onChangeText={(text) => this.setState({content: text})}
            value={this.state.text}
          />
          <TouchableHighlight style={styles.publishContainer} underlayColor="#ccc" onPress={this._post}>
            <Text style={styles.publish}>发布</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#48b8a7',
    flexDirection: 'row',
    paddingTop: 15
  },
  headerText: {
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    flex: 1
  },
  headerRight:{
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  commentHead: {
    flexDirection: "row",
    marginTop: 16
  },
  avater: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: 14,
    marginRight: 8
  },
  nickname: {
    color:"#48b8a7",
    fontSize: 13,
    fontWeight: "bold"
  },
  pub_time: {
    marginRight: 14,
    color: "#bab9a8",
    fontSize: 11,
    textAlign: "right"
  },
  content: {
    marginLeft: 50,
    marginRight: 15,
    color: "#384543",
    fontSize: 13,
  },
  thickLine:{
    height: 1 / PixelRatio.get(),
    backgroundColor: "#eeede9",
    marginLeft: 50
  },
  input:{
    flexDirection: "row",
    position: "absolute",
    right: 0,
    left: 0
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
  }
});

module.exports = Reply
