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
    <h2>Active Users</h2>
    <ul>
      {users && users.map(user => (
        <li key={user._id}>{user.username}</li>
      ))}
    </ul>
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
