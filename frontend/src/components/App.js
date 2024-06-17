import React, {Component} from "react";
import ReactDOM from "react-dom";
import HomePage from "./HomePage";

export default class App extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return <div class="center">
        <HomePage />
        </div>
    }
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);