import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Button, TextareaItem, List, Icon } from '@ant-design/react-native';


// 多行输入
class TextareaComponent extends Component{
    render() {
        const {requiredSign=false,onChangeValue,lableName,disabled,required=false}=this.props;

        return (
            <View style={styles.textarea}>
                <Text style={styles.textareaText}>
                    { requiredSign ? 
                        <Text><Text style={{color:"#ed4014"}}>*</Text>{lableName}</Text>
                        :
                        <Text style={{fontSize:14,fontWeight:"100",color:"#1b1b1bd9"}}>{lableName}</Text>
                    }
                </Text>
                <View style={styles.textareaBox}>
                    <TextareaItem
                        rows={3} 
                        {...this.props}
                        style={disabled?styles.isDisabled:{}}
                        disabled={disabled}
                        placeholder={disabled?"":"请输入..."}
                        style={styles.textarea}
                        editable = {!disabled}
                        
                        onChangeText={(val)=>{
                            if(onChangeValue) onChangeValue(val);
                        }}                          
                    />
                </View>                       
            </View>
        );
    }
    
}


const styles=StyleSheet.create({
    textareaBox:{
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:3,
        fontSize:14,

    },
    textarea:{
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:12
    },
    textareaText:{
        paddingTop:11,
        paddingBottom:11
    },
    isDisabled:{
        backgroundColor:"white"
    },
  });


export default TextareaComponent;
  
