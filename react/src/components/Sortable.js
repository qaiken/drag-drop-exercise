import React, { Children, Component } from 'react';

export default class Sortable extends Component {
  state = {
    draggableIdx: null,
    isCreating: false
  };

  static defaultProps = {
    onDragStart() {},
    onDragEnd() {},
    onDragEnter() {},
    onDrop() {},
    onSort() {}
  };

  componentDidUpdate(prevProps) {
    const { draggableKey } = this.props;

    // because we can't access the draggable info on dragend - only drop
    if (prevProps.draggableKey && !draggableKey) {
      this.setState({ draggableIdx: null });
    }
  }

  getHoverClientY = (e, hoveredEl) => {
    const hoverBoundingRect = hoveredEl.getBoundingClientRect();

    // Determine mouse position - Get pixels to the top
    return e.clientY - hoverBoundingRect.top;
  };

  getHoverMiddleY = hoveredEl => {
    const hoverBoundingRect = hoveredEl.getBoundingClientRect();

    // Get vertical middle
    return (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  };

  isDraggingPastMiddle = (e, hoverIdx, hoveredEl) => {
    // Only perform the move when the mouse has crossed half of the item's height

    const hoverClientY = this.getHoverClientY(e, hoveredEl);
    const hoverMiddleY = this.getHoverMiddleY(hoveredEl);

    // Dragging downwards
    if (this.state.draggableIdx < hoverIdx && hoverClientY < hoverMiddleY) {
      return null;
    }

    // Dragging upwards
    if (this.state.draggableIdx > hoverIdx && hoverClientY > hoverMiddleY) {
      return null;
    }

    return true;
  };

  // Draggable Target

  onDragStart = (draggableIdx, draggableKey) => {
    const { onDragStart } = this.props;
    onDragStart(draggableKey);
    this.setState({ draggableIdx });
  };

  onDragEnd = () => {
    const { onDragEnd } = this.props;
    onDragEnd();
  };

  // Drop Target

  // Sorting
  onDragOver = (e, dropTargetIdx, hoveredEl) => {
    const { onSort } = this.props;

    e.preventDefault();

    if (
      this.state.draggableIdx === dropTargetIdx ||
      !this.isDraggingPastMiddle(e, dropTargetIdx, hoveredEl)
    ) {
      return null;
    }

    onSort(dropTargetIdx, this.state.draggableIdx);
    this.setState({ draggableIdx: dropTargetIdx });
  };

  // Init Transfer
  onDragEnter = (e, dropTargetIdx, hoveredEl) => {
    const { onDragEnter } = this.props;
    const hoverClientY = this.getHoverClientY(e, hoveredEl);
    const hoverMiddleY = this.getHoverMiddleY(hoveredEl);

    e.preventDefault();

    // item is already in the list
    if (this.state.draggableIdx !== null) {
      return null;
    }

    const draggableIdx = Math.max(
      hoverClientY > hoverMiddleY ? dropTargetIdx + 1 : dropTargetIdx - 1,
      0
    );

    // create new item
    onDragEnter(draggableIdx);
    this.setState({ draggableIdx, isCreating: true });
  };

  // Complete Transfer
  onDrop = () => {
    const { onDrop } = this.props;

    if (!this.state.isCreating) {
      return null;
    }

    onDrop(this.state.draggableIdx);
    this.setState({ isCreating: false });
  };

  render() {
    const { children } = this.props;

    return (
      <ul>
        {Children.map(children, (child, idx) => {
          return React.cloneElement(child, {
            position: idx,
            onDragStart: this.onDragStart,
            onDragEnd: this.onDragEnd,
            onDragEnter: this.onDragEnter,
            onDragOver: this.onDragOver,
            onDrop: this.onDrop
          });
        })}
      </ul>
    );
  }
}
