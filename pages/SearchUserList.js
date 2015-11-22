'use strict';

var React = require('react-native');
var UserItem = require("../component/UserItem");
var utilsMixin = require('../utils/utilsMixin');
var DivideBorder = require("../component/DivideBorder");
var FocusButton = require("../component/FocusButton");
var settings = require("../utils/settings");

var {
   Text,
   Image,
   View,
   StyleSheet,
   ListView
 } = React;

var SearchUserList = React.createClass({
  mixins: [utilsMixin],

  componentWillReceiveProps: function(){
      this._fetch();
  },
  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
    }
  },
  componentWillMount: function(){
    console.log(this.props.username);
    this._fetch();
  },
  _fetch: function(){
    console.log(this);
    console.log(this.props.username);
    fetch(settings.serverAddress + "/api/core/users/?search=" + this.props.username).
    then(res => {
      return res.json();
    }).
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
    return(
      <View style={{marginTop: 14,marginLeft: 14}}>
        <View style={{flexDirection: "row"}}>
          <UserItem
            radius={22}
            avatar={rowData.avatar}
            name={rowData.nickname}
            nameStyle={{marginLeft: 12}}
            onPress={(e) => this._goOtherPage(rowData.pk)}
          >
            {
              rowData.latest_page?
              <Text style={{fontSize: 12, color: "#bbb4b5", marginLeft: 12, marginTop: 12}}>发布了 <Text style={{fontSize: 12, fontWeight: "bold", color: "#384543"}}>{rowData.latest_page.substr(0,15)}</Text></Text>
              :<Text style={{fontSize: 12, color: "#bbb4b5", marginLeft: 12, marginTop: 12}}>暂无新内容</Text>
            }
          </UserItem>
          <View style={{flexDirection: "row", justifyContent: "flex-end", flex: 1}}>
            <FocusButton userid={rowData.pk} type="1" relation={rowData.relation} style={{marginRight: 14}}/>
          </View>
        </View>
        <View style={{height: 14}} />
        <DivideBorder />
      </View>
    );
  },
  render: function(){
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        automaticallyAdjustContentInsets={false}
      />
    );
  },
});

module.exports = SearchUserList;
