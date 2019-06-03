import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import moment from 'moment';
import url from 'url';
import * as GithubService from './Services/GithubService';
import CountTable from './Components/CountTable';
import SpinnerGroup from './Components/SpinnerGroup';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoUrl: '',
      issueTotal: undefined,
      issueWeek: undefined,
      issueDay: undefined,
      errorMessage: 'Hit Search to get issue counts',
      isLoading: false,
      currentTime: moment().format()
    }
  }

  /**
   * Called when search button is clicked.
   */
  handleSearch = () => {
    // Return and update error message if url field is empty
    if (!this.state.repoUrl) {
      this.setState({
        errorMessage: 'Enter a url first'
      });
      return;
    }

    let repoPath = url.parse(this.state.repoUrl).path;

    // To check if the given url has owner and repoName as path
    if (!repoPath || repoPath.split('/').length < 2) {
      this.setState({
        errorMessage: 'Invalid URL.'
      });
      return;
    }

    // To hide errorMessage and display loading state
    this.setState({
      isLoading: true,
      errorMessage: ''
    });

    // Fetch issues from api.
    GithubService.getTotalIssues(repoPath, this.handleTotalCount)
  }

  handleUrlFieldChange = (event) => {
    this.setState({
      repoUrl: event.target.value
    });
  }

  /**
   * Used as callback to be invoked when when api return total count of issues
   */
  handleTotalCount = (err, res) => {
    let issueCount;

    if (err) {
      this.setState({
        errorMessage: 'Something went wrong',
        issueTotal: undefined,
        isLoading: false
      });
      return;
    }

    if (res.errors) {
      this.setState({
        errorMessage: 'No repository found. Change search URL',
        issueTotal: undefined,
        isLoading: false
      });
      return;
    }

    issueCount = res.data.repository.issues.totalCount;

    if (issueCount === 0) {
      this.setState({
        errorMessage: 'No issues in this repository',
        issueTotal: 0,
        issueWeek: 0,
        issueDay: 0,
        isLoading: false
      });
      return;
    }

    this.setState({
      issueTotal: issueCount,
      errorMessage: '',
      isLoading: false
    });

    this.fetchIssuesWithinWeek();
    // GithubService.getIssuesSince(url.parse(this.state.repoUrl).path, this.state.currentTime, this.handleRepoData);
  }

  /**
   * Used to fetch issue within 7 days
   */
  fetchIssuesWithinWeek = () => {
    let repoPath = url.parse(this.state.repoUrl).path,
      dateTimeWeekAgo = moment(this.state.currentTime).subtract(1, 'weeks').format();

    
    GithubService.getIssuesSince(repoPath, dateTimeWeekAgo, this.handleWeekCount);
  }

  /**
   * Used to fetch issue within 24 hours
   */
  fetchIssuesWithinDay = () => {
    let repoPath = url.parse(this.state.repoUrl).path,
      dateTimeDayAgo = moment(this.state.currentTime).subtract(1, 'days').format();

    GithubService.getIssuesSince(repoPath, dateTimeDayAgo, this.handleDayCount);
  }

  /**
   * Used as callback to be invoked when api returns issue count of within week
   */
  handleWeekCount = (err, res) => {
    let issueCount;

    if (err) {
      this.setState({
        errorMessage: 'Something went wrong',
        issueTotal: undefined,
        isLoading: false
      });
      return;
    }

    issueCount = res.data.repository.issues.totalCount;

    if (issueCount === 0) {
      this.setState({
        issueWeek: 0,
        issueDay: 0,
        isLoading: false
      });
      return;
    }

    this.setState({
      issueWeek: issueCount,
      errorMessage: '',
      // isLoading: false
    });

    this.fetchIssuesWithinDay();
  }

  /**
   * Used as callback to be invoked when api returns issue count of within week
   */
  handleDayCount = (err, res) => {
    let issueCount;

    if (err) {
      this.setState({
        errorMessage: 'Something went wrong',
        issueTotal: undefined,
        isLoading: false
      });
      return;
    }

    issueCount = res.data.repository.issues.totalCount;

    if (issueCount === 0) {
      this.setState({
        issueDay: 0,
        isLoading: false
      });
      return;
    }

    this.setState({
      issueDay: issueCount,
      errorMessage: '',
      isLoading: false
    });
  }

  /**
   * Used as callback function to be invoked when api returns data.
   */
  handleRepoData = (err, data) => {
    let issues;

    if (err) {
      this.setState({
        errorMessage: 'Something went wrong',
        issueList: [],
        isLoading: false
      });
      return;
    }

    // If the data is not array, it means that api did not find a matching repository
    if (!Array.isArray(data)) {
      this.setState({
        errorMessage: 'No repository found. Change search url',
        issueList: [],
        isLoading: false
      });
      return;
    }

    // If array is empty, No issue are open in the repository.
    if (Array.isArray(data) && data.length === 0) {
      this.setState({
        errorMessage: 'No issues in this repository',
        issueList: [],
        isLoading: false
      });
      return;
    }

    issues = data.filter(element => {
      if (element.hasOwnProperty('pull_request')) {
        return false;
      }

      return true;
    });

    // If no problems in data, then update state with data and hide loading state.
    this.setState({
      issueList: issues,
      isLoading: false
    });

  }

  /**
   * Return counts of issue that were opened a week ago or before.
   */
  getIssueBeforeWeek = () => {
    let {issueTotal, issueWeek } = this.state;

    return issueTotal - issueWeek;
  }

  /**
   * Returns count of issues opened within this week but before last 24 hours.
   */
  getIssueWithinWeek = () => {
    let { issueDay, issueWeek } = this.state;

    return issueWeek - issueDay ;
  }

  /**
   * Returns count of issues opened in the last 24 hours.
   */
  getIssueWithinDay = () => {
   return this.state.issueDay;
  }

  render() {
    return (
      <div className="container-fluid text-center">
        <div className='main'>
          <div class="form-group mt-3">
            <h3 className='text-light'>Enter a Github repository URL</h3>
            <input
              type="text"
              className="form-control form-control-lg mt-3"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter URL. Example- https://github.com/dydeepak97/radius-agent-task"
              value={this.state.repoUrl}
              onChange={this.handleUrlFieldChange}
              autoFocus
            />
          </div>
          <button
            className="btn btn-primary btn-lg mt-3"
            onClick={this.handleSearch}
            disabled={this.state.isLoading}
          >
            {
              this.state.isLoading ?
                <div>
                  <span class="spinner-grow spinner-border-sm" role="status" aria-hidden="true"></span>
                </div>
                :
                'Search'
            }
          </button>
          {
            this.state.errorMessage &&
            <h2 className='mt-3 text-muted'>{this.state.errorMessage}</h2>
          }
          {
            !this.state.errorMessage &&
            (this.state.isLoading ?
              <SpinnerGroup /> :
              <CountTable
                total={this.state.issueTotal}
                beforeWeek={this.getIssueBeforeWeek()}
                withinWeek={this.getIssueWithinWeek()}
                withinDay={this.getIssueWithinDay()}
              />)
          }
        </div>

      </div >
    );
  }
}

export default App;
