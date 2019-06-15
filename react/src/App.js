import React, { Component } from 'react';
import AvailableModule from './components/AvailableModule';
import CourseSavedOverlay from './components/CourseSavedOverlay';
import IncludedModule from './components/IncludedModule';
import Sortable from './components/Sortable';

export default class App extends Component {
  static defaultProps = {
    modules: {
      'figure-drawing': {
        slug: 'figure-drawing',
        name: 'Figure Drawing',
        backgroundColor: '#f6efff'
      },
      '3d-rendering': {
        slug: '3d-rendering',
        name: '3D Rendering',
        backgroundColor: '#f1ffea'
      },
      'art-education': {
        slug: 'art-education',
        name: 'Art Education',
        backgroundColor: '#e0ffff'
      },
      'art-history': {
        slug: 'art-history',
        name: 'Art History',
        backgroundColor: '#ffecdb'
      },
      'basics-of-pottery': {
        slug: 'basics-of-pottery',
        name: 'Learning the basics of pottery',
        backgroundColor: '#fff0f0'
      },
      'still-life-drawing': {
        slug: 'still-life-drawing',
        name: 'Still-life Drawing',
        backgroundColor: '#fffcee'
      },
      'painting-101': {
        slug: 'painting-101',
        name: 'Painting 101',
        backgroundColor: '#e8f0ff'
      }
    }
  };

  state = {
    draggableKey: null,
    isSaving: false,
    availableModules: [
      { slug: 'figure-drawing', isEmpty: false },
      { slug: '3d-rendering', isEmpty: false },
      { slug: 'art-education', isEmpty: false },
      { slug: 'art-history', isEmpty: false }
    ],
    includedModules: [
      { slug: 'basics-of-pottery', isEmpty: false, count: 0 },
      { slug: 'still-life-drawing', isEmpty: false, count: 0 },
      { slug: 'painting-101', isEmpty: false, count: 0 }
    ]
  };

  handleSave = () => {
    this.setState({ isSaving: true });
    setTimeout(() => this.setState({ isSaving: false }), 1500);
    console.log('Saved Course', this.state.includedModules);
  };

  findIncludedModuleIdx = moduleKey =>
    this.state.includedModules.findIndex(module => module.slug === moduleKey);

  onIncrement = moduleKey => {
    const idx = this.findIncludedModuleIdx(moduleKey);
    const newModules = [...this.state.includedModules];

    ++newModules[idx].count;

    this.setState({ includedModules: newModules });
  };

  onDecrement = moduleKey => {
    const idx = this.findIncludedModuleIdx(moduleKey);
    const newModules = [...this.state.includedModules];

    newModules[idx].count = Math.max(newModules[idx].count - 1, 0);

    this.setState({ includedModules: newModules });
  };

  filterEmpties = module => !module.isEmpty;

  clearEmpties() {
    ['availableModules', 'includedModules'].forEach(key => {
      this.setState({
        [key]: this.state[key].filter(this.filterEmpties)
      });
    });
  }

  onDragStart = draggableKey => {
    this.setState({ draggableKey });
  };

  onDragEnd = () => {
    this.setState({ draggableKey: null });
    this.clearEmpties();
  };

  // Drop Target

  onDragEnter = key => draggableIdx => {
    const newModules = [...this.state[key]];

    newModules.splice(draggableIdx, 0, {
      slug: this.state.draggableKey,
      isEmpty: true,
      count: 0
    });

    this.setState({ [key]: newModules });
  };

  onDrop = key => draggableIdx => {
    const newModules = [...this.state[key]];
    const droppedModule = newModules[draggableIdx];
    newModules[draggableIdx] = { ...droppedModule, isEmpty: false };

    const otherKey =
      key === 'includedModules' ? 'availableModules' : 'includedModules';

    const newOtherModules = this.state[otherKey].filter(module => {
      return module.slug !== droppedModule.slug;
    });

    this.setState({
      [key]: newModules,
      [otherKey]: newOtherModules,
      draggableKey: null
    });
  };

  swapModules(modules, idxA, idxB) {
    const newModules = [...modules];
    const hoverItem = newModules[idxA];

    newModules[idxA] = newModules[idxB];
    newModules[idxB] = hoverItem;

    return newModules;
  }

  sortModules = key => (dropTargetIdx, draggableIdx) => {
    const newModules = this.swapModules(
      this.state[key],
      dropTargetIdx,
      draggableIdx
    );
    this.setState({ [key]: newModules });
  };

  sortIncludedModules = this.sortModules('includedModules');
  sortAvailableModules = this.sortModules('availableModules');

  renderIncludedModules() {
    const { modules } = this.props;

    return (
      <Sortable
        draggableKey={this.state.draggableKey}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onSort={this.sortIncludedModules}
        onDragEnter={this.onDragEnter('includedModules')}
        onDrop={this.onDrop('includedModules')}
      >
        {this.state.includedModules.map(({ slug, isEmpty, count }) => {
          const module = { ...modules[slug], isEmpty, count };
          return (
            <IncludedModule
              key={slug}
              id={slug}
              data={module}
              onIncrement={this.onIncrement}
              onDecrement={this.onDecrement}
            />
          );
        })}
      </Sortable>
    );
  }

  renderAvailableModules() {
    const { modules } = this.props;

    return (
      <Sortable
        draggableKey={this.state.draggableKey}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onSort={this.sortAvailableModules}
        onDragEnter={this.onDragEnter('availableModules')}
        onDrop={this.onDrop('availableModules')}
      >
        {this.state.availableModules.map(({ slug, isEmpty }) => {
          const module = { ...modules[slug], isEmpty };
          return <AvailableModule key={slug} id={slug} data={module} />;
        })}
      </Sortable>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="left-column">
          <hgroup>
            <h1 className="course-setup-header">Course Setup</h1>
            <h2>Select modules to build your new course.</h2>
          </hgroup>
          <div className="available-modules">
            <h3 className="available-modules-header">Available Modules</h3>
            {this.renderAvailableModules()}
          </div>
        </div>
        <div className="right-column">
          <button className="btn btn-save-course" onClick={this.handleSave}>
            Save Course
          </button>
          <div className="field field-course-name">
            <label htmlFor="field-course-name">Course Name</label>
            <input
              type="text"
              id="field-course-name"
              placeholder="Add Course Name Here"
            />
          </div>
          {this.renderIncludedModules()}
        </div>

        <CourseSavedOverlay visible={this.state.isSaving} />
      </div>
    );
  }
}
