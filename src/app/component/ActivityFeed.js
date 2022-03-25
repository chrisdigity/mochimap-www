
import { useEffect, useState } from 'react';
import {
  Card,
  Container,
  LinearProgress,
  Typography,
  Zoom
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Address, Balance, Properties } from 'app/component/Types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'end',
    alignItems: 'center',
    textAlign: 'center'
  },
  form: {
    minWidth: '400px',
    width: '60vw',
    display: 'flex',
    margin: theme.spacing(1),
    background: 'transparent',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'start'
  },
  grow: {
    flexGrow: 1
  },
  streamTitle: {
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  streamTitleShort: {
    fontWeight: 'bold',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  streamStatus: {
    minWidth: '400px',
    width: '55vw'
  },
  stream: {
    minWidth: '350px',
    width: '60vw',
    '& > div': {
      padding: theme.spacing(0.25),
      background: 'transparent',
      overflow: 'hidden',
      'white-space': 'nowrap',
      'text-overflow': 'ellipsis',
      '&:nth-child(2)': { opacity: '0.9' },
      '&:nth-child(3)': { opacity: '0.8' },
      '&:nth-child(4)': { opacity: '0.7' },
      '&:nth-child(5)': { opacity: '0.6' },
      '&:nth-child(6)': { opacity: '0.5' },
      '&:nth-child(7)': { opacity: '0.4' },
      '&:nth-child(8)': { opacity: '0.3' }
    }
  }
}));

let id = 0;
const MAXFEEDLEN = 8;
const EventStreamURI = 'https://new-api.mochimap.com/stream';

export default function ActivityFeed ({ types }) {
  const [activity, setActivity] = useState([]);
  const [status, setStatus] = useState();
  const [stream, setStream] = useState();
  const classes = useStyles();

  const addActivity = (message) => setActivity((state) => {
    const activity = {};
    if (typeof message !== 'object') {
      activity.data = (<Typography>{message}</Typography>);
    } else {
      const { data } = message;
      const json = JSON.parse(data);
      const { bnum, bhash, eventType, dsttag, dstaddr, ip, sendtotal } = json;
      switch (eventType) {
        case 'block':
          activity.data = (
            <Typography>
              Block&nbsp;
              <Properties inline bnum={bnum} bhash={bhash.slice(0, 16)} />
            </Typography>
          );
          break;
        case 'network':
          delete json.eventType;
          delete json.timestamp;
          delete json.uptimestamp;
          delete json.ip;
          delete json.port;
          delete json.ping;
          delete json.baud;
          if (Object.keys(json).length) {
            activity.data = (
              <Typography display='inline'>
                {ip} updated their {Object.keys(json).join(', ')}
              </Typography>
            );
          }
          break;
        case 'transaction':
          activity.data = (
            <Typography noWrap>
              <Balance value={sendtotal} />
              &nbsp;&#187;&nbsp;
              <Address href inline short wots={dstaddr} tag={dsttag} />
            </Typography>
          );
          break;
      }
    }
    if ('data' in activity) {
      // add message, remove old messages and return new state
      activity.id = `activity-${id++}`;
      state.unshift(activity);
      while (state.length >= MAXFEEDLEN) state.pop();
      return [...state];
    } else return state;
  });

  useEffect(() => {
    // define unmount/cleanup function
    const closeStream = () => {
      setStatus('activity stream closed');
      setStream(stream ? stream.close() : undefined);
    };
    // ensure existing streams are closed
    if (Array.isArray(types)) {
      closeStream();
      // create new stream
      const uri = EventStreamURI + '?' + types.join('&');
      const source = new window.EventSource(uri);
      // set stream event handlers
      source.onopen = () => setStatus(`${types.join('/')} streams open`);
      source.onerror = addActivity;
      source.onmessage = addActivity;
      // update stream state
      setStatus('connecting');
      setStream(source);
    }
    // return unmount/cleanup function
    return closeStream;
  }, [types]);

  return (
    <Container className={classes.root}>
      <div className={classes.streamStatus}>
        <strong>⋘ {status} ⋙</strong>
        {stream && stream.readyState < 2 && (
          <LinearProgress color='error' value={100} variant='determinate' />
        )}
      </div>
      <Container className={classes.stream}>
        {activity.map((message) => {
          return (
            <Zoom key={message.id} in>
              <Card elevation={0}>
                {message.data}
              </Card>
            </Zoom>
          );
        })}
      </Container>
    </Container>
  );
}
