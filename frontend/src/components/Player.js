import React, { Component, createRef } from "react";
import { IconButton, Grid, LinearProgress, Card } from "@mui/material";
import { PlayArrow, Pause, SkipNext } from "@mui/icons-material";
import Hls from "hls.js";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioSrc: "", // Initialize or set this in your component
      isPlaying: false,
      alert: false,
      time: 0,
      index: -1,
    };
    this.audioRef = createRef();
    this.hls = null;
    this.getSongDetails = this.getSongDetails.bind(this);
    this.togglePlayPause = this.togglePlayPause.bind(this);
    this.changeStation = this.changeStation.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.setupAudio = this.setupAudio.bind(this);
  }

  componentDidMount() {
    this.getSongDetails();
    this.togglePlayAudio(true);
    this.interval = setInterval(this.getSongDetails, 5000);
    this.changeTimeInterval = setInterval(this.changeTime, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.audioSrc !== prevState.audioSrc) {
      this.setupAudio();
      this.checkSong();
    }
  }
  togglePlayAudio(isPlaying) {
    if (isPlaying) {
      this.audioRef.current.play();
    } else {
      this.audioRef.current.pause();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.changeTimeInterval);
    if (this.hls) {
      this.hls.destroy();
    }
  }

  async getSongDetails() {
    await fetch("/api/get-song")
      .then((response) => response.json())
      .then((data) => {
        if (data.index != this.state.index) {
          console.log(data);
          this.setState({
            isPlaying: data.playing,
            audioSrc: data.url,
            index: data.index,
            time: 0,
          });
        }
      });
  }

  async togglePlayPause() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_code: this.props.roomCode,
      }),
    };

    const result = await fetch("/api/toggle-song", requestOptions).then(
      (response) => response.json()
    );
    this.setState({ isPlaying: result.playing === true ? true : false });
    this.togglePlayAudio(result.playing);
  }

  changeStation() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_code: this.props.roomCode,
      }),
    };
    this.props.alert();
    fetch("/api/change-station", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.props.alert();
        window.location.pathname = "/";
      });
  }

  async checkSong() {
    await fetch(this.state.audioSrc).then((response) => {
      if (!response.ok) this.changeStation();
    });
  }

  setupAudio() {
    const { audioSrc } = this.state;
    const audio = this.audioRef.current;

    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    if (Hls.isSupported() && audioSrc.endsWith(".m3u8")) {
      this.hls = new Hls();
      this.hls.loadSource(audioSrc);
      this.hls.attachMedia(audio);
    } else {
      audio.src = audioSrc;
    }
  }

  changeTime() {
    if (this.state.isPlaying) {
      this.setState({ time: this.state.time + 1 });
    }
    if (this.state.time >= 200) {
      this.setState({ time: 0 });
    }
  }

  render() {
    const { isPlaying } = this.state;

    return (
      <Card
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60px",
          width: "100%",
          padding: "20px",
        }}
      >
        <Grid item xs={12}>
          <LinearProgress
            variant="determinate"
            value={this.state.time}
          ></LinearProgress>
        </Grid>
        <audio ref={this.audioRef} />
        <IconButton onClick={this.togglePlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton onClick={this.changeStation}>
          <SkipNext />
        </IconButton>
      </Card>
    );
  }
}
