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
  TouchableHighlight,
  NavigatorIOS,
} = React;

var LikersListPage = React.createClass({
    mixins: [utilsMixin],
    getInitialState: function(){
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
        dataSource: ds.cloneWithRows([]),
      }
    },
    _fetch: function(){
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
    _goReply: function(id){
      this.props.navigator.push({id: "replys", replyId: id});
    },
    _renderRow: function(rowData){
      return (
        <View>
          <View style={styles.listItemHead}>
            <Image source={{uri: rowData.user.avatar}} style={[styles.thumbnail, {marginLeft: 14}]} />
            <TouchableOpacity onPress={() => this._goOtherPage(rowData.user.userid)}>
              <Text style={[styles.nicknameFontStyle, {marginLeft: 8}]}>{rowData.user.nickname}</Text>
            </TouchableOpacity>
            {
              this.props.isOther?
              <Text style={[styles.describeFontStyle, {marginLeft: 8}]}>{rowData.is_topic ? "赞了TA的主题" : "赞了TA的评论"}</Text>
              :
              <Text style={[styles.describeFontStyle, {marginLeft: 8}]}>{rowData.is_topic ? "赞了你的主题" : "赞了你的评论"}</Text>
            }

          </View>
          <View style={styles.listItemBody}>
            {rowData.is_topic?
              <TouchableHighlight underlayColor="#ccc" onPress={() => this._goTopic(rowData.topic.pk)}>
                <Text style={[styles.topicTitleStyle, styles.ctlWhite]}>{rowData.topic.title}</Text>
              </TouchableHighlight>
            :
              <TouchableHighlight underlayColor="#ccc" onPress={() => this._goDiscussion()}>
                <Text style={[styles.discsStyle, styles.ctlWhite]}>{rowData.discussion.content}
              </Text></TouchableHighlight>
            }
          </View>
          <DivideBorder />
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
            <Text style={styles.headerText}>获赞</Text>
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
  thumbnail: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: 14
  },
  listItemHead:{
    flexDirection: "row",
    marginTop: 13,
    alignItems: "center"
  },
  nicknameFontStyle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#48b8a7"
  },
  describeFontStyle: {
    fontSize: 11,
    color: "#ac9ea0"
  },
  topicTitleStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#223e4d"
  },
  discsStyle: {
    fontSize: 13,
    color: "#384532"
  },
  ctlWhite: {
    marginTop: 20,
    marginLeft: 48,
    marginRight: 14,
    marginBottom: 20
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

   mainContainer:{
     flex: 1,
     backgroundColor: "#fcfcf5"
   },
});

module.exports = LikersListPage;
