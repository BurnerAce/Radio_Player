import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography } from "@mui/material";
import { Form, Link } from "react-router-dom";
import { Collapse, Alert } from "@mui/material";
import Station from "./station";

export default class CreateRoomPage extends Component {
  static defaultProps = {
    guestCanPause: true,
    updateCallback: () => {},
    update: false,
    roomCode: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      errorMsg: "",
      successMsg: "",
      lang: this.props.lang,
      tag: this.props.tag,
    };

    this.handleRoomButtonClick = this.handleRoomButtonClick.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleUpdateButton = this.handleUpdateButton.bind(this);
    this.renderCreateButtons = this.renderCreateButtons.bind(this);
    this.renderUpdateButtons = this.renderUpdateButtons.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  handleGuestCanPauseChange(event) {
    this.setState({
      guestCanPause: event.target.value === "true" ? true : false,
    });
  }

  handleRoomButtonClick() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: this.state.guestCanPause,
        lang: this.state.lang,
        tag: this.state.tag,
      }),
    };

    fetch("api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        window.location.pathname = "/room/" + data.room_code;
      });
  }

  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleRoomButtonClick}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleUpdateButton}
        >
          Update Room
        </Button>
      </Grid>
    );
  }

  handleUpdateButton() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: this.state.guestCanPause,
        room_code: this.props.roomCode,
        lang: this.state.lang,
        tag: this.state.tag,
      }),
    };

    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        this.setState({ successMsg: "Room updated successfully!" });
      } else {
        this.setState({ errorMsg: "Error in updating Room!" });
      }
      this.props.updateCallback();
    });
  }
  handleLanguageChange(event) {
    this.setState({ lang: event });
  }
  handleTagChange(event) {
    let value = event;
    if (value === "None") {
      value = null;
    }
    this.setState({ tag: value });
  }

  render() {
    const title = this.props.update ? "Update Room" : "Create Room";
    return (
      <Grid
        container
        spacing={0.5}
        alignContent={"center"}
        alignItems={"center"}
      >
        <Grid item xs={12} align="center">
          <Collapse in={this.state.successMsg !== ""}>
            <Alert
              severity="success"
              onClose={() => {
                this.setState({ successMsg: "" });
              }}
            >
              {this.state.successMsg}
            </Alert>
          </Collapse>
          <Collapse in={this.state.errorMsg !== ""}>
            <Alert
              severity="error"
              onClose={() => {
                this.setState({ errorMsg: "" });
              }}
            >
              {this.state.errorMsg}
            </Alert>
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest control of Playback state</div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue={this.props.guestCanPause}
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              ></FormControlLabel>
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No control"
                labelPlacement="bottom"
              ></FormControlLabel>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center" margin={3}>
          <Station
            text="Language"
            options={["english", "hindi"]}
            defaultOption={this.state.lang}
            onChange={this.handleLanguageChange}
          >
            {" "}
          </Station>
        </Grid>
        <Grid item xs={12} align="center">
          <Station
            text="Tag"
            options={["None", "news", "bollywood", "music", "drama"]}
            defaultOption={this.state.tag}
            onChange={this.handleTagChange}
          >
            {" "}
          </Station>
        </Grid>
        <Grid item xs={12} align="center">
          {this.props.update
            ? this.renderUpdateButtons()
            : this.renderCreateButtons()}
        </Grid>
      </Grid>
    );
  }
}
