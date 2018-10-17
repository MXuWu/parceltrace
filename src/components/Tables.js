import React from 'react';
// import ReactTable from 'react-table';
import MUIDataTable from 'mui-datatables';
// import 'react-table/react-table.css';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root:{
  },
}

class Tables extends React.Component {
  render() {

    const { classes, tempFeed, initTempFeed, updated } = this.props;

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
      let dataPoint = [
        feed.created_at, feed.field1, feed.field2
      ];
      //   name: feed.created_at, 
      //   Temperature: feed.field1,
      //   Humidity: feed.field2, 
      // } 
      return dataPoint;
    })
    console.log('tempData');
    console.log(tempData);
    const columns = [
      {
        name: 'Date',
        // accessor: 'name'
      }, 
      {
        name: 'Temperature',
        // accessor: 'Temperature',
      },
      {
        name: 'Humidity',
        // accessor: 'Humidity',
      }
    ]

    return(
      <MUIDataTable
        title={"Raw Data"}
        data={tempData}
        columns={columns}
      />
    )
  }
}

export default withStyles(styles)(Tables);