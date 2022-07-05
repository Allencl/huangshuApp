import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Radio, Button, TextareaItem, List, Icon, WhiteSpace } from '@ant-design/react-native';

const RadioItem = Radio.RadioItem;

// Radio 
class RadioComponent extends Component{

    constructor() {
        super(...arguments);

        const {initialValue}=this.props;

        this.state = {
            checked: initialValue,
        };
    }

    render() {
        let {checked}=this.state;
        const {defaultValue,onChangeValue,lableName,children=[],disabled}=this.props;

        return (
            <View style={styles.radioBox}>
                <Text style={styles.radioBoxText}>{lableName}</Text>

                <View>
                    <List>
                        { children.map((o,i)=>{
                            return(
                                <RadioItem
                                    disabled={disabled}
                                    key={i}
                                    checked={(checked||defaultValue) === o["id"]}
                                    onChange={event => {
                                        if (event.target.checked) {
                                            this.setState({ checked: o["id"] });
                                            
                                            // 回调
                                            if( onChangeValue ) onChangeValue(o["id"],o);
                                        }
                                    }}
                                >
                                    <Text numberOfLines={1} style={styles.radioText}>{o["lable"]||''}</Text>
                                </RadioItem>                                
                            );
                        })
                        }
                    </List>
                </View>

            </View>
        );
    }
    
}


const styles=StyleSheet.create({
    radioBox:{
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:12
    },
    radioBoxText:{
        fontSize:17,
        color:"#000",
        // paddingLeft:15,
        paddingTop:11,
        paddingBottom:11
    },
    radioText:{
        width:260,
        fontSize:16,
        paddingTop:6
        // backgroundColor:"red"
    }

  });


export default RadioComponent;
  
