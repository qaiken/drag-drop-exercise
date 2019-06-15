import React from 'react';

export default class CourseSavedOverlay extends React.Component {
  render() {
    const { visible } = this.props;
    const classNames = visible ? 'overlay overlay-visible' : 'overlay';

    return (
      <div className={classNames}>
        <img
          src="img/check.svg"
          className="overlay-checkmark"
          alt="Check mark"
        />
        <span className="overlay-text">Course Saved</span>
      </div>
    );
  }
}
