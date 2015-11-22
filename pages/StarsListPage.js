'use strict';

var React = require('react-native');
var UtilsFunctions = require('../utils/functions');
var utilsMixin = require('../utils/utilsMixin');
var DivideBorder = require("../component/DivideBorder");
var settings = require("../utils/settings");

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

var SwitchBtn = React.createClass({
  getInitialState: function(){
    return {
      checked: true,
    };
  },
  _onPress: function(){
    if(this.state.checked === true){
      fetch(this.props.delete_url,{method: "DELETE"})
      .then(res => {
        return res.json();
      })
      .then(resJson => {
        console.log(resJson);
        if (resJson.succ === true){
          this.setState({checked: false});
        }
      })
      .catch(e => console.log(e))
      .done();
    }else{
      fetch(this.props.star_url, {method: "POST", body:
        UtilsFunctions.object2form({
          'follow_key': this.props.pk,
        })
      })
      .then((res) => {
        return res.json();
      })
      .then((resJson) => {
        console.log(resJson);
        if(resJson.pk){
          // this._fetch();
          this.setState({checked: true});
        }
      })
      .catch(e => {console.log(e);})
      .done();
    }
  },
  render: function(){
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Image source={this.state.checked?
          require("image!User_infolist_but_Collection"):
          require("image!User_infolist_but_Cancel-Collection")
        }/>
      </TouchableOpacity>
    );
  },
});

var StarsListPage = React.createClass({
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
    _unStar: function(pk){
      fetch(settings.serverAddress + "/api/core/discussion/" + pk + "/unlike/",{method: "DELETE"})
      .then(res => {
        return res.json();
      })
      .then(resJson => {
        console.log(resJson);
      })
      .catch(e => console.log(e))
      .done();
    },
    componentWillMount: function(){
      this._fetch();
    },
    _renderRow: function(rowData){
      return (
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <View style={styles.rightHead}>
              <View style={{justifyContent: "center", height: 18,marginRight: 6, borderColor: "#faa531", borderWidth: 1, borderRadius: 9}}>
                <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.topic.tags.join("-")}</Text>
              </View>
              <View style={{justifyContent:"center",height: 18, borderColor: "#faa531", borderWidth: 1, borderRadius: 9, marginRight: 14}}>
                <Text style={{color: "#faa531", fontSize: 9, marginLeft: 8, marginRight: 8}}>{rowData.topic.month_str}</Text>
              </View>

              <View style={{flex: 1,flexDirection: "row", justifyContent: "flex-end"}}>
              {
                // <TouchableOpacity onPress={() => this._unStar(rowData.pk)}>
                //   <Image source={require("image!User_infolist_but_Collection")}/>
                // </TouchableOpacity>
              }
              {
                rowData.is_topic?
                <SwitchBtn delete_url={settings.serverAddress + "/api/core/topic/" + rowData.topic.pk + "/unstar/"}
                           star_url={settings.serverAddress + "/api/core/topic/staring/"}
                           pk={rowData.topic.pk}/>
                :
                <SwitchBtn delete_url={settings.serverAddress + "/api/core/discussion/" + rowData.discussion.pk + "/unstar/"}
                           star_url={settings.serverAddress + "/api/core/discussion/staring/"}
                           pk={rowData.discussion.pk}/>
              }
              </View>
            </View>

            <View style={styles.rightBody}>
              {rowData.is_topic?
                <Text style={styles.title} onPress={(e) => this._goTopic(rowData.topic.pk)}>{rowData.topic.title}</Text>
                :
                <Text style={styles.body} onPress={(e) => this._goDiscussion(rowData.discussion.pk)}>{rowData.discussion.content.substr(0, 70)}</Text>
              }
              <View style={styles.rightFoot}>
                <Text style={{fontSize: 10, fontWeight: "bold", color: "#48b8a7"}}>{rowData.is_topic ? "话题" : "评论"}</Text>
                <View style={{justifyContent: "flex-end", flex: 1}}>
                  <Text style={styles.time}>收藏时间 {rowData.create_time}</Text>
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
            <Text style={styles.headerText}>收藏</Text>
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
    padding: 10
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
    fontSize: 10,
    textAlign: "right",
    marginRight: 14
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#223e4d",
  },
  body: {
    fontSize: 15,
    color: "#223e4d"
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
    marginTop: 14,
    marginBottom: 14,
    flexDirection: "row"
  },
  line: {
    height: 1 / PixelRatio.get(),
    backgroundColor: "#eeede9"
  },
});

module.exports = StarsListPage;
