import { Button } from "reactstrap";
import { useState, useEffect } from "react";
import UserLists from "../components/UserLists";
import QuestionCard from "../components/QuestionCard";
import ResultCard from "../components/ResultCard";
import Countdown from "react-countdown";
// import ReadyCard from "../components/ReadyCard";

const questions = require("../apis/questionQuery").questions;

import { socket } from "../socket";

const FlashCard = () => {
  const [questionIndex, selectQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, selectOption] = useState({
    content: "",
    correct: false,
  });
  const [joinedState, setJoinedState] = useState(false);
  const [user, setUser] = useState(null);
  const [joinedUsers, setJoinedUsers] = useState(null);
  const [waitingUsers, setWaitingUsers] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameState] = useState(false);
  const [isCountdownShow, countdownShow] = useState(false);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(0);

  useEffect(() => {
    socket.on("users_state_refreshed", (users) => {
      setJoinedUsers(users.filter((user) => user.joined));
      setWaitingUsers(users.filter((user) => !user.joined));
    });

    socket.on("join_request_success", (user) => {
      setUser(user);
      setJoinedState(true);
    });

    socket.on("leave_request_success", () => {
      setJoinedState(false);
    });

    socket.on("receive_init_question_id", (param) => {
      selectQuestion(param);
    });

    socket.on("show_winner_and_next_question", (param) => {
      selectOption({ content: param.answer, correct: true });
      setWinner(param.winner);
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        socket.emit("change_user_point", { plus: true });
        setWinner(null);
        selectQuestion(param.nextQuestionId);
      }, 2000);
    });

    socket.on("receive_current_question_number", (currentQuestionNum) => {
      setCurrentQuestionNum(currentQuestionNum);
    });

    socket.on("game_started", () => {
      countdownShow(true);
      setGameState(true);
    });

    socket.on("game_finished", () => {
      setGameState(false);
    });

    socket.on("receive_game_state", (gameStarted) => {
      setGameState(gameStarted);
    });
  }, []);

  const handleMarkOption = (option: string, index: number) => {
    if (index === questions[questionIndex].answer) {
      socket.emit("show_winner_and_next_question", {
        answer: option,
        nextQuestionId: handleGetNextQuestionId(),
      });
    } else {
      selectOption({ content: option, correct: false });
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        socket.emit("change_user_point", { plus: false });
      }, 2000);
    }
  };

  const handleJoinGame = () => {
    socket.emit("user_join_request");
  };

  const handleLeaveGame = () => {
    socket.emit("user_leave_request", user);
    countdownShow(false);
  };

  const handleGetNextQuestionId = () => {
    const tempIndex: number = Math.floor(Math.random() * questions.length);

    if (tempIndex === questionIndex) {
      return handleGetNextQuestionId();
    } else {
      return tempIndex;
    }
  };

  const handleShowCard = () => {
    const question = questions[questionIndex];

    return (
      <QuestionCard
        content={question.content}
        options={question.options}
        handleMarkOption={handleMarkOption}
        joinedState={joinedState}
        currentQuestionNum={currentQuestionNum}
        gameStarted={gameStarted}
        hidden={!gameStarted || isCountdownShow || showResult}
      />
    );
  };

  const handleShowResult = () => {
    const question = questions[questionIndex];

    return (
      <ResultCard
        content={question.content}
        answer={selectedOption}
        winner={winner}
        hidden={!joinedState || !showResult}
        currentQuestionNum={currentQuestionNum}
      />
    );
  };

  const countdownRenderer = ({ seconds, completed }) => {
    return (
      <>
        {completed && (
          <div style={{ ...styles.countdownCardStyle, textAlign: "center", }}>
              <div style={ styles.countdownTextStyle }>Let&apos;s go!</div>
          </div>
        )}
        {!completed && (
          <div style={{ ...styles.countdownCardStyle, textAlign: "center",  }}>
              <div style={ styles.countdownTextStyle }>{seconds}</div>
          </div>
        )}
      </>
    );
  };

  const renderSplashFont = () => {
    return (
      <div style={{ ...styles.splashTextStyle, textAlign: "center" }} hidden={gameStarted}>
        <span>Flashcard<br/>Challenge</span>
      </div>
    );
  };

  const handleStartGame = () => {
    socket.emit("game_started");
  }; 

  const handleCountdownCompleted = () => {
    setTimeout(() => {
      countdownShow(false);
    }, 1500);
  };

  const renderJoinButton = () => {
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

  return (
    <>
      <div style={ styles.flashCardContainerStyle }>
        <div style={ styles.cardStyle }>
          <UserLists
            joinedUsers={joinedUsers}
            waitingUsers={waitingUsers}
            handleStartGame={handleStartGame}
            gameStarted={gameStarted}
            joinedState={joinedState}
          />
        </div>

        <div style={ styles.cardStyle }>
          { renderSplashFont() }
          { gameStarted && isCountdownShow &&
            <Countdown
              date={Date.now() + 3000}
              renderer={countdownRenderer}
              onComplete={handleCountdownCompleted}
            />
          }
          { handleShowCard() }
          { handleShowResult() }
        </div>
      </div>
      { renderJoinButton() }
    </>
  );
};

const styles = {
  flashCardContainerStyle: {
    display: "flex",
    padding: 20,
    height: "90%"
  },
  countdownCardStyle: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: 20,
    minWidth: 350,
    maxWidth: 550,
    height: 500,
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 50,
    display: "flex"
  },
  countdownTextStyle: {
    color: "white",
    fontSize: "7em",
    fontWeight: "bold",
    fontFamily: "Nunito",
    textShadow: "5px 5px 10px black",
    margin: "auto",
  },
  cardStyle: {
    flex: 1,
    padding: 20,
    margin: "auto"
  },
  splashTextStyle: {
    color: "white",
    fontSize: "8em",
    fontWeight: "bold",
    fontFamily: "Nunito",
    textShadow: "5px 5px 10px black",
  }
};

export default FlashCard;
