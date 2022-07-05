import React, { PureComponent } from 'react';
import { Image, Animated, Modal, AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Toast, Icon } from '@ant-design/react-native';
import { RNCamera } from 'react-native-camera';
import {WisCameraComponent} from '@wis_component/ul';


class CameraComponent extends PureComponent {

  constructor(props) {
    super(props);

    this.state={
      visible: true,                        // 显示
      moveAnim: new Animated.Value(0),      // 扫码 动画
      torchToggle: false,   // 切换 手电筒

    };
  }

  componentWillMount(){
    this.fadeIn();
  }

  circulationHandle(){
    this.fadeIn();
  }

  fadeIn(){
    Animated.timing(this.state.moveAnim, {
      toValue: 280,
      duration: 2000,
      useNativeDriver: true, 
    }).start((active)=>{
      if(active){
        this.setState({
          moveAnim: new Animated.Value(0)
        },()=>{
          this.circulationHandle();
        })
      }
    });
  };


  /**
   * 关闭
   */
  closeHandle(){
    let {onClose}=this.props;
    if(onClose) onClose(); 
  }


  /**
   * 扫描 二维码
   */
  onBarCodeRead(option){
    let {onRead}=this.props;

    let config={
      type:option["type"],
      data:option["data"],
      rawData:option["rawData"],
    };

    if( config["type"] && config["data"] ){
      if(onRead){
        this.props.onRead(config);
      }
    }
 
  }

  /**
   * 切换 手电筒
  */
 torchToggleFunc(action){

    this.setState({
      torchToggle:!action
    });
 }


  render() {
    let{visible,moveAnim,torchToggle}=this.state;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
 
      >

        <View >
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={{height:"100%"}}
              flashMode={torchToggle?RNCamera.Constants.FlashMode.torch:RNCamera.Constants.FlashMode.on}   // 闪关灯 torch / on
              autoFocus={RNCamera.Constants.AutoFocus.on}
              onBarCodeRead={(option)=> this.onBarCodeRead(option)}
              onMountError={()=>{
                Toast.fail('相机初始化错误!');
              }}
            >

                <View style={styles.container}>
                  <View style={styles.containerHead}>
                    <TouchableOpacity 
                      onPress={()=> this.closeHandle() }
                    >
                        <Icon style={{fontSize:32}} name="close-circle" size="md" color="#fff" />
                    </TouchableOpacity>
                  </View>


                    <Animated.View
                        style={{...styles.AnimatedBox,translateY: this.state.moveAnim}}
                      >
                        <View style={styles.lineBox}>
                          <Image style={{width:"100%"}} source={require('./line2.png')} />
                        </View> 
                    </Animated.View>
                 
                  <View style={styles.containerFooter}>

                    <TouchableOpacity onPress={() => this.torchToggleFunc(torchToggle) }>
                      <View style={{flexDirection:'row',justifyContent:'center',paddingBottom:10}}>
                        { torchToggle ?
                          <Icon name="alert" size="lg"/>
                          :
                          <Icon name="bulb" size="lg"/>                         
                        }
                      </View> 
                      <View style={{flexDirection:'row',justifyContent:'center',paddingBottom:26}}>
                        <Text style={{color:"#fff"}}>闪关灯-</Text>
                        <Text style={{color:"#fff"}}>{torchToggle?"开":"关"}</Text>
                      </View>  
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row',justifyContent: 'center',}}>
                      <Text style={{color:"#fff"}}>扫二维码/条码</Text>
                    </View>
                  </View>                  
                </View>

            </RNCamera>
        </View>
    </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerHead:{
    paddingTop:16,
    paddingLeft:16,
    // backgroundColor:"blue",
    height:100
  },
  AnimatedBox:{
    height:300,
    // backgroundColor:"yellow",
    paddingLeft:20,
    paddingRight:20,
  },
  lineBox:{
    height:50,
    // backgroundColor:"red",

  },
  containerFooter:{
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'center',
    paddingBottom:38,
    fontSize:12,
    
  },
});


export default CameraComponent;
