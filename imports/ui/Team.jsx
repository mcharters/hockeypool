import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Players } from '../api/players.js';

const Team = ({ team, players }) => (
  <div>
    <h1>{team.teamFullName}</h1>
    <ul>
      {players.map(player => (
        <li key={player._id}>{player.playerName}</li>
      ))}
    </ul>
  </div>
);

export default createContainer(({ team }) => ({
  team,
  players: Players.find({ teamId: team._id }).fetch(),
}), Team);
