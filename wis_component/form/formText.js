import React, { Component } from 'react';
import { StyleSheet,Text, View} from 'react-native';
import { TextareaItem} from '@ant-design/react-native';



// 表单 只读
class FormTextComponent extends Component{
    
    render() {
        const {children=[],extra,titleStyle={},title=''}=this.props;

        return (
            <View style={{paddingBottom:8}}>
                { title ? 
                    <View style={{...styles.rowContainer,...styles.title}}>
                        <Text style={{fontWeight:"bold",...titleStyle}}>{title}</Text>
                        <View>{extra}</View>
                    </View>
                    :
                    <View></View>
                }
                <View style={styles.body}>
                    { children.map((o,index)=>{
                        return ( o["type"]=="textarea" ?
                            <View style={styles.textareaBox} key={index}>
                                { o["content"] ?
                                    <TextareaItem 
                                        disabled={true}
                                        editable={false}
                                        autoHeight
                                        style={{...(o["style"]||{}),fontSize:16}}
                                    >{o["content"]}</TextareaItem>
                                    :
                                    <View></View>
                                }

                            </View>
                            :
                            <View style={styles.rowContainer} key={index}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.labelText}>{o["label"]}:</Text>
                                </View>
                                <View style={styles.contentContainer}>
                                    <Text style={styles.contentText}>{o["content"]}</Text>
                                </View>
                            </View>
                        );
                    })
                    }
                </View>
            </View>
        );
    }
    
}


const styles=StyleSheet.create({
    body:{
        backgroundColor:"#fff",
        paddingBottom:12,
        
    },
    textareaBox:{
        paddingLeft:16,
        paddingRight:10,
    },
    title:{
        paddingLeft:12,
        flexDirection: "row",
        justifyContent:'space-between',
    },
    rowContainer:{
        flexDirection:"row",
        backgroundColor:"#fff",
        paddingTop:6,
        paddingBottom:6,
        borderBottomWidth:0.8,
        borderColor:"#e9e9e9",
        
    },
    labelContainer:{
        flex:2,
        paddingRight:8,
        // backgroundColor:"red"
    },
    labelText:{
        textAlign:"right",
        fontSize:14,
        // fontWeight:"bold"
    },
    contentContainer:{
        flex:6,
        // backgroundColor:"blue"
    }, 
    contentText:{
        fontSize:14
    }   
});


export default FormTextComponent;
  
