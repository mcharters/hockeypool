import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Players from '../api/players.js';

const Admin = ({ users, teams }) => (
  <div className="container">
    <h1>Admin</h1>
    <button
      onClick={(e) => {
        e.preventDefault();
        Meteor.call('draft.reset');
      }}
    >
      Reset App
    </button>
    <button
      onClick={(e) => {
        e.preventDefault();
        Meteor.call('draft.start');
      }}
    >
      Start Draft
    </button>
    <h2>Teams</h2>
    <table cellPadding="5">
      <thead>
        <tr>
          {users && users.map(user => (
            <td key={user._id}>{user.username}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {users && users.map(user => (
            <td key={user._id}>
              <ol>
                {teams[user._id].map(player => (
                  <li key={player._id}>
                    {player.playerName} ({player.playerTeamsPlayedFor})
                  </li>
                ))}
              </ol>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

Admin.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

Admin.defaultProps = {
  users: [],
};

export default createContainer(() => {
  const users = Meteor.users.find().fetch();
  const teams = {};
  users.forEach((user) => {
    teams[user._id] = Players.find({ userId: user._id }, { sort: { selected: 1 } });
  });

  return {
    users,
    teams,
  };
}, Admin);
