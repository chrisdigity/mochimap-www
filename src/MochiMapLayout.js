
import Moment from 'moment';
import { RouteList } from './MochiMapRoutes';
import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudflare,
  faDiscord,
  faGithub
} from '@fortawesome/free-brands-svg-icons';

export function Header () { return null; }

export function Navbar () {
  return (
    <div className='navbar'>
      <Link to='/explorer'>
        <div className='logo'>
          MochiMap
        </div>
      </Link>
      <div className='navbar_small no_small_nav'>
        <nav className='navlinks'>
          {RouteList.filter(route => route.text).map((item, index) =>
            <NavLink
              activeClassName='nav_selected'
              to={item.path || '/'}
              key={index}
            >{item.text}
            </NavLink>)}
        </nav>
      </div>
      <div className='rgtSect'>
        <nav className='navlinks'>
          {RouteList.filter(route => route.text).map((item, index) =>
            <NavLink
              activeClassName='nav_selected'
              to={item.path || '/'}
              key={index}
            >{item.text}
            </NavLink>)}
        </nav>
        <div className='menu_butt'>
          <div className='mbutt' />
        </div>
      </div>
    </div>
  );
}

export class Footer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      timeHr: Moment().locale('fr').format('hh').toString(),
      timeMin: Moment().locale('fr').format('mm').toString(),
      timeA: Moment().locale('fr').format('a').toString()
    };
  }

  tick () {
    this.state = {
      timeHr: Moment().locale('fr').format('hh').toString(),
      timeMin: Moment().locale('fr').format('mm').toString(),
      timeA: Moment().locale('fr').format('a').toString()
    };
  }

  componentDidMount () {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  render () {
    const tmHr = this.state.timeHr;
    const tmMn = this.state.timeMin;
    const tmA = this.state.timeA;
    const today = Moment().format('dddd, MMMM D, YYYY');
    return (
      <footer className='footer'>
        <div className='ft_sect1'>
          <div className='ft_1'>
            <div className='ft_det'>
              <p>Mochimap</p>
              <p>
                Mochimo network<br />
                Open source explorer
              </p>
            </div>
            <div className='mo_link'>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://mochimo.org'
              >www.mochimo.org
              </a>
            </div>
            <ul className='rights'>
              <li>©2021 Mochimap</li>
            </ul>
          </div>
          <div className='ft_2'>
            <div className='ft_det'>
              <p><sup>by</sup> Chrisd̕ìͤ͞g̷ͭ̚i̧t҉̶̡̳y</p>
            </div>
            <div className='ft_link'>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.cloudflare.com'
              >
                <i><FontAwesomeIcon icon={faCloudflare} size='lg' /></i>
                <p>Protected by Cloudflare</p>
              </a>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/chrisdigity/mochimap.com'
              >
                <i><FontAwesomeIcon icon={faGithub} size='lg' /></i>
                <p>Contribute on Github</p>
              </a>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://discord.gg/7ma6Bk2'
              >
                <i><FontAwesomeIcon icon={faDiscord} size='lg' /></i>
                <p>Contact in Discord</p>
              </a>
            </div>
            <ul className='rights'>
              <li>Terms</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>
        <div className='ft_3'>
          <div className='ft_clock_cont'>
            <ul className='ft_clock'>
              <li>{tmHr}</li>
              <li>:</li>
              <li>
                {tmMn} {tmA}
              </li>
            </ul>
            <div className='ft_date'>{today}</div>
          </div>
          <div className='backUp'>
            <div className='backUp_inn'>⇡</div>
          </div>
        </div>
      </footer>
    );
  }
}
