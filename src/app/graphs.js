import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighStock from "highcharts/highstock";
import Papa from 'papaparse';
import { Button, ButtonGroup } from '@material-ui/core';


// Load Highcharts modules
require("highcharts/modules/exporting")(HighStock);
require('highcharts/modules/export-data')(HighStock); //used for CSV export

//Set global Highcharts options
Highcharts.setOptions({
  lang: {
      thousandsSep: ','
  }
});


const DATA_SERVER_IP = "http://34.94.49.22"
const config = {
  "hashrate": {
    "csv": DATA_SERVER_IP+"/hashrate.csv",
    "title": "Network hashrate",
    "subtitle": "Haiku Per Second (HPS)",
    "series_name": "Network hashrate (HPS)",
    "x_axis_name": "Time",
    "y_axis_name": "Hashrate",
    "y_tooltip_numberFormat": 0,
    "y_tooltip_numberFormat_text": "HPS" 
  },
  "difficulty": {
    "csv": DATA_SERVER_IP+"/difficulty.csv",
    "title": "Network difficulty",
    "subtitle": "",
    "series_name": "Difficulty",
    "x_axis_name": "Time",
    "y_axis_name": "Difficulty",
    "y_tooltip_numberFormat": 0,
    "y_tooltip_numberFormat_text": "" 
  },
  "tcount": {
    "csv": DATA_SERVER_IP+"/tcount.csv",
    "title": "Transaction count",
    "subtitle": "Total number of transactions per block",
    "series_name": "Txcount",
    "x_axis_name": "Time",
    "y_axis_name": "Transaction count",
    "y_tooltip_numberFormat": 0,
    "y_tooltip_numberFormat_text": "" 
  },
  "amount": {
    "csv": DATA_SERVER_IP+"/amount.csv",
    "title": "Sent amount (MCM)",
    "subtitle": "Total number of MCM sent per block",
    "series_name": "Total amount",
    "x_axis_name": "Time",
    "y_axis_name": "Total amount (MCM)",
    "y_tooltip_numberFormat": 0,
    "y_tooltip_numberFormat_text": "MCM" 
  },
  "reward": {
    "csv": DATA_SERVER_IP+"/reward.csv",
    "title": "Block reward (MCM)",
    "subtitle": "Mining reward",
    "series_name": "Block reward",
    "x_axis_name": "Time",
    "y_axis_name": "Reward (MCM)",
    "y_tooltip_numberFormat": 2,
    "y_tooltip_numberFormat_text": "MCM" 
  }
}





function Graphs() {
  const [dataSource, setDataSource] = useState([]);
  const [graphName, setgraphName] = useState("hashrate");

  let graphOptions = {

    chart: {
      type: 'line',
      backgroundColor: {
        linearGradient: [0, 0, 200, 250],
        stops: [
            [0, 'rgb(255, 255, 255)'],
            [1, 'rgb(200, 200, 255)']
        ]
      }
    },

    title: {
      text: config[graphName]["title"]
    }, 

    subtitle: {
      text: config[graphName]["subtitle"]
    }, 

    series: [{
      name: config[graphName]["title"], 
      data: dataSource,
      color: '#4169E1',
      marker: {
        enabled: true,
        radius: 1
      }, 
      step: false
    }],
    
    xAxis: {
      title: {
        text: config[graphName]["x_axis_name"]
      },
      type: 'datetime',
      lineWidth: 0,
      gridLineWidth: 0
    },

    yAxis: {
      title: {
        text: config[graphName]["y_axis_name"]
      },
      lineWidth: 2,
      plotLines: [{
          value: 0,
          width: 1
      }],
      gridLineWidth: 1,
      opposite: false,
      allowDecimals: false,
    },

    rangeSelector: {
      allButtonsEnabled: true,
      buttons: [
        {type: 'day', count: 1, text: '1d', title: 'View 1 day'}, 
        {type: 'week', count: 1, text: '1w', title: 'View 1 week'}, 
        {type: 'month', count: 1, text: '1m', title: 'View 1 month'},
        {type: 'month', count: 3, text: '3m', title: 'View 3 months'},
        {type: 'ytd', text: 'YTD', title: 'View Year To Date'},
        {type: 'year', count: 1, text: '1y', title: 'View 1 year'},
        {type: 'all', text: 'All', title: 'View all'}
      ],
      buttonTheme: {
          width: 40
      }
    },

    tooltip: {
      formatter: function () {
        return '<b>' + config[graphName]["title"] + '</b><br/>' +
           Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
           Highcharts.numberFormat(this.y, config[graphName]["y_tooltip_numberFormat"]) + ' ' + config[graphName]["y_tooltip_numberFormat_text"];
        },
        crosshairs: {
          color: 'green',
          dashStyle: 'LongDash'
        },
        shared: true
    }, 

    credits: {
      enabled: false
    },

    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "separator", "downloadCSV"]
        }
      }
    },

    scrollbar: {
      enabled: false
    }
  }



  //#NOTE: to work without data caching (locally), select the 'Disable cache' button in the Network tab when you inspect page
  //Async function to loop over the chunks read from stream
  //Parses the chunks into csv format and then transformed into pairs for the graphs
  async function readAndParseData(graphname) {
    var dataURI = config[graphname]["csv"]
    const response = await fetch(dataURI)
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')

    //Keep reading in chunks until finished
    let csvText = ""
    let value, done;
    while (!done) {
      ({ value, done } = await reader.read());
      if (done) {
        break
      }
      const csv = decoder.decode(value) // the csv text
      csvText = csvText.concat(csv) //concat new csv chunk
    }

    const results = await Papa.parse(csvText, { header: false }) // object with { data, errors, meta }
    const rows = results.data // array of objects

    //Put data into [[x1,y2], [x2,y2], ...] format
    let values = []
    rows.slice(1).forEach(ele => {
      values.push([Date.parse(ele[0]), parseFloat(ele[2]), ele[1]])
    });

    return values
  }

  //Called when graphName state is changed by button clicks
  useEffect(() => { 
    //Get and set graph data
    async function getGraphData() {
        let graphData = await readAndParseData(graphName)
        setDataSource(graphData)
    }
    getGraphData()
  }, [graphName])
  
  
  return (
//   <div className="App">
    <div style={{width: "80%", marginLeft: "10%"}}>
      <h2 style={{textAlign: "center"}}> Mochimo Network Graphs </h2>
      <br/>
        <ButtonGroup fullWidth variant="text" color="primary" aria-label="text primary button group">
          <Button color={graphName === "hashrate" ? "secondary" : "primary"} onClick={() => setgraphName("hashrate")}>Network Hashrate</Button>
          <Button color={graphName === "difficulty" ? "secondary" : "primary"} onClick={() => setgraphName("difficulty")}>Network Difficulty</Button>
          <Button color={graphName === "tcount" ? "secondary" : "primary"} onClick={() => setgraphName("tcount")}>Block TX count</Button>
          <Button color={graphName === "amount" ? "secondary" : "primary"} onClick={() => setgraphName("amount")}>Block Sent Amount</Button>
          <Button color={graphName === "reward" ? "secondary" : "primary"} onClick={() => setgraphName("reward")}>Block Reward</Button>
        </ButtonGroup>
      <br/>
      <br/>
        {
          <HighchartsReact
            highcharts={HighStock}
            constructorType={"stockChart"}
            options={graphOptions}
          />
        }
    </div>
//   </div>
  );
}

export default Graphs;



//TODOs

//Problem: graph setup is loading before actual data, so when switching between graphs you see old graph data with new graph details.
  // --> check if it's due to mcm server slow upload (copy .csv file to your ec2 server and try)
  // --> if needed, setup loading spinner
//server scripts: updater keeps on shutting down, also need to make sure the Server hosting the .csv files is always up 