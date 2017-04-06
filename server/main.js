import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Teams } from '../imports/api/teams.js';
import { Players } from '../imports/api/players.js';

Meteor.startup(() => {
  // code to run on server at startup
  // get teams
  Teams.remove({});
  Players.remove({});

  const teamsResult = HTTP.call('GET', 'http://www.nhl.com/stats/rest/grouped/team/basic/season/teamsummary?cayenneExp=seasonId=20162017%20and%20gameTypeId=2&factCayenneExp=gamesPlayed%3E=1&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22},{%22property%22:%22wins%22,%22direction%22:%22DESC%22}]');
  teamsResult.data.data.forEach((team) => {
    Teams.insert(team);
  });

  const standingsResult = HTTP.call('GET', 'https://statsapi.web.nhl.com/api/v1/standings?leagueId=1&standingsType=wildCardWithLeaders');

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
    const playersResult = HTTP.call('GET', `http://www.nhl.com/stats/rest/grouped/skaters/basic/season/skatersummary?cayenneExp=seasonId=20162017%20and%20gameTypeId=2%20and%20teamId=${team.teamId}&factCayenneExp=gamesPlayed%3E=1&sort=[{%22property%22:%22points%22,%22direction%22:%22DESC%22},{%22property%22:%22goals%22,%22direction%22:%22DESC%22},{%22property%22:%22assists%22,%22direction%22:%22DESC%22}]`);
    playersResult.data.data.forEach((player) => {
      const newPlayer = player;
      newPlayer.teamId = team._id;
      Players.insert(newPlayer);
    });
  });
});
