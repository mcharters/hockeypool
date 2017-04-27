import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import PlayerListItem from './PlayerListItem.jsx';
import Players from '../api/players.js';

const UserTeam = ({ players }) => (
  <ol>
    {players.map(player => (
      <PlayerListItem key={player._id} player={player} />
    ))}
  </ol>
);

UserTeam.propTypes = {
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ userId }) => {
  Meteor.subscribe('players');

  return {
    players: Players.find({ userId }, { sort: { selected: 1 } }).fetch(),
  };
}, UserTeam);
