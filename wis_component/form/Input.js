import React, { Component } from 'react';
import { StyleSheet,TouchableOpacity} from 'react-native';
import {InputItem,Icon,Text} from '@ant-design/react-native';


// 文本框
class InputComponent extends Component{

    constructor(props) {
        super(props);

        this.state = {
            value:'',
            toggleEye:true,  // 显示密码

        };
    }


    /**
     * change 
     */
     onChange(value){
        let{name,form,onChangeValue,onValidate}=this.props;

        // 校验
        if( onValidate && (onValidate(value)==false) ){
            return;
        }

        if(name&&form){
            this.props.form.setFieldsValue({
                [name]: value,
            });
        }

        this.setState({value:value});

        if(onChangeValue) onChangeValue(value);
    }


    render() {
        let that=this;
        let {toggleEye,value}=this.state;
        const {requiredSign=false,form={},name='',type="text",defaultValue='',onChangeValue,lableName,disabled,required=false}=this.props;
        let{getFieldError,getFieldValue}=form;

        return (
            <InputItem
                value={(getFieldValue?getFieldValue(name):value) || defaultValue}
                labelNumber={6}
                placeholder={disabled?"":"请输入..."}
   
                {...this.props}
                style={disabled?styles.isDisabled:styles.InputItem}

                type={type=="password"?(toggleEye?"password":"text"):"text"}
                extra={
                    type=="password"?
                    (<TouchableOpacity onPress={()=>{
                        this.setState({
                            toggleEye:!toggleEye
                        });
                    }}>
                        <Icon name={toggleEye?"eye-invisible":"eye"} />
                    </TouchableOpacity>)
                    :
                    (disabled&&<Icon name="stop" />)
                
                }

                onChange={(value)=>{
                    that.onChange(value);
                }}               
            >
                { requiredSign ? 
                    <Text>
                        <Text style={{color:"#ed4014"}}>*</Text>
                        <Text style={{fontSize:15,color:"#000000d9"}}>{lableName}</Text>
                    </Text>
                    :
                    <Text style={{fontSize:15,color:"#000000d9"}}>{lableName}</Text>
                }
            </InputItem>
        );
    }
    
}


const styles=StyleSheet.create({
    InputItem:{
        color:"#000000d9",
        backgroundColor:"white"
    },
    isDisabled:{
        color:"#000000d9",
        backgroundColor:"white"
    },
  });


export default InputComponent;
  
