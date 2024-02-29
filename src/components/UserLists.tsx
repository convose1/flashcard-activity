import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import PropTypes from "prop-types";

const UserLists = ({
  joinedUsers,
  handleStartGame,
  gameStarted,
  joinedState,
}) => {

  const renderStartGameButton = () => {
    return (
      <center>
        <Button
          className="btn rounded-pill"
          color="info"
          size="lg"
          hidden={!joinedState || gameStarted}
          onClick={handleStartGame}
          style={{ margin: 10 }}
        >
          Start new game
        </Button>
      </center>
    );
  };

  return (
    <>
      <Card style={{ ...styles.userCardStyle, float: "right" }}>
        <CardTitle tag={"h3"} className="p-1 mb-0 text-center">
          Contestants:
        </CardTitle>
        <CardBody>
          <ListGroup flush style={ styles.userListStyle }>
            {joinedUsers &&
              joinedUsers.map((user, index) => (
                <ListGroupItem
                  key={index}
                  className="d-flex align-items-center p-1"
                  style={ styles.userItemStyle }
                >
                  <div className="d-flex align-items-center p-2">
                    <img
                      // src={user.avatar}
                      src="assets/images/users/user2.jpg"
                      className="rounded-circle"
                      alt="avatar"
                      width="35"
                      height="35"
                    />
                    <div className="ms-3">
                      <h4 className="mb-0">{user.name}</h4>
                    </div>
                  </div>
                  <h5 className="ms-auto">{user.point} points</h5>
                </ListGroupItem>
              ))}
          </ListGroup>
        </CardBody>
        <center>{renderStartGameButton()}</center>
      </Card>
    </>
  );
};

const styles = {
  userCardStyle: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: 20,
    minWidth: 350,
    maxWidth: 350,
    marginTop: "auto",
    marginBottom: "auto",
    marginRight: 50
  },
  userListStyle: {
    margin: 0,
  },
  userItemStyle: {
    backgroundColor: "transparent",
    padding: 0,
  },

};

UserLists.propTypes = {
  joinedUsers: PropTypes.array,
  waitingUsers: PropTypes.array,
  handleStartGame: PropTypes.func,
  gameStarted: PropTypes.bool,
  joinedState: PropTypes.bool,
};

export default UserLists;
