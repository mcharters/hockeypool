import React, { PropTypes } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Teams from '../api/teams.js';
import Team from './Team.jsx';
import Admin from './Admin.jsx';
import Draft from './Draft.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const Root = props => (
  <div
    style={{
      display: 'flex',
    }}
    {...props}
  />
);

const Sidebar = props => (
  <div
    style={{
      width: '20vw',
      height: '100vh',
      overflow: 'auto',
      background: '#eee',
    }}
    {...props}
  />
);

const SidebarItem = props => (
  <div style={{ padding: '5px 10px' }} {...props} />
);

const Main = props => (
  <div
    style={{
      flex: 1,
      height: '100vh',
      overflow: 'auto',
    }}
  >
    <div style={{ padding: '20px' }} {...props} />
  </div>
);

const App = ({ teams }) => (
  <Router>
    <Root>
      <Sidebar>
        <AccountsUIWrapper />
        {teams.map(team => (
          <SidebarItem key={team._id}>
            <Link to={`/teams/${team._id}`}>
              {team.teamFullName}
            </Link>
          </SidebarItem>
        ))}
      </Sidebar>
      <Main>
        <Route exact path="/" render={() => <h1>Hockey Pool!</h1>} />
        <Route exact path="/admin" component={Admin} />
        <Route
          path="/teams/:teamId"
          render={({ match }) => (
            teams && teams.length > 0 &&
            <Team
              team={teams.find(team => team._id === match.params.teamId)}
            />
          )}
        />
        <Draft />
      </Main>
    </Root>
  </Router>
);

App.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default createContainer(() => ({
  teams: Teams.find({ playoffTeam: true }).fetch(),
}), App);
