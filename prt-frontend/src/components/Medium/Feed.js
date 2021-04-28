import React, {Component} from "react";

export default class Feed extends Component{
    constructor(props){
        super(props);

        this.state = {
            filter: props.filter,
            sort: props.sort,
            recognitions: []
        }
    }

    componentDidMount(){
        axios.get("https://localhost:3001/recogs", {withCredentials: true})
            .then(res => this.updateFeed(res.data));
    }

    updateFeed(){}
}