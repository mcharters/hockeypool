import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

const Admin = ({ users }) => (
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
      <tbody />
    </table>
  </div>
);

Admin.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

Admin.defaultProps = {
  users: [],
};

export default createContainer(() => ({
  users: Meteor.users.find().fetch(),
}), Admin);
