
import Moment from 'moment';
import RouteList from './MochiMapRoutes';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export function Header () {}

export function Navbar () {
  return (
    <div className='navbar'>
      <div className='logo'>Mochimap</div>
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
    this.setState({
      timeHr: Moment().locale('fr').format('hh').toString(),
      timeMin: Moment().locale('fr').format('mm').toString(),
      timeA: Moment().locale('fr').format('a').toString()
    });
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
                Blockchain explorer for
                <br /> Mochimo cryptocurrency
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
              <p>By chris digity</p>
            </div>
            <div className='ft_link'>
              <a target='_blank' href='#'>
                <i class='fa fa-twitter' />
                <p>twitter</p>
              </a>
              <a target='_blank' href='#'>
                <i class='fa fa-github' />
                <p>github</p>
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
