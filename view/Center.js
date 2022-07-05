import React from 'react';
import { DeviceEventEmitter,TouchableOpacity, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Provider, InputItem, List, Toast,Icon } from '@ant-design/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class CenterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"",
      position:"",
      email:'',
    };
  }

  componentDidMount() {
    let that=this;

      // 缓存的 登录数据
      AsyncStorage.getItem("token_config").then((option)=>{
        if(option){
          try{
            let loginConfig=JSON.parse(option);

            // console.log(loginConfig);

            that.setState({
              name:loginConfig.user["name"],
              position:loginConfig.user["phone"],
              email:loginConfig.user["email"],
            });

          } catch (error) {
          }          
        }
      });    

  }

  componentWillUnmount(){

  }

  render() {
    const {onClose,navigation} = this.props;
    let {name,position,email}=this.state;

    return (
      <View style={styles.container}>
          <View style={styles.headContainer}>
            <View style={styles.imgBox}>
              <Image
                style={styles.img}
                source={require('./img/logo.png')}
              />   
            </View>
            <View style={styles.textBox}>
              <View style={{...styles.textDIV,marginBottom:8,paddingTop:26}}>
                <Text style={{fontSize:16,color:"#fff"}}>{name}</Text> 
              </View>   
              <View style={styles.textDIV}>
                <Text style={{fontSize:16,color:"#fff"}}>{position}</Text> 
              </View>   
              <View style={styles.textDIV}>
                <Text style={{fontSize:16,color:"#fff"}}>{email}</Text> 
              </View>   
            </View>
          </View>

          <View style={{paddingTop:12}}>
            <TouchableOpacity onPress={()=>{
              navigation.navigate("password");
            }}>
              <View style={styles.footerBtn}>
                <Text style={styles.btnFont}>重置密码</Text>
                <Icon style={styles.btnIcon} name="right" size="sm" />
              </View>
            </TouchableOpacity>        
          </View>


          <View style={{paddingTop:12}}>
            <TouchableOpacity onPress={()=>{
              // 退出登录
              DeviceEventEmitter.emit('globalEmitter_logOut');
              // DeviceEventEmitter.emit('globalEmitter_logOut',()=> onClose());
            }}>
              <View style={styles.footerBtn}>
                <Text style={styles.btnFont}>退出登录</Text>
                <Icon style={styles.btnIcon} name="right" size="sm" />
              </View>
            </TouchableOpacity>        
          </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff"
  },
  headContainer:{
    flexDirection:'column',
    // justifyContent:'center',
    backgroundColor:"#1890ff",    
    height:350,
    paddingTop:39  
  },
  imgBox:{
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:50,
  },
  textBox:{
    flexDirection:'column',
    // paddingBottom:150
    // justifyContent:'center',    
  },
  textDIV:{
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:3,
    paddingBottom:3,
    fontSize:12
  },
  img:{
    width:120,
    height:120,
    borderRadius:60
  },
  footerBtn:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:12,
    borderBottomWidth:1,
    borderBottomColor:"#e9e9e9"
    // backgroundColor:"red"
  },
  btnFont:{
    fontSize:18,
    color:'#000000d9'
  },
  btnIcon:{
    paddingRight:12,
    color:"#404040"
  }
});


export default CenterPage;