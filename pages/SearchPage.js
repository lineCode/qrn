'use strict';

var React = require('react-native');
var Triangle = require('../component/Triangle');
var SearchTopic = require('./SearchTopic');
var SearchAge = require('./SearchAge');
var SearchUserList = require('./SearchUserList');

var {
	StyleSheet,
	View,
	Text,
	Image,
	TextInput,
	StatusBarIOS,
	ScrollView,
	PixelRatio,
	TouchableOpacity
} = React;

var SearchPage = React.createClass({
	getInitialState: function(){
		return {
			selected: 1,
			input: "",
			realInput: ""
		}
	},
	_onPress: function(selected){
		this.setState({
			selected: selected
		});
	},
	_renderSearch: function(selected){
		switch(selected){
			case 0:
				return (<SearchUserList username={this.state.input} navigator={this.props.navigator} />);
				break;
			case 1:
				return (<SearchTopic navigator={this.props.navigator} />);
				break;
			case 2:
				return (<SearchAge navigator={this.props.navigator} />);
				break;
		}
	},
	_searchTopic: function(){
		console.log(/haha/);
		if (this.state.selected !== 0){
			this.props.navigator.push({id: "searchTopicList", keyWord: this.state.realInput});
		}else{
			this.setState({input: this.state.realInput});
		}
	},
	_back: function(){
		this.props.navigator.pop();
	},
	render: function(){
		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.searchContainer}>
						<Image
							style={styles.searchIcon}
							source={require('image!Find_ic_search_default')} />
						<TextInput
							onEndEditing={(e) => {this._searchTopic()}}
						  returnKeyType="search"
						  onChangeText={(text) => {this.setState({realInput: text})}}
							placeholder="搜：辅食"
							placeholderTextColor="rgba(255, 255, 255, 0.5)"
							style={styles.searchTxt}
							clearButtonMode="always" />
					</View>
					<TouchableOpacity style={styles.cancel} onPress={this._back}>
						<Text style={styles.cancelTxt}>取消</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.searchNav}>
					<TouchableOpacity style={styles.navItem} onPress={(e) => this._onPress(0)}>
						{
							this.state.selected === 0 ?
							<Triangle
								width={10}
								height={5}
								color={'#48b8a7'}
								direction={'down'} /> :
							<View style={styles.fill} />
						}
						<Text style={this.state.selected == 0 ? styles.navTxtOn : styles.navTxtOff}>萌友</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.navItem} onPress={(e) => this._onPress(1)}>
						{
							this.state.selected === 1 ?
							<Triangle
								width={10}
								height={5}
								color={'#48b8a7'}
								direction={'down'} /> :
							<View style={styles.fill} />
						}
						<Text style={this.state.selected == 1 ? styles.navTxtOn : styles.navTxtOff}>话题</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.navItem} onPress={(e) => this._onPress(2)}>
						{
							this.state.selected === 2 ?
							<Triangle
								width={10}
								height={5}
								color={'#48b8a7'}
								direction={'down'} /> :
							<View style={styles.fill} />
						}
						<Text style={this.state.selected == 2 ? styles.navTxtOn : styles.navTxtOff}>月龄</Text>
					</TouchableOpacity>
				</View>
				{
					this._renderSearch(this.state.selected)
				}
			</View>
		);
	}
});

var styles = StyleSheet.create({
	container: {
		backgroundColor: '#fcfcf5',
		flex: 1
	},
	//顶部搜索栏
	header: {
		height: 65,
		backgroundColor: '#48b8a7',
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 14
	},
	searchContainer: {
		backgroundColor: '#41a596',
		height: 30,
		borderRadius: 15,
		marginLeft: 12,
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 2,
		flex: 1
	},
	searchIcon: {
		width: 14,
		height: 14,
		marginLeft: 14,
		marginRight: 8
	},
	searchTxt: {
		height: 15,
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.8)',
		flex: 1,
		marginTop: 7,
	},
	cancel: {
		width: 54,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center'
	},
	cancelTxt: {
		fontSize: 14,
		color: '#fff'
	},
	//搜索导航条
	searchNav: {
		backgroundColor: '#fcfcf5',
		flexDirection: 'row',
		height: 35,
		borderBottomWidth: 1/PixelRatio.get(),
		borderBottomColor: '#e6e0d8'
	},
	navItem: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center'
	},
	fill: {
		height: 5
	},
	navTxtOn: {
		fontSize: 15,
		color: '#41a596',
		fontWeight: 'bold',
		lineHeight: 20
	},
	navTxtOff: {
		fontSize: 15,
		color: '#bab9a8',
		lineHeight: 20
	}
});

module.exports = SearchPage;
