import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, RadioGroup, Radio , Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

CreateRoomPage.defaultProps = {
    VotesToSkip: 2,
    GuestCanPause: true,
    Update: false,
    roomCode: null,
    updateCallback: () => {},
};

export default function CreateRoomPage (props){

    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState(props.roomCode);
    const [GuestCanPause, setGuestCanPause] = useState(props.GuestCanPause);
    const [VotesToSkip, setVotesToSkip] = useState(props.VotesToSkip);
    const [ErrorMSG, setErrorMSG] = useState("");
    const [SuccessMSG, setSuccessMSG] = useState("");
    const [DefaultVotes, setDefaultVotes] = useState(2);
    const [Update, setUpdate] = useState(props.Update);

    const HandleVotesChange = (event) => {
        setVotesToSkip(parseInt(event.target.value));
    };
    
    const HandleGuestCanPauseChange = event => {
        setGuestCanPause(event.target.checked);
    };

    const HandleRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Votes_To_Skip: VotesToSkip,
                Guest_Can_Pause: GuestCanPause,
            }),
        };
        fetch("/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => navigate('/room/'+ data.code));
    };

    const HandleUpdateButtonPressed = () => {
        const requestOptions = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Votes_To_Skip: VotesToSkip,
            Guest_Can_Pause: GuestCanPause,
            code: roomCode,
          }),
        };
        fetch("/api/update-room", requestOptions)
            .then((response) => {
            if (response.ok) {
                setSuccessMSG("Room updated successfully!");
            } else {
                setErrorMSG("Error updating room...");
            }
        });
        props.updateCallback();
    };


    const RenderCreateButtons = () => {
        return (
          <Grid container spacing={1}>

            <Grid item xs={12} align="center">
              <Button
                color="primary"
                variant="contained"
                onClick={HandleRoomButtonPressed}>
                Create A Room
              </Button>
            </Grid>

            <Grid item xs={12} align="center">
                <Button 
                    color="secondary" 
                    variant="contained" 
                    to="/" 
                    component={Link}>
                    Back
                </Button>
            </Grid>

          </Grid>
        );
    }

    const RenderUpdateButtons = () => {
        return (

            <Grid container spacing={1}>

                <Grid Grid item xs={12} align="center">
                    <Button
                    color="primary"
                    variant="contained"
                    onClick={HandleUpdateButtonPressed}>
                    Update Room
                    </Button>
                </Grid>

        </Grid>
        );
    }

    
    const [title, setTitle] = useState(setUpdate ?  "Update Room" : "Create a Room" );

    return (
        <Grid container spacing={1}>

            <Grid item xs={12} align="center">
                <Collapse 
                    in={ErrorMSG !== "" || SuccessMSG !== ""}>
                    {SuccessMSG !== "" ? (
                        <Alert
                            severity="success"
                            onClose={() => {
                                setSuccessMSG("");
                            }}>
                            {SuccessMSG}
                        </Alert>
                    ) : (
                        <Alert
                            severity="error"
                            onClose={() => {
                                setErrorMSG ("");
                            }}>
                            {ErrorMSG}
                        </Alert>
                    )}
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
                        <div 
                            align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>

                    <RadioGroup 
                        row 
                        defaultValue={GuestCanPause} 
                        onChange={HandleGuestCanPauseChange} >     
                        <FormControlLabel 
                            value="true" 
                            label="Play/Pause"
                            labelPlacement="bottom" 
                            control={<Radio color="primary" />} />
                        <FormControlLabel
                            value="false"
                            label="No Control"
                            labelPlacement="bottom"
                            control={<Radio color="secondary"/>} />
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                        required={true} 
                        type="number" 
                        onChange = {HandleVotesChange}
                        defaultValue = {VotesToSkip}
                        inputProps={{ 
                            min:1, 
                            style: { textAlign: "center" }, 
                        }} 
                    />
                    <FormHelperText>
                        <div  
                            align="center">
                            Votes Required To Skip Songs
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {setUpdate ? RenderUpdateButtons() : RenderCreateButtons() }

        </Grid>
    );
}


