import React from 'react';
import Axios from 'axios';
import styles from './emailContainer.scss';
import Icon from '../../../icons';
import CrowdSaleContainer from '../crowdSaleContainer/crowdSaleContainer';

class EmailContainer extends React.PureComponent {
  async subscribeEmail(e) {
    e.preventDefault();
    const emailInput = this.emailInput.value;
    // e-mail validation by regular expression
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(emailInput)) {
      alert('Please input valid e-mail');
    } else {
      try {
        await Axios.post(
          `https://uabahwzd5e.execute-api.us-east-1.amazonaws.com/prod/subscribeMailingList?email=${emailInput}`,
        );
        alert('You are on the subscribe list now');
        this.emailInput.value = '';
      } catch (err) {
        alert(`Failed: ${err.response.data.error}`);
      }
    }
  }

  render() {
    return (
      <div className={styles.emailComponent}>
        <div className={styles.emailContainer}>
          <div>
            <div className={styles.emailTitle}>
              The World First online <span>Slot Machine Platform</span>, running on <span>Ethereum</span>
            </div>
            <div className={styles.subTitle}>
              Make <span>your own Slots</span>! Play on others and ruin them!
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
          </div>
        </div>
        <CrowdSaleContainer />
      </div>
    );
  }
}
export default EmailContainer;
