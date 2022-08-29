import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import React from "react";
import axios from "axios";
import qs from "query-string";

import fetch from "./cosmic";

class Index extends React.Component {
  static async getInitialProps() {
    let twitterAccessToken;
    try {
      twitterAccessToken = await TwitterService.obtainAccessToken();
    } catch (error) {
      twitterAccessToken = "";
    }

    return {
      twitterAccessToken,
    };
  }

  state = {
    q: "",
    isLoading: false,
    tweets: [],
    mapLocation: {
      lat: 0.0236,
      lng: 37.9062,
    },
    position: {
      lat: 0.0236,
      lng: 37.9062,
    },
    popular: [],
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.setState({
          position: currentLocation,
          mapLocation: currentLocation,
        });
      });
    }

    fetch.getSearchHistory().then((data) => {
      //   const x = _.orderBy(
      //     data,
      //     (item) => {
      //       return item.metadata.searchCounts;
      //     },
      //     ["desc"]
      //   );
      //   console.log("--x ape--", x);
      this.setState({
        popular: data,
      });
    });
  }

  search() {
    this.setState({
      isLoading: true,
    });

    const q = this.state.q || "news";

    TwitterService.searchTweets({
      accessToken: this.props.twitterAccessToken,
      ...this.state.position,
      q,
    }).then((tweets) => {
      fetch.addHistory(q, tweets.length);
      this.setState({
        tweets,
        isLoading: false,
      });
    });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSearch = (e) => {
    e.preventDefault();

    this.search();
  };

  onChangeLocation = (position) => {
    this.setState(
      {
        position,
      },
      () => {
        this.search();
      }
    );
  };

  onSelect = (title) => {
    this.setState(
      {
        q: title,
      },
      () => {
        this.search();
      }
    );
  };

  render() {
    return (
      <div style={{ marginTop: "24px" }} className="content">
        <Alert severty="info">
          Find tweets around you, Find people on twitter and send them invites
          to your team
        </Alert>
        <div className="search-bar">
          <input
            type="text"
            className="input-search"
            name="q"
            value={this.state.q}
            onChange={this.onChange}
          />
          <button className="btn" onClick={this.onSearch}>
            Search
          </button>
          <div className="popular-categories">
            <p className="popular-topics">Popular topics</p>
            {this.state.popular.map((item, key) => (
              <span
                key={key}
                className="category-item"
                onClick={() => this.onSelect(item.title)}
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>
        <div className="tweet-container">
          {this.state.isLoading && <p>Loading...</p>}
          {!this.state.isLoading &&
            this.state.tweets.map((item, key) => (
              <div key={key} className="tweet-item">
                <img
                  className="profile-image"
                  src={item.user.profile_image_url_https}
                  alt="Profile"
                />
                <p>
                  <a
                    href={`https://twitter.com/${item.user.screen_name}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {item.user.name}
                  </a>
                </p>
                <p className="tweet-text">{item.text}</p>
                <a
                  href={`https://twitter.com/statuses/${item.id_str}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  More...
                </a>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

class TwitterService {
  static obtainAccessToken() {
    const options = {
      url: "https://api.twitter.com/oauth2/token",
      method: "POST",
      headers: {
        Authorization: `Basic Q1dVeGFwb1FnT2U4WlAzMXpkeXZ1NUdQeTpHZm53dlZPajdhc1BRWFBDekw0ZHNPQmE3Qk1LRHNoOHhCa25MYjE5RWtyTmlaWXlQYg==`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        grant_type: "client_credentials",
      }),
    };

    return axios(options).then((res) => res.data.access_token);
  }

  static searchTweets(params) {
    const options = {
      url: `/tweets?${qs.stringify(params)}`,
      method: "GET",
    };

    return axios(options).then((res) => res.data.items);
  }
}

export default Index;
