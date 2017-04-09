import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Players from '../api/players.js';

const Team = ({ team, players }) => (
  <div>
    <h1>{team.teamFullName}</h1>
    <table>
      {players.map(player => (
        <tr key={player._id}><td>{player.playerName}</td></tr>
      ))}
    </table>
  </div>
);

Team.propTypes = {
  team: PropTypes.shape({
    teamFullName: PropTypes.string,
  }).isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(({ team }) => ({
  team,
  players: Players.find({ teamId: team._id }).fetch(),
}), Team);
