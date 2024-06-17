import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import {
  Link,
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useParams,
} from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
      loading: true,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  }


  createRouter() {
    return createBrowserRouter([
      {
        path: "/",
        element: this.state.roomCode ? (
          <Navigate to={`/room/${this.state.roomCode}`} />
        ) : (
          <RenderMainSection />
        ),
      },
      { path: "/join", element: <RoomJoinPage /> },
      { path: "/create", element: <CreateRoomPage /> },
      {
        path: "/room/:roomCode",
        element: (
          <RoomWrapper
            currentRoomCode={this.state.roomCode}
            leaveRoomCallback={this.clearRoomCode}
          ></RoomWrapper>
        ),
      }
    ]);
  }

  clearRoomCode() {
    this.setState({
      roomCode: null,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <Grid
          container
          spacing={3}
          alignItems={"center"}
          alignContent={"center"}
        >
          <Grid item xs={12} align="center">
            <Typography component="h3" variant="h3">
              Loading...
            </Typography>
          </Grid>
        </Grid>
      );
    }
    const router = this.createRouter();
    return <RouterProvider router={router}></RouterProvider>;
  }
}

function RoomWrapper(props) {
  return props.currentRoomCode === useParams().roomCode ? (
    <Room
      roomCode={props.currentRoomCode}
      leaveRoomCallback={props.leaveRoomCallback}
    />
  ) : (
    <Navigate to={`/room/${props.currentRoomCode}`} />
  );
}

function RenderMainSection() {
  return (
    <Grid container spacing={3} alignItems={"center"} alignContent={"center"}>
      <Grid item xs={12} align="center">
        <Typography component="h3" variant="h3">
          Music Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup
          color="primary"
          variant="contained"
          aria-label="contained primary button group"
          margin="10px"
        >
          <Button color="primary" to="/join" component={Link}>
            Join Room
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create Room
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}
