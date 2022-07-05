import React, { Component } from 'react';
import { StyleSheet, View, Text,ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {List,Picker,InputItem,Icon,Modal} from '@ant-design/react-native';
import CheckBox from '@react-native-community/checkbox';




// 下拉框
class SelectComponent extends Component{

    constructor(props) {
        super(props);

        this.props.onRef && this.props.onRef(this);

        this.state={
            value:'',   // 查询value
            visible:false,   // modal
            bufferData:[],   // buffer list
        };
    }  

    /**
     * 设置 初始值
     */
    setInitValue(list){
        let{name,form}=this.props;
        if(name&&form){
            this.props.form.setFieldsValue({
                [name]: list,
            });
        }
    }

    /**
     * show modal
     */
    showModal(){
        let {onOpen=()=>{},form,name}=this.props;
        
        let result=onOpen();
        if(result==false) return;
    
        this.setState({
            bufferData:(form&&name)?form.getFieldValue(name):[],
            visible:true
        });
    }
    
    /**
     * 选中
     * @param {} value 
     */
    checkBoxChange(row,index){
        let {bufferData}=this.state;
        // 暂时 只支持单选

        if(bufferData.filter(o=>o.id==row.id)[0]){
            this.setState({
                bufferData:[]
            });
        }else{
            this.setState({
                bufferData:[row]
            });
        }

    }


    /**
     * 确定
     * @returns 
     */
    confirmHandle(){
        let {bufferData}=this.state;
        let {onChangeValue}=this.props;
        let _selectData=JSON.parse(JSON.stringify(bufferData));

        let{name,form}=this.props;
        if(name&&form){
            this.props.form.setFieldsValue({
                [name]: _selectData,
            });
        }

        if(bufferData["length"]){
            onChangeValue && onChangeValue(_selectData);
        }
        this.setState({visible:false});
    }
    
    render() {
        let {bufferData=[],value}=this.state;
        const {onSearchChange,data=[],title,form,name,textFormat=()=>{},requiredSign=false,labelFormat=()=>{},onChangeValue,lableName,disabled}=this.props;
       

        let _list=(form.getFieldValue(name)||[]).map(o=>{
            return textFormat(o)
        });

        return (
            <View>
                <Modal
                    title={title||'下拉框'}
                    transparent
                    visible={this.state.visible}
                    footer={[
                        {text:'取消',onPress:()=>{
                            this.setState({visible:false});
                        }},
                        {text:'确定',onPress:()=>{
                            this.confirmHandle();
                        }},
                    ]}
                >
                    <View>
                        { onSearchChange ? 
                            <View>
                                <InputItem
                                    value={value}
                                    onChange={value=>{
                                        this.setState({
                                            value:value
                                        })
                                    }}
                                    extra={
                                        <TouchableOpacity 
                                            onPress={()=>{
                                                onSearchChange && onSearchChange(value.trim())
                                            }}
                                        >
                                            <Icon name="search" />
                                        </TouchableOpacity>
                                    }
                                    placeholder="查询..."
                                >
                                </InputItem>
                            </View>
                            :
                            <View></View>
                        }
                        <ScrollView style={{height:200}}>
                            <View style={{paddingTop:6,paddingBottom:6}}>
                                { data.map((o,index)=>{
                                    return <TouchableOpacity
                                        key={index}
                                        onPress={() =>{
                                            this.checkBoxChange(o,index);
                                        }}
                                    >
                                        <View style={styles.body}>
                                            <CheckBox
                                                value={ bufferData.filter(k=>k.id==o["id"])["length"]?true:false}
                                                tintColors={{true:'#57a3f3',false:'#dcdee2'}}
                                                onValueChange={()=>{
                                                    this.checkBoxChange(o,index);
                                                }}
                                            />
                                            <Text style={styles.bodyText}>{labelFormat(o)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    })
                                } 
                            </View>
                        </ScrollView>
   
                    </View>
                </Modal>

                <TouchableOpacity 
                    disabled={disabled}
                    onPress={() =>{
                        !disabled && this.showModal(); 
                    }}
                >
                    <InputItem
                        style={disabled?styles.isDisabled:styles.InputItem}
                        value={_list.join(",")}
                        labelNumber={6}
                        placeholder={"请选择..."}
                        editable={false}
                        extra={disabled?<Icon name="stop" />:<Icon name="down" />}
                        // onChangeText={(val)=>{
                        //     if(onChangeValue) onChangeValue(val);
                        // }}                
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
                </TouchableOpacity>

         </View>
        );
    }
    
}


const styles=StyleSheet.create({
    body:{
        flexDirection:'row',
        marginRight:16,
    },
    bodyText:{
        paddingRight:10,
        paddingTop:6
    },
    datePickerContainer:{
        borderBottomWidth:1,
        borderBottomColor:"#fff"
    },
    InputItem:{
        color:"#000000d9",
        backgroundColor:"white"
    },
    isDisabled:{
        color:"#000000d9",
        backgroundColor:"white"
    },
  });


export default SelectComponent;
  
