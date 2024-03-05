import { Card, CardBody, CardTitle, Badge } from "reactstrap";
import PropTypes from "prop-types";
import { ParamsType } from "../types";

const ResultCard = ({
  winner,
  hidden,
  isYou,
}: {
  winner: ParamsType;
  hidden: boolean;
  isYou: boolean;
}) => {
  return (
    <Card hidden={hidden} style={styles.resultCardStyle}>
      <CardTitle
        tag="h2"
        className="text-center p-3 mb-0"
        style={{ fontWeight: "bold" }}
      >
        {`The Winner is ${isYou ? "You" : winner.username} `}
      </CardTitle>
      <CardBody className="text-center">
        <img
          srcSet={winner.avatar}
          className="rounded-circle"
          alt="avatar"
          width="100"
          height="100"
        />
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
    marginLeft: 50,
  },
};

ResultCard.propTypes = {
  content: PropTypes.string,
  answer: PropTypes.object,
  winner: PropTypes.object,
  currentQuestionNum: PropTypes.number,
  hidden: PropTypes.bool,
};

export default ResultCard;
