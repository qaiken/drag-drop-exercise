import React from 'react';
import DragSource from '../hoc/DragSource';

class IncludedModule extends React.Component {
  onIncrement = () => {
    const { slug, onIncrement } = this.props;
    onIncrement(slug);
  };

  onDecrement = () => {
    const { slug, onDecrement } = this.props;
    onDecrement(slug);
  };

  render() {
    const { name, slug, position, count } = this.props;
    const classNames = 'included-module module-' + slug;

    return (
      <li className={classNames}>
        <p className="module-number">Module {position}</p>
        <h2 className="module-name">{name}</h2>
        <div className="exercises">
          <img
            onClick={this.onDecrement}
            src="img/decrement.svg"
            className="decrement"
            alt="Decrement"
          />
          <span className="exercise-count">{count}</span>
          <img
            onClick={this.onIncrement}
            src="img/increment.svg"
            className="increment"
            alt="Increment"
          />
          exercises
        </div>
      </li>
    );
  }
}

export default DragSource(IncludedModule);
