'use strict';

var React = require('react-native');
var utilsMixin = require('../utils/utilsMixin');
var settings = require("../utils/settings");
var NavHeader = require("../component/NavHeader");
var Swipeout = require('react-native-swipeout');
var DivideBorder = require("../component/DivideBorder");

var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TextInput,
  ActivityIndicatorIOS,
  TouchableWithoutFeedback,
  TouchableOpacity,
  PixelRatio,
  NavigatorIOS,
} = React;

var DraftList = React.createClass({
  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
    }
  },
  _fetch: function(){
    fetch(settings.serverAddress + "/api/core/drafts/")
    .then(res => {
      return res.json();
    })
    .then(resJson => {
      console.log(resJson);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(resJson)
      });
    })
    .catch(e => console.log(e))
    .done();
  },
  componentWillMount: function(){
    this.componentWillReceiveProps();
  },
  componentWillReceiveProps: function(){
    this._fetch();    
  },
  _goTopicDraftDetail:function(draftId){
      this.props.navigator.push({id: "post", draftId: draftId})    
  },
  _goDiscussionDraftDetail: function(draftId, topicId){
      this.props.navigator.push({id: "sendComments", topicId: topicId, draftId: draftId})
  },
  _deleteDraft: function(draftId, is_topic){
    var draftType = is_topic?"topic":"discussion";
    fetch(settings.serverAddress + "/api/core/" + draftType + "/" + draftId + "/operate/", {method: "DELETE"})
    .then((res) => {
      if(res.status === 204){
        this._fetch();
      }
    })
    .catch(e => {console.log(e);})
    .done();
  },
  _renderRow: function(rowData){
    console.log(rowData);
    return (
      <Swipeout autoClose={true} backgroundColor="#fcfcf5" right={[{text: "删除", color: "#fff", backgroundColor: "#b84850", onPress: () =>  this._deleteDraft(rowData.pk, rowData.is_topic)}]}>
        <TouchableOpacity onPress={() => rowData.is_topic ?
                                       this._goTopicDraftDetail(rowData.pk) :
                                       this._goDiscussionDraftDetail(rowData.pk, rowData.topic)}>
          <View>
            {
              rowData.is_topic?
              <Text style={{marginLeft: 14,marginTop: 21, fontSize: 16,fontWeight: "bold", color: "#223e4d"}}>{rowData.title}</Text>:
              <Text style={{marginLeft: 14,marginTop: 21, fontSize: 13, color: "#223e4d"}}>{rowData.content}</Text>
            }
            <View style={{flexDirection: "row", marginTop: 20, marginBottom: 18}}>                
              <Text style={{marginLeft: 14, fontSize: 12, color: "#48b8a7", fontWeight: "bold"}}>{rowData.is_topic?"话题":"评论"}</Text>
              <View style={{flex: 1, justifyContent: "flex-end", flexDirection: "row", marginRight: 14}}>
                <Text style={{fontSize: 10, color: '#8f9da1'}}>保存时间：{rowData.local_time}</Text>
              </View>
            </View>
            <DivideBorder />
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  },
  render: function(){
    return (
      <View style={styles.mainContainer}>
        <NavHeader title="草稿箱" onPress={this.props.navigator.pop}/>
        <ListView
          bounces={false}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    )
  },
});

var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fcfcf5"
  },
  header: {
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#48b8a7',
    flexDirection: 'row',
    paddingTop: 15
  },
  headerText: {
    marginLeft: 125,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white'
  },
});

module.exports = DraftList;
