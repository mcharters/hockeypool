import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PlayerListItem from './PlayerListItem.jsx';
import Players from '../api/players.js';
import Draft from '../api/draft.js';

const UserTeam = ({ players }) => {
  const numDSelected = players.filter(p => p.playerPositionCode === 'D').length;
  const numDRequired = Math.max(0, Draft.NUM_D_REQUIRED - numDSelected);

  return (
    <div>
      <h4>My Team</h4>
      <ol>
        {players.map(player => (
          <PlayerListItem key={player._id} player={player} />
        ))}
      </ol>
      <p><i>* defense</i></p>
      <p>{numDRequired} defender{numDRequired === 1 ? '' : 's'} needed</p>
    </div>
  );
};

UserTeam.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ userId }) => {
  Meteor.subscribe('players');

  return {
    players: Players.find({ userId }, { sort: { selected: 1 } }).fetch(),
  };
}, UserTeam);
