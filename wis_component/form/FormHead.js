import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Icon } from '@ant-design/react-native';



// 表单头
class FormHeadComponent extends Component{
    render() {
        let{title,icon="form"}=this.props;

        return (
            <View style={styles.formHeader}>
                <Icon style={styles.formHeaderIcon} name={icon} size="md"/>
                <Text style={styles.formHeaderText}>{title||"基础数据"}</Text>
            </View>
        );
    }
    
}


const styles=StyleSheet.create({
    formHeader:{
        flexDirection: "row",
        backgroundColor:"white",
        paddingLeft:8,
        paddingTop:16,
        paddingBottom:12
    },
    formHeaderIcon:{
        color:"#000",
        marginRight:8
    },
    formHeaderText:{
        color:"#000",
        fontSize:16
    }    
  });


export default FormHeadComponent;
  
