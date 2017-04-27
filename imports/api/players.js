import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const Players = new Mongo.Collection('players');

if (Meteor.isServer) {
  Meteor.publish('players', () => Players.find({}));

  Meteor.publish('players.onTeam', (teamId) => {
    check(teamId, String);
    return Players.find({ teamId });
  });

  Meteor.publish('players.forUser', (userId) => {
    check(userId, String);
    return Players.find({ userId });
  });
}

export default Players;
