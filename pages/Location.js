'use strict';

var React = require('react-native');
var NavHeader = require('../component/NavHeader');
var utilsMixin = require('../utils/utilsMixin');
var DivideBorder = require('../component/DivideBorder');

var {
   Text,
   Image,
   View,
   StyleSheet,
   ListView,
   TouchableHighlight,
   AlertIOS,
   AsyncStorage
 } = React;

var LocationData = [
  "欧洲",
  "非洲",
  {"中国": ["北京", "广东"]}
];

var Location = React.createClass({
  mixins: [utilsMixin],
  getInitialState: function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this.props.Locations === undefined ? LocationData : this.props.Locations),
    }
  },
  _goLocation: function(date){
    this.props.navigator.push({id: "location", Locations: date, setLocation: this.props.setLocation});
  },
  _renderRow: function(rowData){
    if(typeof rowData === "string"){
      return (
        <TouchableHighlight onPress={
          () => {
            AsyncStorage.setItem("address", rowData).done();
            this.props.navigator.push({id: "register01"});
          }
        } underlayColor="#ccc">
          <View>
            <View style={styles.item}>
              <Text style={styles.locationText}>{rowData}</Text>
            </View>
            <DivideBorder />
          </View>
        </TouchableHighlight>
      )
    }
    else{
      for (var k in rowData){
        var key = k;
      }
      return (
        <TouchableHighlight onPress={() => this._goLocation(rowData[k])} underlayColor="#ccc">
          <View>
            <View style={styles.item}>
              <Text style={styles.locationText}>{k}</Text>
              <View style={{justifyContent: "flex-end", flexDirection: "row", flex: 1}}>
                <Image source={require("image!location_more")} style={{height: 30, width: 30}}/>
              </View>
            </View>
            <DivideBorder />
          </View>
        </TouchableHighlight>
      )
    }
  },
  render: function(){
    return (
      <View style={{flex: 1}}>
      <NavHeader onPress={this._back} title="选择地区" />
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        automaticallyAdjustContentInsets={false}
      >
      </ListView>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  item: {
    height: 50,
    alignItems: "center",
    flexDirection: "row"
  },
  locationText: {
    marginLeft: 14,
    fontSize: 14,

  }
});

module.exports = Location;
