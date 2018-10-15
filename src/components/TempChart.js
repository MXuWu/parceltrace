import React from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  }, 
  formControl: {
    marginTop: 20,
    width: 150,
  }
};

class TempChart extends React.Component{

  state={
    tempMenu: false,
    tempOption: 'most recent',
  }

  handleChange = (event) => {
    console.log(event.target.name);
    this.setState({tempOption: event.target.value});
  }

  render () {

    const { classes, tempFeed, initTempFeed, updated } = this.props;
    
    const feeds = updated ? tempFeed : initTempFeed;
    // console.log(tempFeed);

    let feedTempData = [];
    // // let lastInd = data.feeds.length - 1;
    // // let lastInd = 114;
    let numFeeds = 20;
    for (let i = 114; i >= (114 - numFeeds); i--) {
      feedTempData.unshift(feeds[i]);
    }

    let tempData = feedTempData.map((feed) => {
      let dataPoint = {
        name: feed.created_at, 
        Temperature: feed.field1,
        Humidity: feed.field2, 
      } 
      return dataPoint;
    })


    return (
      <div className={ classes.root}>          
        <LineChart
          width={600}
          height={300}
          data={tempData}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="Temperature" stroke="#8884d8" activeDot={{r: 4}}/>
          <Line type="monotone" dataKey="Humidity" stroke="#82ca9d" activeDot={{r: 4}}/>
        </LineChart>

        <FormControl className={ classes.formControl }>
          <InputLabel>Period of data</InputLabel>
          <Select
            value={this.state.tempOption}
            onChange={this.handleChange}
          >
            <MenuItem value="last25">
              Last 25 updates
            </MenuItem>
            <MenuItem value='today'>Today</MenuItem>
            <MenuItem value='week'>This week</MenuItem>
            <MenuItem value='month'>This month</MenuItem>
            <MenuItem value='year'>This year</MenuItem>
            <MenuItem value='allTime'>All Time</MenuItem>

          </Select>
        </FormControl>

      </div>
    );
  }
}

export default withStyles(styles)(TempChart);