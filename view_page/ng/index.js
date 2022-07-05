import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet, ScrollView, View,Text,TextInput   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createForm, formShape } from 'rc-form';
import { WisInput,WisSelect, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 上料 主页
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={

      stationList:[],  // 工位数据

    }
  }

  static propTypes = {
    form: formShape,
  };  

  
  componentWillMount(){
    this.initFunc();   // 初始化
  }

  componentDidMount(){
    this.initFunc();   // 初始化
  }

  /**
   * 初始化
   */
   initFunc(){
     let that=this;

      WISHttpUtils.post("faultMachineApp/manualTriggerInput.do",{
        params:{

        },
        hideLoading:true
      },(result) => {
        let {data}=result;

        that.setState({
          stationList:data.optionUlocNgEntrances.map((o,i)=>Object.assign({},o,{id:o.code}))
        });

        // console.log( data );
      });     
   }




  /**
   * 提交
   */
  passHandle=(value)=>{
    const {navigation} = this.props;

    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        Toast.fail('请选择工位！');
      } else{

        WISHttpUtils.post("faultMachineApp/manualTrigger.do",{
          params:{
            ulocNo: value["station"][0]["code"],
            inOrOut:value["stationType"][0]["id"]
          }
        },(result) => {

          if( result.success ){
            Toast.success("执行成功！");
            // setTimeout(() => {
            //   navigation.navigate('Home');
            // },500);
          }
        });

      }
  });
  }  




  render() {
    let that=this;
    let {stationList} = this.state;

    let {navigation,form} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;


    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>

        <View style={{marginTop:22}}>

          <WisSelect 
            form={form} 
            name="station"
            requiredSign={true}
            {...getFieldProps('station',{
              rules:[{required:true }],
              initialValue:[]
            })} 
            error={getFieldError('station')}  
            title="工位（单选）"             
            lableName="工位"
            textFormat={o=>o.name}
            labelFormat={o=>o.name}
            data={stationList}         
          />


          <WisSelect 
            form={form} 
            name="stationType"
            {...getFieldProps('stationType',{
              rules:[{required:false }],
              initialValue:[]
            })} 
            error={getFieldError('stationType')}  
            title="工位特征（单选）"             
            lableName="工位特征"
            textFormat={o=>o.name}
            labelFormat={o=>o.name}
            data={[
              {id:"OUT",name:"出"},
              {id:"IN",name:"入"}
            ]}
            
          />

        </View>

        <View style={{marginTop:32,marginBottom:50}}>
          <Button type="primary" onPress={this.passHandle}>提交</Button>
        </View>      
                
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  inputBox:{
    fontSize:14,
    height:48,
    borderColor:'#515a6e',
    borderWidth:1,
    borderRadius:3,
    paddingLeft:8,

  },
  headContainer:{
    flexDirection:'row',
    paddingTop:18,
    paddingBottom:2,
    backgroundColor:"white",
    borderBottomWidth:1,
    borderColor:"#e9e9e9", 
  },
  headIcon:{
    paddingLeft:10,
    paddingRight:10
  }
});



export default createForm()(PageForm);

