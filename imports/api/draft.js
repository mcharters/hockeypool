import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';
import Teams from './teams.js';
import Players from './players.js';

const Draft = new Mongo.Collection('draft');
Draft.NUM_D_REQUIRED = 2;
Draft.TEAM_SIZE = 10;

export default Draft;

if (Meteor.isServer) {
  Meteor.publish('draft', () => Draft.find({}));
}

Meteor.methods({
  'draft.reset'() {
    Teams.remove({});
    Players.remove({});
    Draft.remove({});

    const teamsResult = HTTP.call('GET', 'http://www.nhl.com/stats/rest/team?isAggregate=false&reportType=basic&isGame=false&reportName=teamsummary&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22},{%22property%22:%22wins%22,%22direction%22:%22DESC%22}]&cayenneExp=gameTypeId=2%20and%20seasonId%3E=20182019%20and%20seasonId%3C=20182019');
    teamsResult.data.data.forEach((team) => {
      Teams.insert(team);
    });

    const standingsResult = HTTP.call('GET', 'https://statsapi.web.nhl.com/api/v1/standings/wildCardWithLeaders?hydrate=record(overall),division,conference,team(nextSchedule(team),previousSchedule(team))&season=20182019');

    // add some conference and playoff info to teams
    standingsResult.data.records.forEach((standings) => {
      if (standings.standingsType === 'wildCard') {
        for (let i = 0; i < 2; i += 1) {
          Teams.update(
            { teamId: standings.teamRecords[i].team.id },
            {
              $set: {
                playoffTeam: true,
                conference: standings.conference.name,
                division: 'Wildcard',
                position: i,
              },
            },
          );
        }
      } else {
        standings.teamRecords.forEach((teamRecord, i) => {
          Teams.update(
            { teamId: teamRecord.team.id },
            {
              $set: {
                playoffTeam: true,
                conference: standings.conference.name,
                division: standings.division.name,
                position: i,
              },
            },
          );
        });
      }
    });

    // get players
    const playoffTeams = Teams.find({ playoffTeam: true });
    playoffTeams.forEach((team) => {
      const playersResult = HTTP.call('GET', `http://www.nhl.com/stats/rest/skaters?isAggregate=false&reportType=basic&isGame=false&reportName=skatersummary&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22},{%22property%22:%22goals%22,%22direction%22:%22DESC%22},{%22property%22:%22assists%22,%22direction%22:%22DESC%22}]&factCayenneExp=gamesPlayed%3E=1&cayenneExp=gameTypeId=2%20and%20seasonId%3E=20182019%20and%20seasonId%3C=20182019%20and%20teamId=${team.teamId}`);
      playersResult.data.data.forEach((player) => {
        const newPlayer = player;
        newPlayer.teamId = team._id;
        Players.insert(newPlayer);
      });
    });

    // create draft
    Draft.insert({ started: false });
  },
  'draft.start'() {
    // pick draft order
    const users = Meteor.users.find().fetch().map(user => user._id);
    let m = users.length;
    let i;
    let t;
    while (m) {
      i = Math.floor(Math.random() * (m -= 1));
      t = users[m];
      users[m] = users[i];
      users[i] = t;
    }

    Draft.update({}, { $set: { started: true, pick: 0, order: users, snake: false, round: 1 } });
  },
  'draft.pick'({ playerId }) {
    // pick the player
    const count = Players.find({ userId: this.userId }).count();
    Players.update(
      { _id: playerId },
      {
        $set: {
          userId: this.userId,
          selected: count + 1,
        },
      },
    );

    const draft = Draft.findOne();
    let snake = draft.snake;
    let next = (snake ? draft.pick - 1 : draft.pick + 1);
    let round = draft.round;
    if (next < 0 || next === draft.order.length) {
      round += 1;
      snake = !snake;
      next = (snake ? next - 1 : next + 1);
    }

    Draft.update({}, { $set: { pick: next, snake, round } });
  },
});
