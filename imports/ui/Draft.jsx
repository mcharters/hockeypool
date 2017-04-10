import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Draft from '../api/draft.js';
import Players from '../api/players.js';
import PlayerListItem from './PlayerListItem.jsx';

const DraftUI = ({ draft, currentUser, pickingUser, round, players }) => {
  if (!currentUser) {
    return <p>Please log in or create an account to draft!</p>;
  }

  if (!draft) return null;

  if (!draft.started) {
    return <p>The draft has not started. Sit tight!</p>;
  }

  const picking = currentUser._id === pickingUser._id;
  let pick = null;
  if (picking) {
    pick = <h3>Your pick!</h3>;
  } else {
    pick = <p>Currently picking: {pickingUser.username}</p>;
  }

  return (
    <div>
      <h2>Round {round}</h2>
      {pick}
      <h4>My Team</h4>
      <ol>
        {players.map(player => (
          <PlayerListItem key={player._id} player={player} />
        ))}
      </ol>
      <p><i>* defense</i></p>
    </div>
  );
};

DraftUI.propTypes = {
  draft: PropTypes.shape({
    started: PropTypes.bool,
  }),
  currentUser: PropTypes.shape({
    username: PropTypes.string,
  }),
  pickingUser: PropTypes.shape({
    username: PropTypes.string,
  }),
  round: PropTypes.number,
  players: PropTypes.arrayOf(PropTypes.object),
};

DraftUI.defaultProps = {
  draft: null,
  currentUser: null,
  pickingUser: null,
  round: 1,
  players: [],
};

export default createContainer(() => {
  const draft = Draft.findOne();
  let pickingUser = null;
  let round = 1;
  if (draft && draft.order) {
    round = draft.round;
    const pickId = draft.order[draft.pick];
    pickingUser = Meteor.users.findOne({ _id: pickId });
  }

  return {
    draft: draft || null,
    currentUser: Meteor.user(),
    pickingUser,
    round,
    players: Players.find({ userId: Meteor.userId() }, { sort: { selected: 1 } }).fetch(),
  };
}, DraftUI);
