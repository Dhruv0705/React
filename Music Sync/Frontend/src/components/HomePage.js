import React, { useState, useEffect, StrictMode, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";
import Room from './Room';

export default function HomePage() {

  const [roomCode, setRoomCode] = useState(null);
  const [redirectToRoom, setRedirectToRoom] = useState(false);

  const fetchDataAndNavigate = async () => {
    const response = await fetch("/api/user-in-room");
    const data = await response.json();
    setRoomCode(data.code);
    if (data.code) {
      setRedirectToRoom(true);
    }
  }

  useEffect(() => {
    fetchDataAndNavigate();
  }, []);

  const clearRoomCode = useCallback(() => {
    setRoomCode(null)
  }, [setRoomCode])

  return (
    <StrictMode>
      <Router>
        <Routes>
          <Route exact path="/" element={
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                  <Typography variant="h3" compact="h3">
                    Music Sync
                  </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                  <ButtonGroup disableElevation variant="contained" color="primary">
                  <Button color="primary" component={Link} to="/join">
                      Join a Room
                    </Button>
                    <Button color="secondary" component={Link} to="/create">
                      Create a Room
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </>
          } />
          <Route path="/join" element={<JoinRoomPage/>} />
          <Route path="/create" element={<CreateRoomPage/>} />
          <Route path='/room/:roomCode' element={<Room clearRoomCodeCallback={clearRoomCode} />} />
        </Routes>
      </Router>
    </StrictMode>
  );
}




/*  <Route path='/room/:roomCode' element={<Room clearRoomCodeCallback={clearRoomCode} />} />  */
/*  <Route path="/room/:roomCode/" render={(props) => { return <Room {...props} leaveRoomCallback={this.clearRoomCode} }} /> */
