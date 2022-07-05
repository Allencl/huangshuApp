import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';


// 查询头
class FormSearchComponent extends Component{
    render() {
        let {onSearch}=this.props;
        return (
            <View style={styles.searchHead}>
              <View>
                <Text style={styles.searchHeadText}>查询</Text>
              </View>
              <View>
                <TouchableOpacity onPress={()=>onSearch() }>
                  <Icon style={styles.searchHeadIcon} name="search" />
                </TouchableOpacity>
              </View>
            </View>
        );
    }
    
}


const styles=StyleSheet.create({
    searchHead:{
        flexDirection: "row",
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor:"#ccc",
        paddingLeft:8,
        paddingBottom:8,
        marginBottom:16
    },
    searchHeadText:{
        fontSize:16,
    },
    searchHeadIcon:{
        color:"#003399", 
        fontSize:28,
        marginRight:16
    }   
});


export default FormSearchComponent;
  
