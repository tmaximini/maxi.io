---
order: 1
path: '/building-fullscreen-overlays-with-react-16-portals'
title: 'Building a fullscreen overlay with React 16s portal'
subtitle: 'React 16 is here and it has portals'
published: true
date: '20180212'
type: 'post'
tags:
  - React
year: 2018
---

Recently I found myself once again in the situation that I had to build a fullscreen overlay for a website, in this case for displaying a video.
This is probably something every web developer encounters on a regular basis.
As with most programming problems there are many ways to solve this - but as I was reading [React 16's changelog](https://reactjs.org/blog/2017/09/26/react-v16.0.html#portals) recently I thought why giving the newly-added [Portals](https://reactjs.org/docs/portals.html) a shot.

### What is a Portal, really?

A portal is just a DOM-fragment that is not mounted as a direct child or sibling to the current component, but can reside on a completly different part on the DOM. As the docs state _Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component_.

### Let's build the Overlay component

First, let's build a very generic and re-usable `Modal` component that implements the Portal logic.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

// I use the same div here that I mount my app into
// so the modal will be a sibling of the rest of the app
// in the DOM hierachy
const modalRoot = document.getElementById('root');

export default class Modal extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
```

This component does nothing else than creating a div and mouting it as a child of `#root` into our DOM.

Now we build the actual `VideoModal` component that makes use of this generic Modal and adds a little functionality:

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import CssModules from 'react-css-modules';
import { RemoveIcon } from '@components/Shared/Icons/Icons';
import Modal from './Modal';
import classes from './VideoModal.scss';

@CssModules(classes)
export default class VideoModal extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    handleClose: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Modal>
        <div styleName="wrapper">
          <div styleName="inner">
            <button
              onClick={this.props.handleClose}
              styleName="close"
            >
              <RemoveIcon />
            </button>
            {this.props.children}
          </div>
        </div>
      </Modal>
    );
  }
}
```

The two keyparts here is to render the actual children of this component as well as passing a `handleClose` function that is called when the 'X' or `RemoveIcon` is clicked.

Here is the CSS of this component:

```css
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.95);
  height: 100vh;
  width: 100vw;
  z-index: 999;
}

.inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  background: none;
  border: 0;
}
```

### Usage

Now we can use the Component, for example to display fullscreen images or videos after clicking on an item in a list.

Imagine a video list component where we map over an array of items like this:

```javascript
  // rest of component omitted ...

  render() {
    const { stories } = this.props;
    return (
      <div id="video-stories" styleName="wrapper">
        {stories.map((story) => <StoryAvatar key={story.id} story={story} />)}
      </div>
    );
  }
```

Now, the `StoryAvatar` might look something like this:

```javascript
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import VideoModal from '../Modal/VideoModal';

export default class StoryAvatar extends PureComponent {
  static propTypes = {
    story: PropTypes.object.isRequired,
  };

  state = {
    shown: false,
  };

  handleClick = () => {
    const { shown } = this.state;
    this.setState({
      shown: !shown,
    });
  };

  renderModal = () => (
    <VideoModal handleClose={this.handleClick}>
      <iframe
        title="test"
        src="https://player.vimeo.com/video/253742573"
        width="640"
        height="360"
        frameBorder="0"
        allowFullScreen
      />
    </VideoModal>
  );

  render() {
    const { story } = this.props;
    const { seen } = this.state;
    return (
      <div styleName={classnames('story', { seen })}>
        <span styleName="button" onClick={this.handleClick}>
          <span styleName="img">
            <span
              styleName="avatar"
              style={{
                backgroundImage: `url(${story.photo})`,
              }}
            />
          </span>
          <span styleName="info">
            <span styleName="videoname">{story.videotitle}</span>
            <span styleName="username">{story.name}</span>
          </span>
        </span>
        {shown && this.renderModal()}
      </div>
    );
  }
}
```

Here we are using the component's state to decide if a fullscreen overlay is displayed or not. The `handleClick` method toggles the `shown` parameter in the state, which in return is used to conditionally call `this.renderModal`.
