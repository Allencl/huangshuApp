import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { DatePicker, Button, TextareaItem, List, Icon } from '@ant-design/react-native';


// 时间组件
class DatePickerComponent extends Component{

    constructor(props) {
        super(props);

        this.state = {
          value: undefined,
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
        let {value}=this.state;
        const {requiredSign=false,defaultValue,form={},name='',lableName,format="YYYY-MM-DD",mode="date",disabled,required=false}=this.props;
        let{getFieldError,getFieldValue}=form;

        return <View>
            <List>
                <DatePicker
                    value={(getFieldValue?getFieldValue(name):value) || defaultValue}
                    mode={mode}
                    defaultDate={new Date()}
                    minDate={new Date(2015, 7, 6)}
                    maxDate={new Date(2026, 11, 3)}
                    format={format}
                    disabled={disabled}
                    onChange={(value)=> this.onChange(value) }
                >
                    <List.Item arrow="horizontal">
                        { requiredSign ? 
                            <Text>
                                <Text style={{color:"#ed4014"}}>*</Text>
                                <Text style={{fontSize:15,color:"#000000d9"}}>{lableName}</Text>
                            </Text>
                            :
                            <Text style={{fontSize:15,color:"#000000d9"}}>{lableName}</Text>
                        }
                    </List.Item>
                </DatePicker>
            </List>
        </View>

        // return (
        //     <View style={{...styles.datePickerContainer,borderBottomColor:(getFieldError&&getFieldError(name))?"#ed4014":"#fff"}}>
        //         {/* <Text style={styles.textareaText}>{lableName}</Text> */}
        //         <List>
        //             <DatePicker
        //                 value={(getFieldValue?getFieldValue(name):value) || defaultValue}
        //                 mode={mode}
        //                 defaultDate={new Date()}
        //                 minDate={new Date(2000, 7, 6)}
        //                 maxDate={new Date(2030, 11, 3)}
        //                 onChange={(value)=> this.onChange(value) }
        //                 format={format}
        //                 disabled={disabled}
        //             >
        //                 <List.Item arrow="horizontal">{lableName}</List.Item>
        //             </DatePicker>
        //         </List>                    
        //     </View>
        // );
    }
    
}


const styles=StyleSheet.create({
    datePickerContainer:{
        borderBottomWidth:1,
        borderBottomColor:"#fff"
    },
    isDisabled:{
        color:"#ccc",
        backgroundColor:"white"
    },
  });


export default DatePickerComponent;
  
