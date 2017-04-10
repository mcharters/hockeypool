import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Draft from '../api/draft.js';

const DraftUI = ({ draft, currentUser, pickingUser }) => {
  if (!currentUser) {
    return <p>Please log in or create an account to draft!</p>;
  }

  if (!draft) return null;

  if (!draft.started) {
    return <p>The draft has not started. Sit tight!</p>;
  }

  const picking = currentUser._id === pickingUser._id;
  let pick = null;
  if (picking) {
    pick = <h2>Your pick!</h2>;
  } else {
    pick = <p>Currently picking: {pickingUser.username}</p>;
  }

  return pick;
};

DraftUI.propTypes = {
  draft: PropTypes.shape({
    started: PropTypes.bool,
  }),
  currentUser: PropTypes.shape({
    username: PropTypes.string,
  }),
  pickingUser: PropTypes.shape({
    username: PropTypes.string,
  }),
};

DraftUI.defaultProps = {
  draft: null,
  currentUser: null,
  pickingUser: null,
};

export default createContainer(() => {
  const draft = Draft.findOne();
  let pickingUser = null;
  if (draft && draft.order) {
    const pickId = draft.order[draft.pick];
    pickingUser = Meteor.users.findOne({ _id: pickId });
  }

  return {
    draft: draft || null,
    currentUser: Meteor.user(),
    pickingUser,
  };
}, DraftUI);
