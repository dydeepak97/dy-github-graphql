# Github Repository Issue Count
[App Demo](https://dy-github-graphql.herokuapp.com/)

## Description:

This is a ReactJS app.
This app can be used to fetch open issues count of a repository using the url of the repository. The app uses GitHub API v4 to fetch the data.

The url entered by user is parsed to extract the pathname. The extracted pathname is of the form `/:owner/:repo`. This is used to build the API request url.

The app makes 3 queries to the GitHub Graphql API. First one is to get total number of issues, second one is to get number of issues updated within a week and the third one is to get the number of issue updated within 24 hours. These three results are stored in state and are used to derive the information needed.


#### Demo
The app is deployed on heroku. To use the app, Click [Here](https://dy-github-graphql.herokuapp.com/)

##### Run locally
To run the app locally, just clone this repo and run following commands: 
  ```
  npm install
  npm start
  ```
  The app can now be used on browser on [localhost:3000](localhost:300)

