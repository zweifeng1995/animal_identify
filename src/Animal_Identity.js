import React, { Component } from 'react';
import './Animal_Identity.css';
import axios from 'axios';

export default class Animal_Identity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleIdentity = this.handleIdentity.bind(this);
    }

    handleChange(event) {
        let item = event.target.value;
        let items = this.state.value.slice();
        let index = items.indexOf(item);
        if(index === -1){
            items.push(item);
        }else{
            items.splice(index, 1);
        }
        this.setState({
            value: items
        });
    }



    handleIdentity(){
        function getJsonLength(jsonData) {
            let length = 0;
            for(let key in jsonData)
                length++;
            return length;
        }
        // 到服务器中取出事实知识
        axios.get("http://localhost:8888/api/v1/getKnowledge").then((response) =>{
            let result = "";
            let TextToValue = {
                "maofa": "毛发",
                "chanru": "产乳",
                "yumao": "羽毛",
                "feixing": "飞行",
                "shengdan": "生蛋",
                "chirou": "吃肉",
                "zhuazi": "爪子",
                "lichi": "利齿",
                "qianshi": "前视",
                "youti": "有蹄",
                "fanchu": "反刍",
                "huanghese": "黄褐色",
                "heisetiaowen": "黑色条纹",
                "shensebandian": "深色斑点",
                "changtui": "长腿",
                "changjing": "长颈",
                "baise": "白色",
                "heibaixiangza": "黑白相杂",
                "heisehebaise": "黑色和白色",
                "youshui": "游水",
                "laohu": "老虎",
                "liebao": "猎豹",
                "changjinglu": "长颈鹿",
                "tuoniao": "鸵鸟",
                "qie": "企鹅",
                "haiyan": "海燕",
                "banma": "斑马",
                "length": 27
            };
            // 1.初始化综合数据库，即把欲解决问题的已知事实送入综合数据库中。
            let  facts = response.data;
            facts.jsonlength = getJsonLength(facts[0]);
            // 事实集
            // console.log(facts);
            let temp = []; // 用于标记规则是否被使用
            for(let i = 0; i < facts.length; i++)
                temp[i] = 0;//初始化标记
            let question = {
                "maofa": 0,
                "chanru": 0,
                "yumao": 0,
                "feixing": 0,
                "shengdan": 0,
                "chirou": 0,
                "zhuazi": 0,
                "lichi": 0,
                "qianshi": 0,
                "youti": 0,
                "fanchu": 0,
                "huanghese": 0,
                "heisetiaowen": 0,
                "shensebandian": 0,
                "changtui": 0,
                "changjing": 0,
                "baise": 0,
                "heibaixiangza": 0,
                "heisehebaise": 0,
                "youshui": 0,
                "length": 20
            }; // 初始化question
            for(let i in this.state.value){ // 根据输入给question赋值
                let result = this.state.value[i]; // result = "毛发"
                for(let key in TextToValue) {
                    if(TextToValue[key] === result)
                        question[key] = 1;
                }
            }
            // 欲解决的问题集
            // console.log(question);//{"maofa": 1, "chanru": 0, ...}
            let answer = {
                "laohu": 1,
                "liebao": 1,
                "changjinglu": 1,
                "tuoniao": 1,
                "qie": 1,
                "haiyan": 1,
                "banma": 1,
                "length": 7
            }; // 最终答案集
            let end = false; // 结束标记

            // 2.检查规则库中是否有未使用过的规则，若无转7
            for(let i = 0; i < facts.length; i++){
                if(!end){
                    if(temp[i] === 0){ //规则未使用
                        let m = 0;
                        for(let j in facts[i]){//遍历当前事实的每一项，j = key
                        // 3.检查规则库的未使用规则中是否有其前提可与综合数据库中的已知事实相匹配的规则
                        // 若有，形成当前可用规则集，否则转6
                            if(!end){
                                m++;
                                if(facts[i][j] === 1 && question[j] !== 1){
                                    temp[i] = 1;
                                    break;
                                }else if(m === facts.jsonlength){
                                    for(let k in facts[i])//facts[i]，k = key
                                        // 4.按照冲突消解策略，从当前可用规则集中选择一个规则执行，并对该规则作上标记。
                                        // 把执行该规则后所得到的结论作为新的事实放入综合数据库；
                                        // 如果该规则的结论是一些操作，则执行这些操作
                                        if(facts[i][k] === 2){
                                            // 形成规则集
                                            // console.log(k);
                                            question[k] = 1;
                                            question.length++;
                                        }
                                    temp[i] = 1;//规则使用过
                                    let n = 0;
                                    // 5.检查综合数据库中是否包含了该问题的解，若已包含，说明解已求出，问题求解过程结束，否则转2
                                    for(let i in answer){
                                        n++;
                                        if(question[i] === 1){
                                            result = TextToValue[i];
                                            end = true;
                                            break;
                                        }else if(n === answer.length && i === facts.length - 1){
                                            // 6.当规则库中还有未使用的规则，但均不能与综合数据库中的已有事实相匹配时
                                            // 要求用户进一步提供关于该问题的已知事实，若能提供，则转2，否则执行下一步
                                            result = "无法识别，请继续提供条件。";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // 7.若知识库中不再有未使用规则，也说明该问题无解，终止问题求解过程
            // 从3-5的循环过程实际上就是一个搜索过程
            // console.log(question);
            if(end === false)
                result = "无解!";
            alert(result);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="App-body">
                <h2>请选择动物特征：</h2>
                <div className="checkbox_div">
                    <label><input type="checkbox" value="毛发" onChange={this.handleChange}/>毛发</label>
                    <label><input type="checkbox" value="产乳" onChange={this.handleChange}/>产乳</label>
                    <label><input type="checkbox" value="羽毛" onChange={this.handleChange}/>羽毛</label>
                    <label><input type="checkbox" value="飞行" onChange={this.handleChange}/>飞行</label>
                    <label><input type="checkbox" value="生蛋" onChange={this.handleChange}/>生蛋</label>
                    <label><input type="checkbox" value="吃肉" onChange={this.handleChange}/>吃肉</label>
                    <label><input type="checkbox" value="爪子" onChange={this.handleChange}/>爪子</label>
                    <label><input type="checkbox" value="利齿" onChange={this.handleChange}/>利齿</label>
                    <label><input type="checkbox" value="前视" onChange={this.handleChange}/>前视</label>
                    <label><input type="checkbox" value="有蹄" onChange={this.handleChange}/>有蹄</label>
                    <label><input type="checkbox" value="反刍" onChange={this.handleChange}/>反刍</label>
                    <label><input type="checkbox" value="黄褐色" onChange={this.handleChange}/>黄褐色</label>
                    <label><input type="checkbox" value="黑色条纹" onChange={this.handleChange}/>黑色条纹</label>
                    <label><input type="checkbox" value="深色斑点" onChange={this.handleChange}/>深色斑点</label>
                    <label><input type="checkbox" value="长腿" onChange={this.handleChange}/>长腿</label>
                    <label><input type="checkbox" value="长颈" onChange={this.handleChange}/>长颈</label>
                    <label><input type="checkbox" value="白色" onChange={this.handleChange}/>白色</label>
                    <label><input type="checkbox" value="黑白相杂" onChange={this.handleChange}/>黑白相杂</label>
                    <label><input type="checkbox" value="黑色和白色" onChange={this.handleChange}/>黑色和白色</label>
                    <label><input type="checkbox" value="游水" onChange={this.handleChange}/>游水</label>
                    <hr/>已选择:{ this.state.value.join(',') }<hr/>
                </div>

                <button onClick={ this.handleIdentity } >进行识别</button>
            </div>
        );
    }
}
