import React, { Component,useState } from 'react';
import { ScrollView,Dimensions,FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { InputItem,Icon, Button, Toast, Modal } from '@ant-design/react-native';
import CheckBox from '@react-native-community/checkbox';
// import { ScrollView } from 'react-native-gesture-handler';


// table
class TableComponent extends Component {

  constructor(props) {
    super(props);

    const {data=[]}=this.props;

    this.state={
      serchValue:"",  // 查询值
      modalToggle:false,  // 查询 弹框
      data:data,
      // documentWidth:((Dimensions.get('window').width*0.5)-20).toFixed(0), 
    };
  }


  /**
   * 打开 弹框
   */
  onOpen(){
    this.setState({modalToggle:true});
  }  

  /**
   * 关闭 弹框
   */
  onClose(){
    this.setState({modalToggle:false});
  }

  /**
   * 获取选中数据
   */
  getSelectData(){
    let {data}=this.state;
    let newData=JSON.parse(JSON.stringify(data));

    return newData.filter(o=>o["_checked"]);
  }


  /**
   * 更新 table
   */
  updateTable(){
    const {data=[]}=this.props;
    this.setState({
      data:data 
    });    
  }


  /**
   * 
   * @param {状态} action 
   */
  onChangePageHandle(action){

    let {currentPage,totalPage,onChangePage}=this.props;

    switch (action) {
      case "previous":   // 上一页
        if(currentPage>1){
          onChangePage({
            action:"previous",
            targetPage: currentPage-1
          });
        }else{
          Toast.info('当前第一页！',1);
        }
        break;
      case "next":      // 下一页
        if(currentPage<totalPage){
          onChangePage({
            action:"next",
            targetPage: currentPage+1
          });        
        } else{
          Toast.info('当前最后一页！',1);
        }  
        break;    
      default:
        break;
    }

  }


  /**
   * checkbox change
   * @param {*} item 
   * @param {*} index 
   */
  checkBoxChange(item,index){
    let{data}=this.state;
    let{single=false,onCheckChange}=this.props;
    let newData=JSON.parse(JSON.stringify(data));

    // 单选
    if(single){
      newData.map(o=>o["_checked"]=false);
    }

    newData[index]["_checked"]=!(item["_checked"]||false);
    this.setState({
      data: newData
    });

    onCheckChange && onCheckChange(newData.filter(o=>o['_checked']));
  }

  /**
   * 
   * @param {*} item row
   */
  renderItemHandle(item,index){
    const {onClickRow,columns=[],checkBox=false,headLeftText,headRightText}=this.props;
    // let {documentWidth}=this.state;


    return (
      <TouchableOpacity key={String(index)} disabled={!!!onClickRow?true:false} onPress={()=>{
          if( onClickRow ) onClickRow(item,index); 
      }}>
        <View style={styles.rowContainer}>
          <View style={{height:30,flexDirection: "row",justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:"#e8eaec"}}>
              <View>
                <Text style={{paddingTop:6,paddingLeft:10,color:"#57a3f3"}}>{index+1}</Text>
              </View>
              <View style={{...styles.checkBoxContainer,flex:5}}>
                { checkBox ?
                  <CheckBox
                    value={(item["_checked"]||false)}
                    onValueChange={()=> this.checkBoxChange(item,index)}
                    tintColors={{true:'#57a3f3',false:'#dcdee2'}}
                    style={styles.checkbox}
                  />
                : <View style={{}}></View>

                }

                {
                  checkBox ?
                    <View></View>
                    :
                    // <Text style={styles.headText}>{ (index+1) }</Text>
                    <Text style={styles.headText}>{ ( headLeftText && headLeftText(item) ) }</Text>
                }
                
              </View>
              <View style={{flexDirection:"row",flexDirection:'row-reverse',flex:5}}>
                { onClickRow ? 
                  <Icon style={{paddingTop:7,paddingRight:6,fontSize:16,color:"#000"}} name="right" />
                  :
                  <Text> </Text>
                }

                { headRightText ?
                  <Text style={{paddingTop:5,paddingRight:3,textAlign:"right"}}>{ headRightText && headRightText(item) }</Text>
                  :
                  <Text></Text>
                }

              </View>
          </View>

          <View style={styles.contentContainer}>
            { columns.map((o,i)=>{
              // return (<View style={{...styles.rowCell,width:Number(documentWidth)}} key={i}>
              let _value=o["render"] ? o["render"](item,index) : item[o["name"]];
              return ( _value? 
                  <View style={{...styles.rowCell}} key={i}>

                    {/* <Text style={styles.rowCellLabel} numberOfLines={3}>大苏打wewe121212是的是的</Text>
                    <Text style={styles.rowCellText} numberOfLines={5}>12121dfd对方对方的fdfdfdfdf反对反对反对反对反对反对</Text> */}

                    {/* <Text style={styles.rowCellLabel} numberOfLines={2}>{o[1]}:</Text>
                    <Text style={styles.rowCellText} numberOfLines={5}>{item[o[0]]}</Text> */}

                    <Text style={styles.rowCellLabel} numberOfLines={2}>{o["label"]}:</Text>
                    <Text style={styles.rowCellText} numberOfLines={5}>{_value}</Text>

                  </View>
                  :
                  <View key={i}></View>
                )
              })
            }
            
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {serchValue,modalToggle, data=[]}=this.state;
    const {pageBox=true,placeholder,onSerchHandle,height,searchHTML, maxHeight, currentPage, totalPage, onChangePage, onRefresh}=this.props;

    return (
      <View style={styles.container}>

        <Modal
          visible={modalToggle} 
          maskClosable
          onClose={()=>this.onClose()}

          // closable
          // transparent
          // popup
          
          // transparent
          // maskClosable
          
          // footer={footerButtons}
        >
          <View style={{ paddingVertical: 20 }}>
            {searchHTML}
          </View>

        </Modal>


        <View>
          { onSerchHandle ?
            <View style={styles.headContainer}>
              <View style={{flex:1}}>
                <InputItem
                  last={true}
                  clear
                  // type="number"
                  value={serchValue}
                  onChange={value => {
                    this.setState({
                      serchValue: value,
                    });
                  }}
                  placeholder={placeholder||"请输入..."}
                />
              </View>
              <TouchableOpacity onPress={() => onSerchHandle(serchValue) }>
                <View style={styles.headIcon}>
                  <Icon name="search" size={30} color="#009966" />
                </View> 
              </TouchableOpacity>
            </View>
            :
            <View></View>
          }
          { pageBox ?
            <View style={styles.footerContainer}>
              <View style={{...styles.footerContainerConfig,paddingTop:6}}>
                {/* <Text style={{paddingLeft:12}}>共</Text>
                <Text numberOfLines={1} style={{paddingLeft:6,paddingRight:6,maxWidth:80,textAlign:'center'}}>1200</Text>
                <Text>条</Text> */}

                <Text style={{color:"#000000d9",fontSize:16,paddingLeft:6}}>第</Text>
                <Text numberOfLines={1} style={{color:"#000000d9",fontSize:16,paddingLeft:6,paddingRight:6,maxWidth:80,textAlign:'center'}}>{currentPage}</Text>
                <Text style={{color:"#000000d9",fontSize:16}}>页</Text>

                <Text style={{color:"#000000d9",paddingLeft:12,fontSize:16}}>共</Text>
                <Text numberOfLines={1} style={{color:"#000000d9",fontSize:16,paddingLeft:6,paddingRight:6,maxWidth:80,textAlign:'center'}}>{totalPage}</Text>
                <Text style={{color:"#000000d9",fontSize:16}}>页</Text>

                { onRefresh ?
                  <TouchableOpacity onPress={()=>{
                    onRefresh();
                  }}>
                    <View style={{paddingLeft:10}}>
                      <Icon name="sync" color="#009966"/>
                    </View>
                  </TouchableOpacity>
                  :
                  <View></View>
                }


              </View>
              <View style={styles.footerContainerConfig}>
                { searchHTML ?
                  <TouchableOpacity onPress={()=>this.onOpen() }>
                    <Icon style={{...styles.pagingIcon,marginTop:2,marginRight:18}} name="search" />
                  </TouchableOpacity>
                  : <Text></Text>
                }

                { onChangePage ?
                  <TouchableOpacity onPress={()=>this.onChangePageHandle("previous") }>
                    <Icon style={{...styles.pagingIcon,marginRight:11}} name="left-circle" />
                  </TouchableOpacity>
                  : <Text></Text>
                }

                { onChangePage ?
                  <TouchableOpacity onPress={()=>this.onChangePageHandle("next") }>
                    <Icon style={styles.pagingIcon} name="right-circle" />
                  </TouchableOpacity>
                  :<Text></Text>

                }
              </View>
            </View>
            :
            <View></View>
          }
        </View>

        {/* <ScrollView style={{height:height|| (Dimensions.get('window').height-(onSerchHandle?260:200)) }}>        */}
        <ScrollView style={{height:height}}>       
          <View>
            {
              data.map((item,index)=>{
                return this.renderItemHandle(item,index);
              })
            }
          </View>
        </ScrollView>       
    </View>
    );
  }
}

const styles = StyleSheet.create({
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
  },  
  rowContainer:{
    marginBottom:16,
    borderWidth:1,
    borderColor:"#e8eaec",
    borderRadius:8,
    borderColor:"#e8eaec"
  },
  container: {
    paddingLeft:6,
    paddingRight:6,
    paddingTop:8,
    paddingBottom:8,
    backgroundColor:"#fff"

  },
  checkBoxContainer:{
    // backgroundColor:"red"
    // flexDirection: "row",
  },
  headText:{
    paddingTop:3,
    paddingLeft:6,
    fontSize:16,
    fontWeight:"bold",
    textAlign:"left",
    flexDirection: "row",

    // width:260,
    // backgroundColor:"red"
  },
  checkbox:{
    // fontSize:22

    // backgroundColor:"#e8eaec"
  },
  contentContainer:{
    // flexDirection: "row",
    // flexWrap:'wrap',
    // justifyContent:'space-between',

    borderBottomWidth:1,
    borderBottomColor:"#e8eaec",
    paddingLeft:8,
    paddingRight:8,
    paddingTop:8,
    paddingBottom:8,
    // borderColor:"red",
    // backgroundColor:"red"

  },
  rowCell:{
    // flex:1,
    // borderColor:"red",
    // borderWidth:1,


    // flexDirection:"wrap",
    
    // justifyContent:'space-between',
    flexDirection: "row",
    paddingTop:3,
    paddingBottom:3,

    // backgroundColor:"blue"
  },
  rowCellLabel:{
    // flex:5,
    fontSize:15,
    textAlign: 'right',
    color:"#000000d9"
    // width:100,
    // backgroundColor:"blue"
  },
  rowCellText:{
    // flex:5,
    fontSize:15,
    paddingLeft:8,
    textAlign: 'left',
    color:"#000000d9"

    // width:220,
    // backgroundColor:"red"
  },
  footerContainer:{
    flexDirection: "row",
    justifyContent:'space-between',
    marginBottom:8
    // marginTop:12,
    // marginBottom:16,
    // backgroundColor:"red"
  },
  footerContainerConfig:{
    flexDirection: "row",
  },
  pagingIcon:{
    // color:"#003399", 
    color:"#1890ff",
    fontSize:26,
    marginRight:6
  },  
  footerContainerConfig:{
    flexDirection: "row",
    justifyContent:'space-between',
  },


});

export default TableComponent;