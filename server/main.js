import { Meteor } from 'meteor/meteor';
import Draft from '../imports/api/draft.js';

Meteor.startup(() => {
  // code to run on server at startup
  // get teams
  if (Draft.find({}).count() === 0) {
    Meteor.call('draft.reset');
  }
});
