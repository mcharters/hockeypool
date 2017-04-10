import React, { PropTypes } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createContainer } from 'meteor/react-meteor-data';

import Teams from '../api/teams.js';
import Team from './Team.jsx';
import Admin from './Admin.jsx';
import Draft from './Draft.jsx';
import Matchup from './Matchup.jsx';
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
      flex: '0 0 20em',
      order: -1,
      overflow: 'auto',
      background: '#eee',
      height: '100vh',
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
      overflow: 'auto',
      height: '100vh',
    }}
  >
    <div style={{ padding: '20px' }} {...props} />
  </div>
);

const Secondary = props => (
  <div
    style={{
      flex: '0 0 20em',
      overflow: 'auto',
      background: '#eee',
      height: '100vh',
    }}
  >
    <div style={{ padding: '20px' }} {...props} />
  </div>
);

const App = ({ teams }) => (
  <Router>
    <Root>
      <Sidebar>
        <SidebarItem>
          <Matchup
            teams={teams}
            conference="Eastern"
            division="Metropolitan"
          />
        </SidebarItem>
        <SidebarItem>
          <Matchup
            teams={teams}
            conference="Eastern"
            division="Atlantic"
          />
        </SidebarItem>
        <SidebarItem>
          <Matchup
            teams={teams}
            conference="Western"
            division="Central"
          />
        </SidebarItem>
        <SidebarItem>
          <Matchup
            teams={teams}
            conference="Western"
            division="Pacific"
          />
        </SidebarItem>
      </Sidebar>
      <Main>
        <Route exact path="/" render={() => <h1>Hockey Pool!</h1>} />
        <Route exact path="/admin" component={Admin} />
        <Route
          path="/teams/:teamId"
          render={({ match }) => (
            teams && teams.length > 0 &&
            <Team
              team={teams.find(team => team.teamAbbrev === match.params.teamId)}
            />
          )}
        />
      </Main>
      <Secondary>
        <AccountsUIWrapper />
        <Draft />
      </Secondary>
    </Root>
  </Router>
);

App.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object),
};

export default createContainer(() => ({
  teams: Teams.find({ playoffTeam: true }).fetch(),
}), App);
