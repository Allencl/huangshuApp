import React, { Component } from 'react';
import { TouchableOpacity,StyleSheet,Text, View } from 'react-native';
import { Card, WhiteSpace, WingBlank,Icon } from '@ant-design/react-native';

class CardComponent extends Component {
    constructor(props) {
        super(props);

        this.state={
            unfoldActive:true,   // 展开  
        };
    }

    /**
     * 展开  闭合
     * @param {*} active 
     */
    onChangeHandle(active){
        this.setState({
            unfoldActive:active
        });
    }

    render() {
        let that=this;
        let {title='',body} = this.props;
        let {unfoldActive}=this.state;

        return (
            <View style={{paddingBottom:8}}>
                <Card full>
                    <Card.Header
                        title={<Text style={styles.title}>{title}</Text>}
                        extra={<View style={styles.headBox}>
                            <View></View>
                            { unfoldActive ?
                                <TouchableOpacity onPress={() => that.onChangeHandle(false) }>
                                    <Icon name={'up'} />
                                </TouchableOpacity> 
                                : 
                                <TouchableOpacity onPress={() => that.onChangeHandle(true) }>
                                    <Icon name={'down'} />
                                </TouchableOpacity>                                  
                            }

                        </View>}
                    />
                <Card.Body >
                    { unfoldActive ?
                        <View style={styles.body}>
                            {body}
                        </View>
                        :
                        <View>
                            <Text style={{paddingLeft:26}}>内容已隐藏...</Text>
                        </View>
                    }

                </Card.Body>
                </Card>
            </View>
        );
    }
}


const styles=StyleSheet.create({
    title:{
        fontWeight:'bold'
    },
    headBox:{
        flexDirection: "row",
        justifyContent:'space-between',

    },
    body:{
        paddingLeft:22,
        paddingRight:22,
    }
});


export default CardComponent;
