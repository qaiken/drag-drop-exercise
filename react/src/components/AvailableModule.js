import React from 'react';
import DragSource from '../hoc/DragSource';

class AvailableModule extends React.Component {
  render() {
    const { slug, name } = this.props;
    const classNames = 'available-module module-' + slug;
    return (
      <li className={classNames}>
        <span className="name">{name}</span>
      </li>
    );
  }
}

export default DragSource(AvailableModule);
