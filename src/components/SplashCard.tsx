import React from "react";
const styles = {
  splashTextStyle: {
    color: "white",
    fontSize: "8em",
    fontWeight: "bold",
    fontFamily: "Nunito",
    textShadow: "5px 5px 10px black",
  },
};
const SplashCard = ({ gameStarted }) => {
  return (
    <div
      style={{ ...styles.splashTextStyle, textAlign: "center" }}
      hidden={gameStarted}
    >
      <span>
        Flashcard
        <br />
        Challenge
      </span>
    </div>
  );
};

export default SplashCard;
