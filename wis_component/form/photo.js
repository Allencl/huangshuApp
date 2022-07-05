import React, { Component } from 'react';
import { PermissionsAndroid,Modal,Platform, StyleSheet, Text, TouchableOpacity,Image, View } from 'react-native';
import {Icon,Toast,Button, } from '@ant-design/react-native';
import { RNCamera } from 'react-native-camera';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

// 拍照
class PhotoComponent extends Component{

    constructor(props) {
        super(props);
    
        this.state={
          indexImage:0,
          visible: false,    
          visibleImage:false,                    // 显示
          torchToggle: false,   // 切换 手电筒
          bufferList:[],   // 图片
        };
    }






    /**
     * 拍照
    */
    // takePicture = async () => {
    //     let that=this;
    //     let {bufferList}=this.state;
    //     const {onChange}=this.props;

    //     if (this.camera) {
    //         const options = { quality: 0.5, base64: true };
    //         const data = await this.camera.takePictureAsync(options);
    //         Toast.success( JSON.stringify(data) );
    //         this.setState({
    //             visible:false,
    //             // bufferList:bufferList.concat([data.uri])
    //             bufferList:[data.uri]  // 只能传一个

    //         },()=>{
    //             onChange && onChange(this.state.bufferList);
    //         });
    //     }
    // };


    // 拍照
    takePicture2= async ()=>{
        let that=this;
        const {onChange}=this.props;
        let {bufferList}=this.state;

        if (Platform.OS == 'ios') return true;
        //申请相机权限
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                title: '申请摄像头权限！',
                message: '故障新增拍照！'
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log('如今你得到摄像头权限了');

                launchCamera({
                    mediaType: "photo",
                    cameraType: "back"
                },(res)=>{
                    // let _file=res["assets"][0];
                    if(!res.assets){
                        return;
                    }

                    let _list=res.assets.map(o=>Object.assign(o,{name:o["fileName"]}));

                    that.setState({
                        visible:false,
                        bufferList:bufferList.concat(_list)
                        // bufferList:[Object.assign(_file,{name:_file["fileName"]})] // 只能传一个
                    },()=>{
                        onChange && onChange(that.state.bufferList);
                    });
        
        
                    // console.log(res)
                })  


                return true;
            } else {
                // console.log('用户并不屌你');
                return false;
            }
        } catch (err) {
            // console.warn(err);
            return false;
        }       
    }

    /**
     * 打开相册 
     */
     openPicture=()=>{
        let that=this;
        const {onChange}=this.props;
        let {bufferList}=this.state;


        launchImageLibrary({
          selectionLimit: 0, 
          mediaType: 'photo', 
          includeBase64: false,
        },(data)=>{

            // let _file=data.assets[0];
            if(!data.assets){
                return
            }

            let _list=data.assets.map(o=>Object.assign(o,{name:o["fileName"]}));
            that.setState({
                visible:false,
                bufferList:bufferList.concat(_list)
                // bufferList:[Object.assign(_file,{name:_file["fileName"]})] // 只能传一个
            },()=>{
                onChange && onChange(that.state.bufferList);
            });
        })
        
      }


    /**
     * 打开相机
     */
    openCamera=(value)=>{
        this.setState({
            visible:true
        });
    }  

    /**
     * 关闭
     */
    closeHandle(){
        let {onClose}=this.props;
        if(onClose) onClose(); 
        this.setState({
            visible:false
        });
    }  

    /**
     * 删除
     * @param {} action 
     */
    deleteHandle(obj){
        let that=this;
        const {onChange}=this.props;
        let {bufferList}=this.state;

        this.setState({
            bufferList:bufferList.filter(o=>o['uri']!=obj["uri"])
        },()=>{
            onChange && onChange(that.state.bufferList);
        });
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
        let{visible,indexImage,visibleImage,torchToggle,bufferList}=this.state;

        const {requiredSign=false,onChangeValue,lableName,disabled,required=false}=this.props;

        const images =bufferList.map(o=>{
            return {url:o.uri};
        });
        // const images = [{
        //     // Simplest usage.
        //     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
         
        //     // width: number
        //     // height: number
        //     // Optional, if you know the image size, you can set the optimization performance
         
        //     // You can pass props to <Image />.
        //     props: {
        //         // headers: ...
        //     }
        // }, {
        //     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',


        // }];


        return (
            <View>

                <Modal 
                    visible={visibleImage} 
                    transparent={true}
                    onRequestClose={()=>{
                        if(visibleImage){
                            this.setState({
                                visibleImage:false
                            }); 
                        }
                    }}
                >   
                    <View style={styles.ImageClose}>
                        <TouchableOpacity 
                            onPress={()=>{
                                this.setState({
                                    visibleImage:false
                                });
                            }}
                        >
                            <Icon style={{fontSize:28}} name="close-circle" size="md" color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <ImageViewer 
                        imageUrls={images}
                        index={indexImage}
                        enableImageZoom={true}
                    />
                </Modal>      


                
                <View style={styles.photoContainer}>
                    <View style={styles.photoText}>
                        <Text>
                            { requiredSign ? 
                                <Text><Text style={{color:"#ed4014"}}>*</Text>
                                    <Text style={{fontSize:15,color:"#000000d9"}}>{lableName}</Text>
                                </Text>
                                :
                                <Text style={{fontSize:15,color:"#000000d9"}}>{lableName}</Text>
                            }
                        </Text>
                    </View>

                    { !disabled ?
                        <View style={styles.photoBox}>
                            <Button onPress={this.takePicture2} style={styles.photoBoxBtn} type="ghost" size="small">拍照</Button>
                            <Button onPress={this.openPicture} style={styles.photoBoxBtn} type="ghost" size="small">相册</Button>
                        </View> 
                        :
                        <View></View>
                    }
     
                </View>

                <View style={styles.ImageBox}>
                    { bufferList.map((o,i)=>{
                        return <View style={styles.ImageBoxLi} key={i}>
                            <View style={styles.ImageBoxLiClose}>
                                <TouchableOpacity 
                                    onPress={()=>{
                                        this.deleteHandle(o);
                                    }}
                                >
                                    <Icon style={{fontSize:28}} name="close-circle" size="md" color="#990000" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                onPress={()=>{
                                    this.setState({
                                        visibleImage:true,
                                        indexImage:i
                                    });
                                }}
                            >
                                <Image 
                                    source={{
                                    uri: o["uri"],
                                    // cache: 'only-if-cached',
                                    }} 
                                    style={{
                                    width: 100,
                                    height: 100,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>})
                    }
                </View>
            </View>
        );
    }
    
}


const styles=StyleSheet.create({
    ImageBox:{
        flexDirection: "row",
        flexWrap:'wrap'
    },
    ImageBoxLi:{
        position:"relative",
        width:100,
        marginRight:8,
        marginBottom:8,
        // backgroundColor:"red"
    },
    ImageClose:{
        position:"absolute",
        top:15,
        right:15,
        zIndex:11        
    },
    ImageBoxLiClose:{
        position:"absolute",
        top:0,
        right:0,
        zIndex:11
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    ImageModalBox:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    containerHead:{
        paddingTop:26,
        paddingLeft:26,
        height:100
    },
    containerFooter:{
        paddingBottom:38,
        fontSize:12,
    },   
    photoBox:{
        paddingTop:10,
        flexDirection: "row",

    },
    photoBoxBtn:{
        width:46,
        height:36,
        fontSize:16,
        marginLeft:12
    },
    photoContainer:{
        flexDirection: "row",
        justifyContent:'space-between',
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:12
    },
    photoText:{
        paddingTop:11,
        paddingBottom:11,
        
    },
    isDisabled:{
        backgroundColor:"white"
    },
  });


export default PhotoComponent;
  
