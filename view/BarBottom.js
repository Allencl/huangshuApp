import React from 'react';
import { DeviceEventEmitter,TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Provider, InputItem, List, Toast,Icon } from '@ant-design/react-native';
import {WisCameraComponent} from '@wis_component/ul';


class BarBottomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,  // 显示扫码
      
    };
  }

  /**
   * 全局的 扫描
   */
  globalScan(){
    this.setState({
      visible:true
    });
  }

  // 关闭 扫码
  closeCamera(){
    this.setState({
        visible:false
    });       
  }  

    // 扫码 完成
    onRead(option){
    
      // option 是拿到的 数据

      this.setState({
          visible:false
      });   
    }


  render() {
    const {TabProps} = this.props;
    const{visible}=this.state;


    return (
      <View>
        { visible ?
            <WisCameraComponent 
                onClose={()=> this.closeCamera() }
                onRead={(option)=> this.onRead(option) }
            />
            :
            <View></View>
        } 

        <View style={styles.container}>
            {/* <TouchableOpacity onPress={() => this.globalScan() }>
                <View style={styles.menu_child}>
                    <Icon style={styles.menu_child_icon} name="scan" size="lg" color="#ff9933" />
                </View>    
            </TouchableOpacity> */}




            <TouchableOpacity 
              onPress={() =>{
                TabProps.navigation.goBack();
              }}
            >
              <View style={styles.menu_child}>
                <Icon style={styles.menu_child_icon} name="arrow-left" size="lg" color="#1890ff" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() =>{
                TabProps.navigation.navigate('Home');
                DeviceEventEmitter.emit('globalEmitter_updata_home');
            }}>
                <View style={styles.menu_child}>
                    <Icon style={styles.menu_child_icon} name="home" size="lg" color="#1890ff" />
                </View>    
            </TouchableOpacity>
            <View style={styles.menu_child}>

            </View>




        </View>
      </View>

    );
  }
}


const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:"white",
    paddingLeft:12,
    paddingRight:12
  },
  menu_child: {
    justifyContent: 'center',
    alignItems: 'center',
    width:50,
    height:50,   
  },
  menu_child_icon:{
      fontSize:26,
      // color:"#13c2c2"
  }, 
});


export default BarBottomPage;