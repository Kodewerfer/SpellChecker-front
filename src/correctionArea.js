import React from 'react';
import Item from './correctionItem';
import _ from 'lodash';

import { CSSTransition, TransitionGroup } from 'react-transition-group';


export default class CorrectionArea extends React.Component {
  renderItems() {
    let corrections = this.props.corrections;
    let wordList = this.props.wordList;
    let possibleAnimations = ['fadeInRight', 'fadeInLeft', 'flash', 'shake'];

    let index = false;
    const itemList = _.map(corrections, (correction, word) => {

      let animation = possibleAnimations[getRandomInt(4)];
      console.log(animation);

      // filter out old corrections
      if (!wordList[word]) {
        return;
      }

      let correctionList = []
      if (correction.length > 4) {
        correctionList = correction.slice(correction.length - 4, correction.length);
      } else {
        correctionList = correction;
      }

      if (index === false) {
        index = 0;
      } else {
        index++;
      }

      return (
        <CSSTransition key={word} in={true} appear={true} timeout={400} classNames={{
          enter: "animated",
          enterActive: animation,
          exit: "animated",
          exitActive: "fadeOutRight",
        }}>
          <Item key={word} displayIndex={index} word={word} correctionList={correctionList} />
        </CSSTransition>

      );


    });

    return itemList;
  }
  render() {
    return (
      <div className="correction-area">
        <TransitionGroup className="correction-items">
          {this.renderItems()}
        </TransitionGroup>
      </div>
    );
  }
}

let getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}