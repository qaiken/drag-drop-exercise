import React, { Component, createRef } from 'react';

export default Draggable => {
  return class Wrapped extends Component {
    static defaultProps = {
      onDragStart() {},
      onDragEnd() {},
      onDragEnter() {},
      onDragOver() {},
      onDrop() {},
      position: null,
      data: {}
    };

    state = {
      isDragging: false
    };

    draggable = createRef();

    // Draggable Target

    onDragStart = e => {
      const { onDragStart, position: draggableIdx, id } = this.props;
      onDragStart(draggableIdx, id);

      e.dataTransfer.setData('text', id);

      // hide real item after delay so the draggable item is still visible
      setTimeout(() => {
        this.setState({ isDragging: true });
      }, 0);
    };

    onDragEnd = e => {
      const { onDragEnd } = this.props;
      onDragEnd();
      this.setState({ isDragging: false });
    };

    // Drop Target

    onDragEnter = e => {
      const { onDragEnter, position: dropTargetIdx } = this.props;
      onDragEnter(e, dropTargetIdx, this.draggable.current);
    };

    onDragOver = e => {
      const { onDragOver, position: dropTargetIdx } = this.props;
      e.preventDefault();
      onDragOver(e, dropTargetIdx, this.draggable.current);
    };

    onDrop = e => {
      const { onDrop } = this.props;
      e.preventDefault();

      onDrop(e.dataTransfer.getData('text'));
    };

    render() {
      const {
        data: { backgroundColor, isEmpty }
      } = this.props;

      return (
        <div
          className="drag-wrapper"
          style={{
            backgroundColor,
            opacity: this.state.isDragging || isEmpty ? 0 : 1
          }}
          draggable={true}
          ref={this.draggable}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragStart={this.onDragStart}
          onDragOver={this.onDragOver}
          onDragEnd={this.onDragEnd}
        >
          <Draggable {...this.props.data} {...this.props} />
        </div>
      );
    }
  };
};
