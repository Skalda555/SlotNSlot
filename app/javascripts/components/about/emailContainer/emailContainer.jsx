import React from 'react';
import styles from './emailContainer.scss';
import Icon from '../../../icons';

class EmailContainer extends React.PureComponent {
  subscribeEmail(e) {
    e.preventDefault();
    const emailInput = this.emailInput.value;
    console.log(emailInput);
    // e-mail validation by regular expression
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(emailInput)) {
      alert('Please input valid e-mail');
    } else {
      // TODO MAKE EMAIL SUBSCRIBE FUNCTION
    }
  }
  render() {
    return (
      <div className={styles.emailComponent}>
        <div className={styles.emailContainer}>
          <div>
            {/*<img
              src="https://d1qh7kd1bid312.cloudfront.net/about/main-theme@2x.png"
              alt="main-theme"
              className={styles.mainTheme}
            />*/}

            <div className={styles.emailTitle}>
              The World First online <span>slot machine platform</span>, running on Ethereum
            </div>
            <div className={styles.subTitle}>
              Make <span>your own Slots</span>! Play others and ruin them!
            </div>

            <form
              onSubmit={e => {
                this.subscribeEmail(e);
              }}
              className={styles.emailForm}
            >
              <div className={styles.emailInputWrapper}>
                <input
                  ref={c => {
                    this.emailInput = c;
                  }}
                  className={styles.emailInput}
                  placeholder="Enter your email address"
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Subscribe
                </button>
              </div>
            </form>

            <div className={styles.linkBlock}>
              <a
                className={styles.btnContainer}
                onClick={() => {
                  window.open('https://github.com', '', '');
                }}
              >
                <Icon className={styles.snsBtn} icon="GITHUB" />
              </a>
              <a
                className={styles.btnContainer}
                onClick={() => {
                  window.open('https://reddit.com', '', '');
                }}
              >
                <Icon className={styles.snsBtn} icon="REDDIT" />
              </a>
              <a
                className={styles.btnContainer}
                onClick={() => {
                  window.open('https://slack.com', '', '');
                }}
              >
                <Icon className={styles.snsBtn} icon="SLACK" />
              </a>
            </div>

            <div className={styles.mouseIcon}>
              <Icon icon="MOUSE_ICON" />
              <div>
                &#x25cf;<br />&#x25cf;<br />&#x25cf;
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default EmailContainer;