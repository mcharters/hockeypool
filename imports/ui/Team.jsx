import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Players from '../api/players.js';

const Team = ({ team, players }) => (
  <div>
    <h1>{team.teamFullName}</h1>
    <table cellPadding="5">
      <thead>
        <tr>
          <td>Name</td>
          <td>Pos</td>
          <td>P</td>
          <td>G</td>
          <td>A</td>
          <td>GP</td>
          <td>+/-</td>
          <td>PIM</td>
          <td>P/GP</td>
          <td>PPG</td>
          <td>PPP</td>
          <td>SHG</td>
          <td>SHP</td>
          <td>GWG</td>
          <td>OTG</td>
          <td>S</td>
          <td>S%</td>
          <td>TOI/GP</td>
        </tr>
      </thead>
      <tbody>
        {players.map(player => (
          <tr key={player._id}>
            <td>{player.playerName}</td>
            <td>{player.playerPositionCode}</td>
            <td>{player.points}</td>
            <td>{player.goals}</td>
            <td>{player.assists}</td>
            <td>{player.gamesPlayed}</td>
            <td>{player.plusMinus}</td>
            <td>{player.penaltyMinutes}</td>
            <td>{player.pointsPerGame}</td>
            <td>{player.ppGoals}</td>
            <td>{player.ppPoints}</td>
            <td>{player.shGoals}</td>
            <td>{player.shPoints}</td>
            <td>{player.gameWinningGoals}</td>
            <td>{player.otGoals}</td>
            <td>{player.shots}</td>
            <td>{player.shootingPctg}</td>
            <td>{player.timeOnIcePerGame}</td>
          </tr>
        ))}
      </tbody>
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
  players: Players.find({ teamId: team._id }, { sort: { points: -1 } }).fetch(),
}), Team);
