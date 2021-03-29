//this file is where the program disply the input common on the screen
//file include the area text bar and the submit button at the buttom right corner
//flip move is a animation libary under react

//this file using a empty array take all the input and assign them a unique key
//using the items.map(this.createTasks), map take the element from items one by one and pass into createTasks(item)
//createTasks(item) this function will retuen one by one base the the unique key
import React, {Component} from "react";
// import FlipMove from "react-flip-move";
import "./UserPostLayOut.css";
import AwardsButton from "./AwardsButton";
import CommentButton from "../Small/CommentButton";
import profilePic from "./genericProfilePicture.jpeg";
import {PaperAirplaneIcon, SquirrelIcon } from '@primer/octicons-react'
import axios from 'axios';



export default class UserPostLayOut extends Component{
    constructor(props){
        super(props);

        this.state = {
            username: "Jamel Spencer",// UNCOMMENT props.user.username, 
            recognition: '',
            items: [], //the empty array is for getting the input from the textarea
        };
        console.log(props)
        this.addItem = this.addItem.bind(this);

    }
    
    componentDidMount(){
        axios.get('http://localhost:3001/recogs', {withCredentials: true})
            .then((res) => this.updateFeed(res));
    }

    getUserFromID(employeeId){
        var result;
        axios.post('http://localhost:3001/lookupUser', {id: employeeId}, {withCredentials: true})
            .then((result) => function(result){
                console.log(result['1']);
                return result['1'].data.firstName+ " "+ result['1'].data.lastName;
            });
    }
    updateUsers(res, callback){
        for(var i=0;i<Object.keys(res.data).length;i++){
            res.data[i]["giver"] = this.getUserFromID(res.data[i]["reco"].giverID);
            console.log(this.getUserFromID(res.data[i]["reco"].giverID))

            res.data[i]["receiver"] = this.getUserFromID(res.data[i]["reco"].receiverID);
        }
        console.log(res.data[1]["giver"])
    }

    updateFeed(res){
        console.log(res.data);
        var tempRecognized = "";
        var messageValue = "";

        for(var i=0;i<Object.keys(res.data).length;i++){
            tempRecognized= res.data[i]["reco"].giverID;
            messageValue = res.data[i]["reco"].message;
                var newItem = {
                    username: res.data[i]["reco"].giverName,
                    recognized: res.data[i]["reco"].receiverName,
                    text: messageValue,
                    key: Date.now() //a time value for the unique perpos
                };
    
                this.setState((prevState) => {
                    return {
                        items: [newItem].concat(prevState.items)
                    };
                });

        var tempRecognized = "";
        var messageValue = "";
        }
    };

    addItem(e){ //enter value will add them into the items array 
        console.log(this._recognized.value);
        if(this._recognition.value !== ""){
            var newItem = {
                companyID: 1,
                giverID: -1,
                receiverID: -1,
                value: [],
                message: this._recognition.value,
                giverName: this.state.username,
                receiverName: this._recognized.value
            };
            axios.post('http://localhost:3001/postRec', newItem, {withCredentials: true})
            .then((res) => console.log(res.data));
        }

        this._recognized.value = "";
        this._recognition.value = "";
        e.preventDefault(); //prevent refreash page
    }

    createTasks(item){  
        return<li key = {item.key}>
                <p className = "postHeader" style = {{color: "black" , backgroundColor: "rgb(210, 252, 255)"}}>
                    <AwardsButton></AwardsButton>
                    <img class = "profilePictures" src={profilePic} alt="profilePic" width ="8%"/><strong> {item.username} </strong>is recognizing 

                    <strong> {item.recognized}</strong>
                </p>
             {item.text}
             <CommentButton></CommentButton>
             </li>
    }

    poatList(){
        return this.state.items.map(this.createTasks)
    }

    postArea(){
        return <div className = "recognition">
                    <form className = "post" onSubmit = {this.addItem}>
                        <input className = "recognitionFor" ref={(a) => this._recognized = a} 
                            placeholder = "who are you recognizing">
                        </input>
                        <div className = 'line'></div>
                        <textarea className = "box" ref={(a) => this._recognition = a} 
                            placeholder = "recognition">
                        </textarea>

                        <button type = "submit">
                             <SquirrelIcon size={25}/>
                        </button>
                    </form>
                </div>
    }


    render(){
        return(           
            <div className = 'todoListMain'>
                {this.postArea()}
                <ul className = "thisList">
                    {this.poatList()}
                </ul>
            </div>
        )
    }
}
