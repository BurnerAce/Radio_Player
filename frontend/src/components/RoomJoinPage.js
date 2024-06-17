import React, {Component} from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component{
    constructor(props){
        super(props);
        this.state={
            room_code: "",
            error: ""
        }
        this.handleRoomIdChange = this.handleRoomIdChange.bind(this);
        this.handleRoomButtonPress = this.handleRoomButtonPress.bind(this);
    }

    handleRoomIdChange(event){
        this.setState({
            room_code: event.target.value
        })
    }

    handleRoomButtonPress(){

        const requestOptions = {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                code: this.state.room_code
            })
        
        };
        fetch("/api/join-room", requestOptions)
            .then((response) => {
                if(response.ok){
                    window.location.pathname = "/room/" + this.state.room_code;
                } else {
                    this.setState({error: "Room not found."})
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }
    render(){
        return (
            <Grid container spacing={1} alignItems="center" alignContent={"center"}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        required
                        label="Room ID"
                        placeholder="Enter a Room Code"
                        value={this.state.room_code}
                        onChange={this.handleRoomIdChange}
                        helperText={this.state.error}
                        variant="outlined"
                        error={this.state.error}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleRoomButtonPress}
                        // to='/'
                        // component={Link}
                        >
                        Join
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        to='/'
                        component={Link}
                        >
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }
}