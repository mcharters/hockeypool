import React, { PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Draft from '../api/draft.js';

const DraftUI = ({ draft }) => {
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
};

DraftUI.defaultProps = {
  draft: null,
};

export default createContainer(() => {
  const draft = Draft.findOne();
  if (draft) return { draft };
  return { draft: null };
}, DraftUI);
