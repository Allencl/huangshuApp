import React from 'react';
import { BackHandler,PermissionsAndroid,NativeModules,DeviceEventEmitter,window,TouchableOpacity,Text,Image, View, StyleSheet } from 'react-native';
import { Icon,Button,Modal, Provider, InputItem, List, Toast } from '@ant-design/react-native';
import { createForm, formShape } from 'rc-form';
import RNFS from "react-native-fs";

import WISHttpUtils from '@wis_component/http';   // http 

import AsyncStorage from '@react-native-async-storage/async-storage';


class Page extends React.Component {

  constructor(props) {
    super(props);

    this.props.onRef && this.props.onRef(this);


    this.state = {
        visible:false,
        imageList:[],  // 图片
        lanyaConfig:{}  // lanya
    };
  }

  componentDidMount() {
    let that=this;
    const {onAccomplish,onBegin,showModel=true}=this.props;
    const {ToastExample}=NativeModules;


    // 蓝牙
    this.toCenterLanya =DeviceEventEmitter.addListener('globalEmitter_honeyWell_lanya',function(str){
      let _json=JSON.parse(str);
      let _status="";
      if(_json.result==3){
        if(showModel){
          that.setState({
            visible: true,
          }); 
        }
      }


      // 传输完成
      if(_json.result==1){
        setTimeout(()=>{
          that.setState({visible:false})
          onAccomplish && onAccomplish()
        },500)
      }


      // 开始传输
      if(_json.result==3){
        setTimeout(()=>{
          // that.setState({visible:false})
          onBegin && onBegin()
        },1000)
      }   


      switch (_json.result) {
        case 0:
          _status="传输中...";
          // ToastExample.show("传输中...");
          break;
        case 1:
          _status="成功！";
          // ToastExample.show("传输成功！");
          break;      
        case 2:
          _status="失败！";
          // ToastExample.show("传输失败！");
          break;     
        case 3:
          _status="开始传输";
          // ToastExample.show("开始传输！");
          break;                    
        default:
          break;
      }

      _json._status=_status;

      that.setState({
        lanyaConfig: _json,
      });


      // 删除图片
      if( (_json.result==1) || ((_json.result==2)) ){
        that.deleteImage();
      }
    });

  }

  componentWillUnmount() {
    this.toCenterLanya.remove();
  }  

  /**
   * delete image
   */
  deleteImage=async()=>{
    const that=this;
    // const {imageList=[]}=this.state;

    // if(!imageList.length) return;

    // for(var i=0;i<imageList.length;i++) {
    //     let _result=await that.deleteImageHanlde(imageList[i]);
    //     if(!_result){
    //         ToastExample.show("图片删除失败！");
    //     }        
    // }


    RNFS.readDir(RNFS.DownloadDirectoryPath) 
    .then(async (result=[]) => {
      let _imageBuffer=result;

      for(var i=0;i<_imageBuffer.length;i++) {
        if((_imageBuffer[i].name).includes("_bluetooth_")){
            let _result=await that.deleteImageHanlde(_imageBuffer[i].name );
            if(!_result){
              ToastExample.show("图片删除失败！");
            }  
        }
      }

    })


  }

  /**
   * 
   */
  deleteImageHanlde=async(name)=>{
    return new Promise((resolve)=>{
        RNFS.unlink(`${RNFS.DownloadDirectoryPath}/${name}`)
        .then(() => {
            resolve(true);
            console.log(`删除成功![${name}]`);
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
            resolve(false);
            console.log(`删除失败![${name}]`);
            console.log(err.message);
        });
    });      
  }

  /**
   * 蓝牙 传输
   */
   lanyaHandle= async (dress="",beseCode=[])=>{
        let that=this;
        const {ToastExample}=NativeModules;

        // 判断设备
        if( !(/^\d{2}:\d{2}:\d{2}:\d{2}$/.test(dress) ) ){
          Toast.fail('错误设备编号！');
          return
        }
       
        try {
            // 获取权限
            const granted1 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            const granted2 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS);
            const granted3 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            const granted4 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            const granted5 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            const granted6 = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);


            let _time=new Date().getTime();
            let _imageList=beseCode.map((o,i)=>Object({
                name:`_bluetooth_${_time}_${i+1}.png`,
                code:o
            }));


            this.setState({
                imageList:_imageList.map(o=>o.name)
            });
            

            // 图片缓存
            ToastExample.show("图片下载中...");
            for(var i=0;i<_imageList.length;i++) {
                let _result=await that.writeImage(_imageList[i]);
                if(!_result){
                    ToastExample.show("图片加载失败！");
                }
            }
    
    
            // 蓝牙传输
            let imageArray=_imageList.map(o=>`/storage/emulated/0/Download/${o.name}`);
            // let imageArray= ["bbb.png"].map(o=>`/storage/emulated/0/Download/${o}`);

            ToastExample.bluetooth(
              `FF:FF:${dress}`,
              JSON.stringify(imageArray)
            );


        } catch(err){
            console.warn(err);
        }

  }


  /**
   * write 蓝牙写入
   */
  writeImage= async(option)=>{
    return new Promise((resolve)=>{
        RNFS.writeFile(`${RNFS.DownloadDirectoryPath}/${option.name}`,option.code,'base64')
        .then((success) => {
            resolve(true);
            console.log(`写入成功![${option.name}]`);
        })
        .catch((err) => {
            resolve(false);
            console.log(`写入失败![${option.name}]`);
            console.log(err.message);
        }); 
    }); 
  }


  /**
   * 
   * @param
   */
   onClose = () => {
    this.setState({
        visible:false
    });
  }


  render() {

    const {navigation} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {visible,lanyaConfig}=this.state;
  
    return (
        <Modal
          title="蓝牙传输文件"
          transparent

          maskClosable
          visible={visible}
          

        >
          <View style={{ paddingVertical: 20 }}>
            <View style={{flexDirection:"row"}}>
              <Text style={{width:80,textAlign:'right',fontWeight:'600'}}>设备: </Text>
              <Text>{lanyaConfig.address}</Text>
            </View>
            <View style={{flexDirection:"row"}}>
              <Text style={{width:80,textAlign:'right',fontWeight:'600'}}>状态: </Text>
              <Text>{lanyaConfig._status}</Text>
            </View>
            {/* <Text>{lanyaConfig.id}</Text>
            <Text style={{ textAlign: 'center' }}>状态</Text>
            <Text style={{ textAlign: 'center' }}>Content...</Text> */}
          </View>

          <Button onPress={this.onClose}>
            关闭
          </Button>

        </Modal>
    );
  }
}



const styles = StyleSheet.create({


});


export default createForm()(Page);