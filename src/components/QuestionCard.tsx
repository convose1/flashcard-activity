/* eslint-disable react/react-in-jsx-scope */
import { Button, Card, CardBody, CardTitle} from "reactstrap";
import PropTypes from "prop-types";

const QuestionCard = ({
  content,
  options,
  handleMarkOption,
  joinedState,
  currentQuestionNum,
  gameStarted,
  hidden,
}) => {
  return (
    <>
      <Card style={styles.quizCardStyle} hidden={ hidden }>
        <CardTitle tag="h4" className="text-left p-2 mb-0">
          {currentQuestionNum} / 15
        </CardTitle>
        <CardTitle tag="h3" className="mb-0 text-center" style={ styles.quizTitleStyle }>
          {content}
        </CardTitle>
        <CardBody className="text-center">
          <div style={{ ...styles.quizBodyStyle, flexDirection: "column" }}>
            {options.map((option: string, index: number) => (
              <div key={index} style={ styles.quizItemStyle }>
                <Button
                  className="btn rounded-pill"
                  color="info"
                  size="lg"
                  block
                  disabled={joinedState && gameStarted ? false : true}
                  onClick={() => handleMarkOption(option, index)}
                  style={ styles.quizButtonStyle }
                >
                  {option}
                </Button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

const styles = {
  quizCardStyle: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: 20,
    minWidth: 400,
    maxWidth: 550,
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 50
  },
  quizTitleStyle: {
    paddingLeft: 70,
    paddingRight: 70,
    fontWeight: "bold",
    fontFamily: "nunito"
  },
  quizBodyStyle: {
    display: "flex",
    alignItems: "stretch"
  },
  quizItemStyle: {
    margin: "10px 50px 10px 50px"
  },
  quizButtonStyle: {
    padding: 5,
    fontWeight: "bold",
    fontSize: "1.5em"
  },
};

QuestionCard.propTypes = {
  content: PropTypes.string,
  options: PropTypes.array,
  handleMarkOption: PropTypes.func,
  joinedState: PropTypes.bool,
  currentQuestionNum: PropTypes.number,
  gameStarted: PropTypes.bool,
  hidden: PropTypes.bool,
};

export default QuestionCard;