import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

const Teams = new Mongo.Collection('teams');

if (Meteor.isServer) {
  Meteor.publish('teams', () => Teams.find({ playoffTeam: true }));
}

export default Teams;
