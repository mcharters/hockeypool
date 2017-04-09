import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Draft from '../api/draft.js';

const DraftUI = ({ draft, currentUser }) => {
  if (!currentUser) {
    return <p>Please log in or create an account to draft!</p>;
  }

  if (!draft) return null;

  if (!draft.started) {
    return <p>The draft has not started. Sit tight!</p>;
  }

  return <p>{'Let\'s go!'}</p>;
};

DraftUI.propTypes = {
  draft: PropTypes.shape({
    started: PropTypes.bool,
  }),
  currentUser: PropTypes.shape({
    username: PropTypes.string,
  }),
};

DraftUI.defaultProps = {
  draft: null,
  currentUser: null,
};

export default createContainer(() => {
  const draft = Draft.findOne();
  return {
    draft: draft || null,
    currentUser: Meteor.user(),
  };
}, DraftUI);
