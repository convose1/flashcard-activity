import { Card, CardBody, CardTitle, Badge } from "reactstrap";
import PropTypes from "prop-types";

const ResultCard = ({ content, answer, winner, currentQuestionNum, hidden }) => {
  const renderWinner = () => {
    if (winner) {
      return (
        <>
          <h3>
            Winner:{" "}
          </h3>
          <img
            src={"assets/images/users/" + winner.name + ".png"}
            className="rounded-circle"
            alt="avatar"
            width="45"
            height="45"
          />
          <h3 className="mb-0">
            {winner.name}
          </h3>
        </>
      );
    } else return null;
  };

  return (
    <Card hidden={ hidden } style={ styles.resultCardStyle }>
      <CardTitle tag="h2" className="text-center p-3 mb-0" style={{ fontWeight: "bold", }}>
        Winner:
      </CardTitle>
      <CardBody className="text-center">
        <img
          srcSet="assets/images/users/user.jpg"
          className="rounded-circle"
          alt="avatar"
          width="100"
          height="100"
        />
        <h3 style={{ fontWeight: "bold", marginTop: 20, }}>user4</h3>
      </CardBody>
    </Card>
  );
};

const styles = {
  resultCardStyle: {
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
};

ResultCard.propTypes = {
  content: PropTypes.string,
  answer: PropTypes.object,
  winner: PropTypes.object,
  currentQuestionNum: PropTypes.number,
  hidden: PropTypes.bool
};

export default ResultCard;
