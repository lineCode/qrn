'use strict';

var React = require('react-native');
// var UserPageContent = require('./component/UserPageContent');
var UtilsFunctions = require('../utils/functions');
var utilsMixin = require('../utils/utilsMixin');
var settings = require("../utils/settings");
var FocusButton = require("../component/FocusButton");

var {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TextInput,
  ActivityIndicatorIOS,
  TouchableWithoutFeedback,
  TouchableHighlight,
  NavigatorIOS,
  InteractionManager,
} = React;

var UserList = React.createClass({
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
        console.log(res);
        return res.json();
      })
      .then(resJson => {
        // resJson = [1,2,3,4];
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(resJson)
        });
        console.log(resJson);
      })
      .catch(e => console.log(e))
      .done();
    },
    componentDidMount: function(){
      InteractionManager.runAfterInteractions(() => {
        console.log(/gogogog/);
        this._fetch();
      });
    },
    _renderRow: function(rowData){
      var relationship;
      if(rowData.relation === 0 ){
        relationship = (<Image source={require("image!User_infolist_fans_but_NoAttention")} />);
      }else if(rowData.relation === 2){
        relationship = (<Image source={require("image!User_infolist_fans_but_Attention")} />);
      }else if(rowData.relation === 3){
        relationship = (<Image source={require("image!User_infolist_fans_but_NoAttention")} />);
      }else if(rowData.relation === 4){
        relationship = (<Image source={require("image!User_infolist_fans_but_Each-other")} />);
      }
      else{
        relationship = (<Text></Text>);
      }
      return (
        <View>
          <TouchableHighlight onPress={this._goOtherPage.bind(this, rowData.pk)} underlayColor="#ccc">
            <View style={styles.container}>
              <Image source={rowData.avatar?{uri: rowData.avatar} :require("image!avatar")} style={styles.thumbnail}/>
              <View style={{marginLeft: 12}}>
                <Text style={{fontSize: 14, color: "#48b8a7"}}>{rowData.nickname}</Text>
                <View style={{flexDirection: "row", justifyContent: "center", marginTop: 13}}>
                  <Image source={require("image!Profile2_ic_Map-Pin")} />
                  <Text style={{fontSize: 11, color: "#aca1a2"}}>{rowData.address ? rowData.address : "未知"}</Text>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          <View style={styles.rightContainer}>
            <FocusButton userid={rowData.userid} type="1" relation={rowData.relation} style={{marginRight: 14}}/>
          </View>
          <View style={ styles.cellBorder } />
        </View>
      )
    },
    _focus: function(userid){
      fetch(settings.serverAddress + "/api/core/follow/" + userid + "/", {method: "PUT"})
      .then((res) => res.json())
      .then((resJson) => {
        console.log(resJson);
        this._fetch();
      })
      .catch(e => {console.log(e);})
      .done();
    },
    render: function(){
      return (
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <TouchableWithoutFeedback onPress={this._back}>
              <Image source={require("image!Profile2_but_Back_white")} />
            </TouchableWithoutFeedback>
            <Text style={styles.headerText}>{this.props.title}</Text>
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
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 14
  },
  navWrap: {
     flex: 1,
     marginTop: 70
   },
   nav: {
     flex: 1,
   },
   mainContainer:{
     flex: 1,
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
   rightContainer: {
     position: 'absolute',
     right: 0,
     top: 17,
     justifyContent: 'center',
    },
   otherContainer: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
   }
});

module.exports = UserList;
