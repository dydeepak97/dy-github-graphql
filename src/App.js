import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import moment from 'moment';
import { getIssuesForRepository } from './Services/GithubService';
import CountTable from './Components/CountTable';
import SpinnerGroup from './Components/SpinnerGroup';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoUrl: '',
      issueList: [],
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

    // To hide errorMessage and Display loading state
    this.setState({
      isLoading: true,
      errorMessage: ''
    });

    // Fetch issues from api.
    getIssuesForRepository(this.state.repoUrl, this.handleRepoData)
  }

  handleUrlFieldChange = (event) => {
    this.setState({
      repoUrl: event.target.value
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

    issues = data.filter( element => {
      if(element.hasOwnProperty('pull_request')){
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
    let { issueList } = this.state,
      count = 0;
    issueList.forEach(issue => {
      if (moment(issue.created_at).format() < moment(this.state.currentTime).subtract(1, 'weeks').format()) {
        count++;
      }
    });

    return count;
  }

  /**
   * Returns count of issues opened within this week but before last 24 hours.
   */
  getIssueWithinWeek = () => {
    let { issueList } = this.state,
      count = 0;
    issueList.forEach(issue => {
      if (moment(issue.created_at).format() > moment(this.state.currentTime).subtract(1, 'weeks').format() &&
        moment(issue.created_at).format() < moment(this.state.currentTime).subtract(1, 'days').format()) {
        count++;
      }
    });

    return count;
  }

  /**
   * Returns count of issues opened in the last 24 hours.
   */
  getIssueWithinDay = () => {
    let { issueList } = this.state,
      count = 0;
    issueList.forEach(issue => {
      if (moment(issue.created_at).format() > moment(this.state.currentTime).subtract(1, 'days').format()) {
        count++;
      }
    });

    return count;
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
                total={this.state.issueList.length}
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
