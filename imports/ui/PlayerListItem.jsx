import React, { PropTypes } from 'react';

const PlayerListItem = ({ player }) => (
  <li key={player._id}>
    {player.playerPositionCode === 'D' ? '* ' : null}{player.playerName} ({player.playerTeamsPlayedFor})
  </li>
);

PlayerListItem.propTypes = {
  player: PropTypes.shape({
    _id: PropTypes.string,
    playerPositionCode: PropTypes.string,
    playerName: PropTypes.string,
    playerTeamsPlayedFor: PropTypes.string,
  }).isRequired,
};

export default PlayerListItem;
