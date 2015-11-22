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
  PixelRatio,
  NavigatorIOS,
} = React;


var DiscsListPage = React.createClass({
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
      // this.setState({
      //   dataSource: this.state.dataSource.cloneWithRows(data)
      // });
    },
    componentWillMount: function(){
      this._fetch();
    },
    _renderRow: function(rowData){
      return (
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <View style={styles.rightHead}>
              <Image source={{uri: rowData.user.avatar}} style={styles.avatar} />
              <Text style={styles.userName} onPress={(e) => this._goOtherPage(rowData.user.userid)}>{rowData.user.nickname}</Text>
              <Text style={styles.action}>评论了</Text>
              <View style={{justifyContent: "flex-end", flex: 1, flexDirection: "row"}}>
                <View style={{justifyContent: "center", height: 18,marginRight: 6, borderColor: "#faa531", borderWidth: 1, borderRadius: 9}}>
                  <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.topic.tags.join("-")}</Text>
                </View>
                <View style={{justifyContent:"center",height: 18, borderColor: "#faa531", borderWidth: 1, borderRadius: 9, marginRight: 14}}>
                  <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.topic.month_str}</Text>
                </View>
              </View>
            </View>
            <View style={styles.rightBody}>
              <Text style={styles.title} onPress={(e) => this._goTopic(rowData.topic.pk)}>{rowData.topic.title}</Text>
              <View style={styles.commentAbstract}>
                <Text style={styles.commentAbstractText}>{rowData.topic.content.substr(0, 80)}</Text>
                <View style={styles.rightFoot}>
                  <View style={{flexDirection: "row", alignItems: "center", marginLeft: 10}}>
                    <Image source={require("image!Public_ic_love")} />
                    <Text style={styles.commentStyle}> {rowData.like_count}</Text>
                  </View>
                  <View style={{flexDirection: "row", alignItems: "center", marginLeft: 20}}>
                    <Image source={require("image!Public_ic_comment")} />
                    <Text style={styles.commentStyle}> {rowData.comment_count}</Text>
                  </View>
                  <View style={{justifyContent: "flex-end", flex: 1}}>
                    <Text style={styles.time}>{rowData.timesince}</Text>
                  </View>
                </View>
              </View>
            </View>



            <View style={styles.line} />
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
            <Text style={styles.headerText}>评论</Text>
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
  mainContainer: {
    flex: 1,
    backgroundColor: "#fcfcf5"
  },
  rightHead:{
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  commentAbstract: {
    borderWidth: 1,
    borderColor: "#e9e8e2",
    backgroundColor: "#f4f3ed",
    marginRight: 14,
    marginTop: 10,
  },
  commentAbstractText: {
    color: "#89cbbd",
    padding: 10,
    marginBottom: 5
  },
  abstract: {
    marginRight: 14,
    marginTop: 10,
    flexDirection: "row"
  },
  userName: {
    color: "#48b8a7",
    fontSize: 14,
    fontWeight: "bold",

    marginLeft: 14,
  },
  action: {
    color: "#bab9a8",
    fontSize: 12,
    marginLeft: 8
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17
  },
  time: {
    color: "#bab9a8",
    fontSize: 12,
    textAlign: "right",
    marginRight: 14
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#223e4d",
    marginTop: 12,
    paddingRight: 10
  },
  container: {
    flexDirection: "row",
    flex: 1,
    marginLeft: 14
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
  rightFoot:{
    marginBottom: 15,
    flexDirection: "row"
  },
  line: {
    height: 1 / PixelRatio.get(),
    backgroundColor: "#eeede9"
  },
  commentStyle: {
    fontSize: 13,
    color: "#7e8e97",
    textAlign:"justify"
  },
});

module.exports = DiscsListPage;
