import { Button } from "reactstrap";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
const questions = require("../apis/questionQuery").questions;

import { socket } from "../socket";
import UserLists from "../components/UserLists";
import QuestionCard from "../components/QuestionCard";
import ResultCard from "../components/ResultCard";
import Countdown from "react-countdown";
import { extractParams } from "../uritls";
import { ParamsType } from "../types";
import JoinButton from "../components/JoinButton";
import SplashCard from "../components/SplashCard";

const FlashCard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = extractParams(searchParams);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState<{
    index: number | null;
    status: string;
  }>({ index: null, status: "" });

  const [joinedState, setJoinedState] = useState(false);
  const [user, setUser] = useState<ParamsType | null>(null);
  const [joinedUsers, setJoinedUsers] = useState(null);
  const [waitingUsers, setWaitingUsers] = useState(null);
  const [winner, setWinner] = useState<ParamsType | null>(null);
  const [gameStarted, setGameState] = useState(false);
  const [isCountdownShow, countdownShow] = useState(false);

  useEffect(() => {
    socket.on("users_state_refreshed", (users) => {
      console.log("users ----", users);

      if (users) {
        setJoinedUsers(users.filter((user) => user.joined));
        setWaitingUsers(users.filter((user) => !user.joined));
      }
    });

    socket.on("join_request_success", (user) => {
      setUser(user);
      setJoinedState(true);
    });

    socket.on("leave_request_success", () => {
      setJoinedState(false);
    });

    socket.on("receive_init_question_index", (param) => {
      setQuestionIndex(param);
    });
    socket.on("receive_current_question_index", (index) => {
      setQuestionIndex(Number(index));
    });

    socket.on("show_winner_and_next_question", (param) => {
      setWinner(param.winner);
      setCorrect({ index: null, status: "" });
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
        setWinner(null);
      }, 2000);
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
    socket.emit("user_open_activity", params);
  }, []);

  const handleMarkOption = (id: string, index: number) => {
    if (index === questions[questionIndex].answer) {
      const newIndex = questionIndex + 1;
      setQuestionIndex(newIndex);
      const payload = {
        questionId: id,
        nextQuestionIndex: newIndex,
        channel_id: params.channel_id,
        user_id: params.user_id,
      };
      setCorrect({ index, status: "correct" });
      socket.emit("show_winner_and_next_question", payload);
    } else {
      setCorrect({ index, status: "incorrect" });
      const { channel_id, user_id } = params;
      const payload = {
        plus: false,
        channel_id,
        user_id,
      };

      socket.emit("change_user_point", payload);
    }
  };

  const handleJoinGame = () => {
    socket.emit("user_join_request", params);
  };

  const handleLeaveGame = () => {
    socket.emit("user_leave_request", {
      user_id: user?.user_id,
      channel_id: user?.channel_id,
    });
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

  const countdownRenderer = ({ seconds, completed }) => {
    return (
      <>
        {completed && (
          <div style={{ ...styles.countdownCardStyle, textAlign: "center" }}>
            <div style={styles.countdownTextStyle}>Let&apos;s go!</div>
          </div>
        )}
        {!completed && (
          <div style={{ ...styles.countdownCardStyle, textAlign: "center" }}>
            <div style={styles.countdownTextStyle}>{seconds}</div>
          </div>
        )}
      </>
    );
  };

  const handleStartGame = () => {
    socket.emit("game_started", params.channel_id);
  };

  const handleCountdownCompleted = () => {
    setTimeout(() => {
      countdownShow(false);
    }, 1500);
  };

  const question = questions[questionIndex];
  return (
    <div className="p-4" style={{ width: "100vw", height: "100vh" }}>
      <div style={styles.flashCardContainerStyle}>
        <div style={styles.cardStyle}>
          <UserLists
            joinedUsers={joinedUsers}
            waitingUsers={waitingUsers}
            handleStartGame={handleStartGame}
            gameStarted={gameStarted}
            joinedState={joinedState}
          />
        </div>

        <div style={styles.cardStyle}>
          <SplashCard gameStarted={gameStarted} />
          {gameStarted && isCountdownShow && (
            <Countdown
              date={Date.now() + 3000}
              renderer={countdownRenderer}
              onComplete={handleCountdownCompleted}
            />
          )}
          <QuestionCard
            content={question.content}
            options={question.options}
            handleMarkOption={handleMarkOption}
            joinedState={joinedState}
            gameStarted={gameStarted}
            hidden={!gameStarted || isCountdownShow || showResult}
            correct={correct}
            questionIndex={questionIndex}
          />
          {winner && (
            <ResultCard
              isYou={winner?.user_id == user?.user_id}
              winner={winner}
              hidden={!joinedState || !showResult}
            />
          )}
        </div>
      </div>
      <JoinButton
        joinedState={joinedState}
        handleLeaveGame={handleLeaveGame}
        handleJoinGame={handleJoinGame}
      />
    </div>
  );
};

const styles = {
  flashCardContainerStyle: {
    display: "flex",
    padding: 20,
    height: "90%",
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
    display: "flex",
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
    margin: "auto",
  },
};

export default FlashCard;
