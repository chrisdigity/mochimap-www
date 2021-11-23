
import { useEffect, useState } from 'react';
import {
  Card,
  Container,
  FormControlLabel,
  LinearProgress,
  Switch,
  Typography,
  Zoom
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MochimoAddress from './MochimoAddress';
import MochimoBalance from './MochimoBalance';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    'flex-direction': 'column',
    'justify-content': 'end',
    'align-items': 'center',
    'text-align': 'center'
  },
  form: {
    'min-width': '400px',
    width: '60vw',
    display: 'flex',
    margin: theme.spacing(1),
    background: 'transparent',
    'flex-wrap': 'wrap',
    'flex-direction': 'row',
    'justify-content': 'start'
  },
  grow: {
    'flex-grow': 1
  },
  streamTitle: {
    'font-weight': 'bold',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  streamTitleShort: {
    'font-weight': 'bold',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  streamStatus: {
    'min-width': '400px',
    width: '55vw'
  },
  stream: {
    'min-width': '350px',
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
const EventStreamURI = 'https://sg.mochimap.com/stream';
const EventStreamTypes = ['transaction', 'network', 'block'];
const EventStreamDefaults = { transaction: true, block: true };
const EventStreamInterpreter = (message) => {
  const json = JSON.parse(message);
  const { _id, bnum, bhash, event, dsttag, dstaddr, sendtotal } = json;
  switch (event) {
    case 'block':
      return `New Network Block#${bnum}.${bhash.slice(0, 8)}...`;
    case 'network':
      delete json._id;
      delete json.event;
      return `Node ${_id.replace(/-/g, '.')} updated their ` +
        Object.keys(json).filter(key => !key.includes('connect')).join(', ');
    case 'transaction':
      return (
        <>
          <span>New Tx: </span>
          <MochimoBalance value={sendtotal} />
          <span> to </span>
          <MochimoAddress short addr={dstaddr} tag={dsttag} />
        </>
      );
    default: return message;
  }
};

const ApplyDefaults = (defaults) => {
  const base = EventStreamTypes.reduce((obj, type) => ({
    ...obj, [type]: typeof defaults !== 'object' ? defaults : false
  }), {});
  return typeof defaults === 'object' ? Object.assign(base, defaults) : base;
};

export default function MochimoActivityFeed () {
  const [active, setActive] = useState(ApplyDefaults(EventStreamDefaults));
  const [activity, setActivity] = useState([]);
  const [params, setParams] = useState();
  const [status, setStatus] = useState();
  const [stream, setStream] = useState();
  const classes = useStyles();

  const addActivity = (json) => setActivity((state) => {
    while (state.length >= MAXFEEDLEN) state.pop();
    return [Object.assign(json, { index: id++ }), ...state];
  });

  useEffect(() => {
    // define unmount/cleanup function
    const closeStream = () => {
      setStatus('activity stream closed');
      setStream(stream ? stream.close() : undefined);
    };
    // detect changes in selected streams by building and comparing uri
    const formElement = document.querySelector('#stream-type-selection');
    const searchParams = new URLSearchParams(new window.FormData(formElement));
    const stringParams = searchParams.toString();
    const types = stringParams.replace(/=&/g, ' & ').replace(/=/g, '');
    const uri = EventStreamURI + '?' + stringParams;
    // compare against current state, close stream as appropriate
    if (!stringParams && params) closeStream();
    else if (stringParams && params !== stringParams) {
      closeStream();
      // create new stream
      const source = new window.EventSource(uri);
      // set stream event handlers
      source.onopen = () => setStatus(`${types} activity streams open`);
      source.onerror = () => {
        addActivity({ data: '{ "error": "stream was disconnected" }' });
        setActive(ApplyDefaults(false));
      };
      source.onmessage = (message) => {
        if (typeof message === 'object' && message.data) addActivity(message);
      };
      // update params/stream state
      setParams(stringParams);
      setStatus('connecting');
      setStream(source);
    }
    // return unmount/cleanup function
    return closeStream;
  }, [active]);

  return (
    <Container className={classes.root}>
      <form id='stream-type-selection' className={classes.form}>
        <Typography className={classes.streamTitle}>
          Realtime Activity Feed:
        </Typography>
        <Typography className={classes.streamTitleShort}>
          Realtime:
        </Typography>
        <div className={classes.grow} />
        {EventStreamTypes.map((type, index) => (
          <FormControlLabel
            key={index}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            control={
              <Switch
                name={type}
                size='small'
                checked={active[type]}
                onClick={() => {
                  setActive((state) => ({ ...state, [type]: !state[type] }));
                }}
              />
            }
          />
        ))}
      </form>
      <div className={classes.streamStatus}>
        {stream && stream.readyState < 2 ? (
          <LinearProgress color='secondary' />
        ) : ''}
        <strong>⋘ {status} ⋙</strong>
      </div>
      <Container className={classes.stream}>
        {activity.map((message) => {
          return (
            <Zoom key={message.index} in>
              <Card elevation={0}>
                {EventStreamInterpreter(message.data)}
              </Card>
            </Zoom>
          );
        })}
      </Container>
    </Container>
  );
}
