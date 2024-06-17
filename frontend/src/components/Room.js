import { Typography, Button, Grid } from "@mui/material";
import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import Player from "./Player";
import { Collapse, Alert } from "@mui/material";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      is_auth: false,
      lang: "english",
      tag: null,
      alert: false
    };
    this.roomCode = this.props.roomCode;
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
    this.changeAlert = this.changeAlert.bind(this);
    this.getRoomDetails();
  }

  getRoomDetails() {
    fetch("/api/get-room?code=" + this.roomCode)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  }

  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  leaveRoom() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.roomCode,
      }),
    };
    fetch("/api/leave-room", requestOptions).then((response) => {
      this.props.leaveRoomCallback();
      window.location.pathname = "/";
    });
  }

  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            guestCanPause={this.state.guestCanPause}
            lang={this.state.lang}
            tag={this.state.tag}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          ></CreateRoomPage>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.updateShowSettings(false)}
          >
            Close Settings
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderAlert() {
    return (
      <Grid item xs={12} align="center">
      <Collapse in={this.state.alert}>
        <Alert
          severity="success"
          onClose={() => {
            this.setState({ alert:false });
          }}
        >
          Changing Station
        </Alert>
      </Collapse>
      </Grid>
    );
  }

  changeAlert(){
    this.setState({alert: !this.state.alert});
  }

  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        {this.state.alert ? this.renderAlert() : null}
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Player
          roomCode={this.roomCode}
          alert={this.changeAlert}
        ></Player>
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={this.leaveRoom}>
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}
