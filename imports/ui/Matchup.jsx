import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const TeamLink = ({ team, rank }) => (
  <div>
    <Link to={`/teams/${team.teamAbbrev}`}>
      {team.teamFullName} ({rank})
    </Link>
  </div>
);

TeamLink.propTypes = {
  team: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  rank: PropTypes.number.isRequired,
};

const Vs = ({ high, low, teams }) => {
  const highRank = teams.findIndex(t => t._id === high._id) + 1;
  const lowRank = teams.findIndex(t => t._id === low._id) + 1;

  return (
    <div className="matchup">
      <TeamLink team={high} rank={highRank} />
      <div>vs.</div>
      <TeamLink team={low} rank={lowRank} />
    </div>
  );
};

Vs.propTypes = {
  high: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  low: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Matchup = ({ teams, conference, division }) => {
  if (teams.length === 0) return null;

  const conferenceTeams = teams.filter(t => t.conference === conference);
  conferenceTeams.sort((a, b) => b.points - a.points);

  const divisionTeams = conferenceTeams.filter(t => t.division === division);
  divisionTeams.sort((a, b) => a.position - b.position);

  const wildcardTeams = conferenceTeams.filter(t => t.division === 'Wildcard');
  wildcardTeams.sort((a, b) => a.position - b.position);

  if (conferenceTeams[0]._id === divisionTeams[0]._id) {
    // this division gets the lesser wildcard team
    divisionTeams.push(wildcardTeams[1]);
  } else {
    // this division gets the higher wildcard seed
    divisionTeams.push(wildcardTeams[0]);
  }

  return (
    <div>
      <h3>{division} Division</h3>
      <Vs high={divisionTeams[0]} low={divisionTeams[3]} teams={conferenceTeams} />
      <Vs high={divisionTeams[1]} low={divisionTeams[2]} teams={conferenceTeams} />
    </div>
  );
};

Matchup.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object).isRequired,
  division: PropTypes.string.isRequired,
  conference: PropTypes.string.isRequired,
};

export default Matchup;
