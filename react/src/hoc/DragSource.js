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
      animationDuration: 500,
      isDragging: false,
      isAnimatingDown: 0,
      isAnimatingUp: 0
    };

    draggable = createRef();

    componentDidUpdate(prevProps) {
      this.handleAnimation(prevProps);
    }

    handleAnimation(prevProps) {
      const { position } = this.props;
      let animationDirection = null;

      if (position > prevProps.position) {
        animationDirection = 'Down';
      }

      if (position < prevProps.position) {
        animationDirection = 'Up';
      }

      if (!animationDirection) {
        return null;
      }

      const animationKey = `isAnimating${animationDirection}`;

      this.setState({ [animationKey]: 1 }, () => {
        this.setState({ [animationKey]: 2 });
        setTimeout(() => {
          this.setState({ [animationKey]: 0 });
        }, this.state.animationDuration);
      });
    }

    getComponentStyles() {
      const height = this.draggable.current
        ? this.draggable.current.clientHeight
        : 0;

      const {
        data: { backgroundColor, isEmpty }
      } = this.props;

      const styles = {
        backgroundColor,
        opacity: this.state.isDragging || isEmpty ? 0 : 1
      };

      if (this.state.isAnimatingDown === 1) {
        styles.transform = `translateY(-${height}px)`;
      }

      if (this.state.isAnimatingUp === 1) {
        styles.transform = `translateY(${height}px)`;
      }

      if (this.state.isAnimatingDown === 2 || this.state.isAnimatingUp === 2) {
        styles.transform = 'translateY(0px)';
        styles.transition = `transform ${this.state.animationDuration}ms ease`;
      }

      return styles;
    }

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
      return (
        <div
          className="drag-wrapper"
          style={this.getComponentStyles()}
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
