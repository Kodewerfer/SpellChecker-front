import React from "react";
import _ from 'lodash';

export default class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: this.props.displayIndex ? false : true
    }
  }

  handleClick(event) {
    event.preventDefault();

    this.setState({
      isExpanded: this.state.isExpanded ? false : true
    });

  }

  renderDetails() {
    let details = [];
    let corrections = this.props.correctionList;

    if (!corrections) {
      return (<span className='noRes'><h5>No results</h5></span>)
    }

    let frontSize = 3;
    for (let i = corrections.length - 1; i >= 0; i--) {

      // must capitialize the fist letter of the var.
      let FontTage = `h${frontSize}`

      details.push(
        <div key={i}>
          <span className="correct"><FontTage>{corrections[i]['word']}</FontTage></span>
          <span className="hitCount">Hit count: {corrections[i]['hits']}</span>
        </div>
      )

      frontSize++;
    }

    return details;
  }

  render() {

    if (this.state.isExpanded) {
      return (<div className='correction-item expanded' >
        <a href="" onClick={(event) => this.handleClick(event)}>
          <div className={this.props.correctionList ? "details" : "details noRes"}>
            <span className="original"><h3>{this.props.word}</h3></span>
            <div className='corrections'>

              {this.renderDetails()}

            </div>
          </div>
        </a>

      </div >);
    }

    return (
      <div className='correction-item'>
        <a href="" onClick={(event) => this.handleClick(event)}>
          <div className="slider">
            <span className="slider-head"></span>
          </div>
          <h3><span className='original'>{this.props.word}</span> - <span className={this.props.correctionList ? 'correct' : 'noRes'}>{this.props.correctionList ? _.last(this.props.correctionList)['word'] : '?'}</span></h3>
        </a>
      </div>
    );
  }
}