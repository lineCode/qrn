'use strict';

var React = require('react-native');

var {
   Text,
   Image,
   View,
   StyleSheet,
 } = React;

var Address = React.createClass({
  render: function(){
    return (
      <View style={styles.locationInfo}>
        <Image
          style={styles.locationImg}
          source={require("image!Profile2_ic_Map-Pin")} />
        <Text style={styles.locationTxt}>{this.props.address}</Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  locationInfo:{
    flexDirection: 'row',
  },
  locationImg: {
    width: 12,
    height: 12,
    marginRight: 5
  },
  locationTxt: {
    fontSize: 12,
    color: '#bab9a8'
  },
});

module.exports = Address;
