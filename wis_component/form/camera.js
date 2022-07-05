import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View} from 'react-native';
import {InputItem, Icon} from '@ant-design/react-native';
import {WisCameraComponent} from '@wis_component/ul';


// 扫码
class CameraComponent extends Component{


    constructor(props) {
        super(props);
    
        this.state={
          visible: false,  // 显示
          defaultValue:""

        };
    }


    // 打开 扫码
    openCamera(){
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
        const {onChangeValue,name,form}=this.props;


        if(name&&form){
            this.props.form.setFieldsValue({
                [name]: option["data"],
            });
        }else{
            this.setState({defaultValue:option["data"]});
        }


        if(onChangeValue) onChangeValue(option);

        this.setState({
            visible:false
        });   
    }

    render() {
        const{visible,defaultValue}=this.state;
        const {onChangeValue,lableName,required=false}=this.props;


        return (
            <View>
                <InputItem            
                    defaultValue={defaultValue}
                    labelNumber={6}
                    placeholder={"请扫码..."}
                    {...this.props}
                    style={styles.isDisabled}
                    onChangeText={(val)=>{
                        if(onChangeValue) onChangeValue(val);
                    }}                
                    disabled={true}
                    extra={ 
                        <TouchableOpacity
                            onPress={()=> this.openCamera() }            
                        >

                            <Icon name="scan" size="md" color="#13c2c2" /> 
                        </TouchableOpacity>
                    }
                > 
                    {lableName}
                </InputItem>

                { visible ?
                    <WisCameraComponent 
                        onClose={()=> this.closeCamera() }
                        onRead={(option)=> this.onRead(option) }
                    />
                    :
                    <View></View>
                }        
                

            </View>

        );
    }
    
}


const styles=StyleSheet.create({
    isDisabled:{
        color:"#ccc",
        backgroundColor:"white"
    },
  });


export default CameraComponent;
  
