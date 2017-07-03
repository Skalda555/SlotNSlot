import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';
// actions
import { reactScrollTop, leaveScrollTop } from './actions';
// components
import Icon from '../../../icons';
// styles
import styles from './header.scss';

function mapStateToProps(appState) {
  return {
    aboutLayout: appState.aboutLayout,
  };
}

class Header extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleScrollEvent = this.handleScrollEvent.bind(this);
    this.handleScroll = throttle(this.handleScrollEvent, 100);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScrollEvent();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { aboutLayout } = this.props;

    return (
      <div
        style={{
          backgroundColor: aboutLayout.get('isTop') ? 'transparent' : '#222135',
        }}
        className={styles.header}
      >
        <div className={styles.navbarContainer}>
          <Link exact to="/" className={styles.item}>
            <Icon className={styles.logo} icon="SLOT_N_SLOT_LOGO" />
          </Link>
          <ul className={styles.rightNavItemsWrapper}>
            <li className={styles.rightNavItem}>
              <a
                className={styles.item}
                onClick={() => {
                  window.open('http://whitepaper.com', '', '');
                }}
              >
                White Paper
              </a>
            </li>
            <li className={styles.rightNavItem}>
              <a
                className={styles.item}
                onClick={() => {
                  window.open('http://blog.com', '', '');
                }}
              >
                Blog
              </a>
            </li>

            <li className={styles.rightNavItem}>
              <NavLink exact to="/" className={styles.item} activeClassName="active">
                FAQ
              </NavLink>
            </li>
            <li className={styles.rightNavItem}>
              <NavLink exact to="/slot" className={styles.item} activeClassName="active">
                Prototype
              </NavLink>
            </li>
            <li className={styles.rightNavItem}>
              <a className={styles.contributionBtn}>contribution</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  handleScrollEvent() {
    const { dispatch } = this.props;

    const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (parseInt(top, 10) < window.innerHeight) {
      dispatch(reactScrollTop());
    } else {
      dispatch(leaveScrollTop());
    }
  }
}

export default withRouter(connect(mapStateToProps)(Header));