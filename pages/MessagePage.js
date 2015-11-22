'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var DivideBorder = require('../component/DivideBorder');
var Triangle = require('../component/Triangle');
var settings = require("../utils/settings");

var {
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  PixelRatio,
  Text,
  View,
  ListView,
  Image,
  TextInput,
  ActivityIndicatorIOS,
  TouchableHighlight,
  NavigatorIOS,
  ScrollView,
  AsyncStorage,
} = React;

var MessagePage = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function() {
    return {
      dataSource0: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      dataSource1: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      selected: 2,
    };
  },
  _fetch: function(selected){
    if (selected === 0){
      fetch(settings.serverAddress + '/api/core/activity/relative/')
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(res => {
            console.log(res);
            this.setState({
              dataSource0: this.state.dataSource.cloneWithRows(res)
            });
          }
        )
        .catch(e => console.log(e))
        .done();
    }
    else if (selected === 1){
      fetch(settings.serverAddress + '/api/message/notification/')
        .then(res => res.json())
        .then(res => {
            console.log(res);
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(res)
            });
          }
        )
        .catch(e => console.log(e))
        .done();
    }
    else{
      fetch(settings.serverAddress + '/api/message/inbox/')
        .then(res => res.json())
        .then(res => {
            this.setState({
              dataSource1: this.state.dataSource.cloneWithRows(res.messages)
            });
          }
        )
        .catch(e => console.log(e))
        .done();
    }
  },
  _viewMessageDetails: function(userId, userName){
    this.props.navigator.push({id: "messageDetails", passProps: {userId: userId, userName: userName}});
  },
  componentWillMount: function(){
    this._fetch(this.state.selected);
  },
  _genNickname: function(users){
    var usersJSX = [];
    var userLength = users.length;
    for (var i = 0; i < userLength; i++){
      usersJSX.push(
        (<Text style={styles.title}>{users[0].nickname}{i===userLength - 1? null: ","}</Text>)
      )
    }
    return usersJSX;
  },
  _renderRow: function(rowData){
    if (this.state.selected === 0){
      if (rowData.class === "like-discussion"){
        return (
          <View>
            <View style={styles.listItemHead}>
              <Image source={{uri: rowData.users[0].avatar}} style={styles.thumbnail}/>
              {this._genNickname(rowData.users)}
              <Text style={styles.actionStyle}>{rowData.action}</Text>
            </View>
            <View style={styles.listItemBody}>
              <Text style={styles.topicContent}>
                {rowData.discussion.content}
              </Text>
            </View>
            <DivideBorder />
          </View>
        );
      }
      else if (rowData.class === "like-topic"){
        return (
          <View>
            <View style={styles.listItemHead}>
              <Image source={{uri: rowData.users[0].avatar}} style={styles.thumbnail}/>
              {this._genNickname(rowData.users)}
              <Text style={styles.actionStyle}>{rowData.action}</Text>
            </View>
            <View style={styles.listItemBody}>
              <Text style={styles.topicTitle}>
                {rowData.topic.title}
              </Text>
            </View>
            <DivideBorder />
          </View>
        );
      }
      else if(rowData.class === "discussion"){
        return (
          <View>
            <View style={styles.listItemHead}>
              <Image source={{uri: rowData.user.avatar}} style={styles.thumbnail}/>
              <Text style={styles.title}>{rowData.user.nickname}</Text>
              <Text style={styles.actionStyle}>{rowData.action}</Text>
            </View>
            <View style={styles.listItemBody}>
              <Text style={styles.topicTitle}>
                {rowData.discussion.topic.title}
              </Text>
            </View>
            <DivideBorder />
          </View>
        );
      }
      else if (rowData.class === "comment"){
        return (
          <View>
            <View style={styles.listItemHead}>
              <Image source={{uri: rowData.user.avatar}} style={styles.thumbnail}/>
              <Text style={styles.title}>{rowData.user.nickname}</Text>
              <Text style={styles.actionStyle}>{rowData.action}</Text>
            </View>
            <View style={styles.listItemBody}>
              <Text style={styles.topicContent}>
                {rowData.comment.content}
              </Text>
            </View>
            <DivideBorder />
          </View>
        );
      }
      else{
        return null;
      }
    }
    else if (this.state.selected === 1){
      return (
        <View style={styles.itemContainer}>
          <View style={styles.topContainer}>
            <Image
              source={rowData.avater ? {uri: rowData.avater}: require("image!avatar")}
              style={styles.thumbnail}
            />
            <Text style={styles.adminTitle}>官方消息</Text>
            <View style={styles.rightContainer}>
              <Text style={styles.time}>{rowData.timesince}</Text>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={[styles.content, {marginRight: 10}]}>{rowData.body}</Text>
          </View>
        </View>
      )
    }
    else{
      console.log(rowData);
      return (
        <TouchableHighlight onPress={(e) => this._viewMessageDetails(rowData.user.userid, rowData.user.nickname)}>
          <View style={styles.itemContainer}>
            <View style={styles.topContainer}>
              <Image
                source={rowData.user.avatar ? {uri: rowData.user.avatar}: require("image!avatar")}
                style={styles.thumbnail}
              />
              <Text style={styles.title}>{rowData.user.nickname}</Text>
              <View style={styles.rightContainer}>
                <Text style={styles.time}>{rowData.timesince}</Text>
              </View>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.content}>{rowData.body}</Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    }
  },
  _onTextPressed: function(selected){
    console.log(selected);
    this.setState({
      selected: selected
    });
  },
  _onPress: function(selected){
    this.setState({
      selected: selected
    });
    console.log(this.state.selected);
    this._fetch(selected);
  },
  render: function(){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flex: 1}}>
          </View>
            <Text style={styles.headerText}>消息</Text>
          <View style={{flex: 1}}>
          </View>
        </View>
        <View style={{flexDirection: "row", backgroundColor: "#f8f8f6",height: 34}}>
          <View style={{height: 34, flex: 1, alignItems:"center"}}>
          {
            this.state.selected === 0?
            <Triangle
              width={10}
              height={5}
              color={'#48b8a7'}
              direction={'down'}
            />
            :<View style={{height: 5}} />
          }
            <Text style={this.state.selected == 0 ? styles.textSelectedStyle : styles.textNormalStyle} onPress={(e) => this._onPress(0)}>话题</Text>
          </View>
          <View style={{height: 34, flex: 1, alignItems:"center"}}>
          {
            this.state.selected === 1?
            <Triangle
              width={10}
              height={5}
              color={'#48b8a7'}
              direction={'down'}
            />
            :<View style={{height: 5}} />
          }
            <Text style={this.state.selected == 1 ? styles.textSelectedStyle : styles.textNormalStyle} onPress={(e) => this._onPress(1)}>官方</Text>
          </View>
          <View style={{height: 34, flex: 1, alignItems:"center"}}>
            {
              this.state.selected === 2?
              <Triangle
                width={10}
                height={5}
                color={'#48b8a7'}
                direction={'down'}
              />
              :<View style={{height: 5}} />
            }
            <Text style={this.state.selected == 2 ? styles.textSelectedStyle : styles.textNormalStyle} onPress={(e) => this._onPress(2)}>私信</Text>
          </View>
        </View>
        <View style={styles.line}></View>
        {
          this.state.selected === 0?
            <ListView
              dataSource={this.state.dataSource0}
              renderRow={this._renderRow}
              automaticallyAdjustContentInsets={false}
              renderFooter={() => (<View style={{height: 48}} />)}
            />:
            (this.state.selected === 1?
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                automaticallyAdjustContentInsets={false}
                renderFooter={() => (<View style={{height: 48}} />)}
              >
              </ListView>:
              <ListView
                dataSource={this.state.dataSource1}
                renderRow={this._renderRow}
                automaticallyAdjustContentInsets={false}
                renderFooter={() => (<View style={{height: 48}} />)}
              >
              </ListView>
            )
        }

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
      paddingTop: 15
  },
  headerText: {
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    flex: 1
  },
  container: {
    flex: 1,
    borderWidth: 1 / PixelRatio.get(),
    backgroundColor: '#fcfcf5',
    borderBottomColor: '#c5b7ad',
    borderTopColor: '#F5FCFF',
    borderLeftColor: '#F5FCFF',
    borderRightColor: '#F5FCFF',
  },
  itemContainer: {
    paddingTop: 12,
    flex: 1,
    borderWidth: 1 / PixelRatio.get(),
    backgroundColor: '#fcfcf5',
    borderBottomColor: '#c5b7ad',
    borderTopColor: '#F5FCFF',
    borderLeftColor: '#F5FCFF',
    borderRightColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
    justifyContent: "flex-end"
  },

  topContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center"
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#48b8a7",
    marginLeft: 8
  },
  adminTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#d74948",
    marginLeft: 8
  },
  time: {
    color: "#ac9ea0",
    fontSize: 11,
    textAlign: "right",
    marginRight: 14
  },
  thumbnail: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: 12,
  },
  listView: {
    backgroundColor: '#F5FCFF',
  },
  textNormalStyle:{
    textAlign: "center",
    lineHeight: 22,
    fontSize: 15,
    color: "#bab9a8"
  },
  content: {
    fontSize: 14,
    color: "#223e4d",
    marginLeft: 48,
    marginRight: 14,
    marginTop: 3,
    paddingBottom: 16,
  },
  line:{
    height: 1 / PixelRatio.get(),
    backgroundColor: "#eeede9"
  },
  textSelectedStyle:{
    textAlign: "center",
    lineHeight: 22,
    fontSize: 15,
    color: "#48b8a7",
    fontWeight: "bold"
  },
  listItemHead: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5
  },
  actionStyle: {
    fontSize: 12,
    marginLeft: 5,
    color: "#b9b9af"
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#223e4d",
    marginLeft: 46,
    marginRight: 14

  },
  topicContent: {
    fontSize: 15,
    color: "#767571",
    marginLeft: 46,
    marginRight: 14
  },
  listItemBody: {
    paddingBottom: 10
  }
});

module.exports = MessagePage;
