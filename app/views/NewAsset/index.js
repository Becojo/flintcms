import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newAsset } from '../../actions/assetActions';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import Input from '../../components/Input';
import FileInput from '../../components/FileInput';
import Button from '../../components/Button';

export default class NewAsset extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: null,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = { title: '' };

  onSubmit(e) {
    e.preventDefault();
    const { title, asset } = serialize(this.form, { hash: true });

    this.props.dispatch(newAsset(title));
  }

  render() {
    const links = [
      { label: 'Settings', path: '/admin/settings' },
      { label: 'Assets', path: '/admin/settings/assets' },
    ];

    return (
      <Page name="new-asset" links={links}>
        <TitleBar title="New Asset">
          <Button onClick={this.onSubmit} small>Save</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <form onSubmit={this.onSubmit} ref={(r) => { this.form = r; }}>
              <Input
                name="title"
                label="Asset Title"
                ref={(r) => { this.title = r; }}
                required
                full
              />


            </form>
          </div>
        </div>
      </Page>
    );
  }
}