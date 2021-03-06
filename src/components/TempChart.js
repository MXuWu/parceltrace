import React from 'react';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';

import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    // paddingTop: "56.25%",
    marginTop: 10,
  }, 
  formControl: {
    marginTop: 20,
    width: 150,
  },
  gridItemCurrent: {
    borderRadius: "25px",
    border: "2px solid #73AD21",
    height: '110px',
    width: '110px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: '20px',
  }, 
  right: {
    marginLeft: 10,
  }, 
  currentTemp: {
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  formContainer:{
    width: 100,
  }
};

class TempChart extends React.Component{

  state={
    tempMenu: false,
    tempOption: 'most recent',
    tempLimit: 20,
    humidityLimit: 80,
  }

  handleChange = (event) => {
    this.setState({tempOption: event.target.value});
  }

  handleTempLimitChange = (event) => {
    console.log(event.target.value);
    this.setState({tempLimit: event.target.value});
  }
  handleHumLimitChange = (event) => {
    this.setState({humidityLimit: event.target.value})
  }

  render () {

    const { classes, tempFeed, initTempFeed, updated } = this.props;
    const { tempLimit, humidityLimit } = this.state;
    
    const feeds = updated ? tempFeed : initTempFeed;
    // console.log(tempFeed);

    let selectFeeds = [];
    // // let lastInd = data.feeds.length - 1;
    // // let lastInd = 114;
    let numFeeds = 20;
    for (let i = 114; i >= (114 - numFeeds); i--) {
      selectFeeds.unshift(feeds[i]);
    }

    let tempData = selectFeeds.map((feed) => {
      let dataPoint = {
        name: feed.created_at, 
        Temperature: feed.field1,
        Humidity: feed.field2, 
      } 
      return dataPoint;
    })


    return (
      <div className={ classes.root}>      
        <ResponsiveContainer      
          aspect={2.5}      
          width='90%'
        >
          <LineChart
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

            <ReferenceLine y={tempLimit} stroke="#0700db" strokeDasharray="3 3" />
            <ReferenceLine y={humidityLimit} stroke="#009637" strokeDasharray="3 3" />

          </LineChart>
        </ResponsiveContainer>

      
        <div className={ classes.right}>
          
          <div className={ classes.currentTemp } style={{marginBottom: '20px'}}>

            <div className={ classes.gridItemCurrent }>
              <Typography 
                variant="display1"
                style={{color: "black"}}
              >
                {tempData[tempData.length-1].Temperature}
              </Typography>
            </div>
            <Typography align="center">
                Latest Temperature
            </Typography>  

            <form >
              <TextField
                style={{width: 140}}
                label="Temperature Limit"
                value={tempLimit}
                onChange={this.handleTempLimitChange}
                type="number"
                className={ classes.textField }
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
              />
            </form>
          </div>

          <div className={classes.currentTemp}>
            <div className={ classes.gridItemCurrent }>
              <Typography 
                variant="display1"
                style={{color: "black"}}
              >
                {tempData[tempData.length-1].Humidity}
              </Typography>
            </div>
            <Typography align="center">
                Latest Humidity
            </Typography>  

            <form >
              <TextField
                style={{width: 140}}
                label="Humidity Limit"
                value={humidityLimit}
                onChange={this.handleHumLimitChange}
                type="number"
                className={ classes.textField }
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
                variant="outlined"
              />
            </form>

          </div>

        {/* <FormControl className={ classes.formControl }>
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
        </FormControl> */}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TempChart);