import React, { useState , useEffect, useCallback} from "react";
import { useParams , useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";  
import CreateRoomPage from "./CreateRoomPage";


export default function Room (props) {
    const navigate = useNavigate();

    const[VotesToSkip, setVotesToSkip] = useState(2)
    const[GuestCanPause, setGuestCanPause] =  useState(false)
    const[IsHost, setIsHost] = useState(false)
    const[ShowSettings, setShowSettings] = useState(false)
    const[SpotifyAuthenticated, setSpotifyAuthenticated] = useState(false)
    
    const{roomCode} = useParams()
    
    useEffect(() => {
        getRoomDetails();
    }, []);

    const getRoomDetails = async () => {
        try {
            const response = await fetch(`/api/get-room?code=${roomCode}`);
            if (!response.ok) {
                props.clearRoomCodeCallback();
                navigate("/");
            } else {
                const data = await response.json();
                setVotesToSkip(data.Votes_To_Skip);
                setGuestCanPause(data.Guest_Can_Pause);
                setIsHost(data.Is_Host);
            }
            if (IsHost) {
                authenticateSpotify();
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const authenticateSpotify = () => {
        fetch('/Spotify/is-authenticated')
        .then((response) => response.json())
        .then((data) => {
            setSpotifyAuthenticated(data.status);
            if (!data.status) {
                fetch('/Spotify/get-auth-url')
                .then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url);
                });
            }
        });
    }

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        };
        fetch(`/api/leave-room`, requestOptions)
            .then(_response => {
                props.clearRoomCodeCallback();
                navigate("/");
            }
        ).catch(error => {console.log(error)});
    }

    const updateShowSettings = (value) => {
        setShowSettings(value);
    };

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        VotesToSkip={VotesToSkip}
                        GuestCanPause={GuestCanPause}
                        roomCode={roomCode}
                        updateCallback={getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
                    Close
                </Button>
            </Grid>
        </Grid>
        );
    };

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    };

    
    
    return (
        <Grid container spacing={1}>
            
            <Grid item xs={12} align='center'>
                <Typography variant="h4" component='h4'>
                    Code: {roomCode}
                </Typography>
            </Grid>
            
            <Grid item xs={12} align='center'>
                <Typography variant="h4" component='h4'>
                    Votes: {VotesToSkip}
                </Typography>
            </Grid>
            
            <Grid item xs={12} align='center'>
                <Typography variant="h4" component='h4'>
                    Guest Can Pause: {GuestCanPause.toString()}
                </Typography>
            </Grid>
            
            <Grid item xs={12} align='center'>
                <Typography variant="h4" component='h4'>
                    Host: {IsHost.toString()}
                </Typography>
            </Grid>

            {IsHost ? renderSettingsButton() : null}
            
            <Grid item xs={12} align='center'>
                <Button variant='contained' color ='secondary' onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>

            
        </Grid>
    )
}

