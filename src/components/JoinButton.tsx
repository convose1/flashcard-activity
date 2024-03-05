import React from "react";
import { Button } from "reactstrap";

const JoinButton = ({ joinedState, handleLeaveGame, handleJoinGame }) => {
  return (
    <center>
      <Button
        className="btn rounded-pill col-md-6"
        color={joinedState ? "danger" : "info"}
        size="lg"
        // hidden={gameStarted}
        onClick={joinedState ? handleLeaveGame : handleJoinGame}
        style={{ alignItems: "center" }}
      >
        {joinedState ? "Leave Game" : "Join Game"}
      </Button>
    </center>
  );
};

export default JoinButton;
