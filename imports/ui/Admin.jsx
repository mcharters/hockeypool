import React from 'react';
import { Meteor } from 'meteor/meteor';

const Admin = () => (
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
  </div>
);

export default Admin;
