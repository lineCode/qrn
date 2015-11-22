'use strict';

var React = require('react-native');
var UtilsFunctions = require('../utils/functions');
var utilsMixin = require('../utils/utilsMixin');
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
  NavigatorIOS,
} = React;

var TopicsListPage = React.createClass({
    mixins: [utilsMixin],
    getInitialState: function(){
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
        dataSource: ds.cloneWithRows([]),
      }
    },
    _fetch: function(){
      console.log(this.props.url);
      fetch(this.props.url)
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
      this._fetch();
    },
    _renderRow: function(rowData){
      return(
        <View style={{paddingTop: 10, paddingBottom: 10, borderTopColor: "#fcfcf5", borderLeftColor: "#fcfcf5",borderRightColor: "#fcfcf5",borderBottomColor: '#e6e0d8',borderWidth: 1,}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
              <View style={{justifyContent: "center", height: 18,marginRight: 6, marginLeft: 14, borderColor: "#faa531", borderWidth: 1, borderRadius: 9}}>
                <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.tags.join("-")}</Text>
              </View>
              <View style={{justifyContent:"center",height: 18, borderColor: "#faa531", borderWidth: 1, borderRadius: 9}}>
                <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.month_str}</Text>
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
            <TouchableWithoutFeedback onPress={this._back}>
              <Image source={require("image!Profile2_but_Back_white")} />
            </TouchableWithoutFeedback>
            <Text style={styles.headerText}>话题</Text>
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            automaticallyAdjustContentInsets={false}
            onEndReached={()=>console.log("end")}
          />
        </View>
      );
    },
});

var styles = StyleSheet.create({
  thumbnail: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: 14,
  },
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
  headerText: {
    marginLeft: 125,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white'
  },
  commentStyle: {
    fontSize: 13,
    color: "#7e8e97",
    textAlign:"justify"
  }
});

module.exports = TopicsListPage;
