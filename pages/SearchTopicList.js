'use strict';

var React = require('react-native');
var UserItem = require("../component/UserItem");
var utilsMixin = require('../utils/utilsMixin');
var settings = require("../utils/settings");

var {
   Text,
   Image,
   View,
   StyleSheet,
   ListView,
   TouchableOpacity,
   TouchableWithoutFeedback
 } = React;

var SearchTopicList = React.createClass({
  mixins: [utilsMixin],

  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
    }
  },
  componentWillMount: function(){
    this._fetch();
  },
  _fetch: function(){
    if(this.props.isTag){
      console.log("searchTag");
      var searchAddress = settings.serverAddress + "/api/core/topics/search/tag/?search=" + this.props.keyWord;
    }else{
      console.log("NormalSearch");
      var searchAddress = settings.serverAddress + "/api/core/topics/?search=" + this.props.keyWord;

    }
    fetch(searchAddress).
    then(res => res.json()).
    then(res => {
      console.log(res);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(res)
      });
    })
    .catch(e => console.log(e))
    .done()
  },
  _renderRow: function(rowData){
    console.log(rowData.content.replace("\n", "").substr(0, 80));
    console.log(rowData.content.replace("\n", ""));
    return(
      <View style={{paddingTop: 10, paddingBottom: 10, borderTopColor: "#fcfcf5", borderLeftColor: "#fcfcf5",borderRightColor: "#fcfcf5",borderBottomColor: '#e6e0d8',borderWidth: 1,}}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Image style={styles.thumbnail} source={{uri: rowData.avatar_url}} />
          <TouchableOpacity onPress={(e) => this._goOtherPage(rowData.user)}>
            <Text style={{marginLeft: 8,fontSize:12, fontWeight: "bold", color: "#48b8a7"}}>{rowData.nickname}</Text>
          </TouchableOpacity>
          <Text style={{marginLeft: 8,fontSize:11, color: "#bab9a8"}}>发布了</Text>
          <View style={{position: "absolute", right: 5, flexDirection: "row", alignItems: "center"}}>
            <View style={{justifyContent: "center", height: 18,marginRight: 6, borderColor: "#faa531", borderWidth: 1, borderRadius: 9}}>
              <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.tags.join("-")}</Text>
            </View>
            <View style={{justifyContent:"center",height: 18, borderColor: "#faa531", borderWidth: 1, borderRadius: 9}}>
              <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.month_str}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={(e) => this._goTopic(rowData.pk)}>
          <Text style={{fontWeight: "bold", fontSize: 16, color: "#223e4d", marginLeft: 14, marginTop: 12}}>{rowData.title}</Text>
        </TouchableOpacity>
        <View style={styles.abstract}>
          <TouchableOpacity onPress={(e) => this._goTopic(rowData.pk)}>
            <Image style={styles.coverImage} source={rowData.cover?{uri: rowData.cover}:require("image!default_cover")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={(e) => this._goTopic(rowData.pk)}>
            <View style={styles.abstractTextWrapper}>
              <Text style={styles.abstractText}>{rowData.content.replace("/\s/g", "").substr(0, 80)}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.rightFoot}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Image source={require("image!Public_ic_love")} />
            <Text style={styles.commentStyle}> {rowData.like_count}</Text>
          </View>
          <View style={{flexDirection: "row", marginLeft: 22, alignItems: "center"}}>
            <Image source={require("image!Public_ic_comment")} />
            <Text style={styles.commentStyle}> {rowData.discussion_count}</Text>
          </View>
          <View style={{flex: 1,flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
            <Text style={{marginRight: 14, fontSize: 10, color: "#bab9a8"}}>{rowData.pub_time}</Text>
          </View>
        </View>
      </View>
    );
  },
  render: function(){
    return (
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <View style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={this._back}>
              <Image source={require("image!Profile2_but_Back_white")} />
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.headerText}>{this.props.keyWord}</Text>
          <View style={{flex: 1}} />
        </View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  rightFoot:{
    marginTop: 15,

    flexDirection: "row",
    marginLeft: 14
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#fcfcf5",
  },
  abstract: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
    flexDirection: "row"
  },
  coverImage: {
    width: 100,
    height: 70,
  },
  abstractTextWrapper: {
    flex: 1
  },
  abstractText: {
    color: "#7e8e97",
    fontSize: 12,
    lineHeight: 20,
    paddingRight : 10,
    paddingLeft : 10,
    height: 65
  },
  header: {
    height: 60,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#48b8a7',
    flexDirection: 'row',
    paddingTop: 15
  },
  thumbnail: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: 14,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white'
  },
   container: {
     flex: 1,
     flexDirection: 'row',
     backgroundColor: '#fcfcf5',
     borderWidth: 1,
     borderBottomColor: '#ccc',
     borderTopColor: '#F5FCFF',
     borderLeftColor: '#F5FCFF',
     borderRightColor: '#F5FCFF',
     height: 74,
     alignItems: "center"
   },
    commentStyle: {
    fontSize: 13,
    color: "#7e8e97",
    textAlign:"justify"
  },
});

module.exports = SearchTopicList;
