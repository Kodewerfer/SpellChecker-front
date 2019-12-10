import React from 'react';
import InputArea from './inputArea';
import CorrectionArea from './correctionArea';
import { CSSTransition } from 'react-transition-group';
import _ from 'lodash';

// const FETCH_ADDRESS = 'http://localhost:3003/lookup';
const FETCH_ADDRESS = 'http://165.22.239.143:3003/lookup';
// placeholder
// eslint-disable-next-line
const FETCH_ADDRESS_GET = 'http://localhost:3003/lookup/?word=the';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGuideShown: true,
      typingText: '',
      fullText: '',
      corrections: {},
      wordList: {}
    }
  }

  // fetch for corrections, set state.corrections.
  async correctFullText() {

    if (!_.trim(this.state.fullText)) {
      return;
    }

    let data = this.state.fullText;

    let arrText = textParser(data);

    // build or re-build wordlist
    this.buildWordList(arrText);

    for (let i = 0; i < arrText.length; i++) {
      let theWord = arrText[i]
      let res = await this.fetchCorrection(theWord);

      // if the word has been found or if the word already in corrections
      if (res === true) {
        continue;
      }


      let correctionsClone = _.clone(this.state.corrections);
      _.assign(correctionsClone, responseParser(res, theWord));

      this.setState({
        corrections: correctionsClone
      });

    }

  }

  buildWordList(arrText) {
    let wordList = {};
    for (let i = 0; i < arrText.length; i++) {
      wordList[arrText[i]] = true;
    }
    this.setState({
      wordList: wordList
    });
  }

  async fetchCorrection(fetchWord) {

    // filter out words already checked.
    if (this.state.corrections[fetchWord]) {
      return true;
    }

    return fetch(FETCH_ADDRESS, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word: fetchWord
      })
    })
      .then((res) => {
        return res.json();
      })
      .then((resJson) => {

        // if the word is correct
        if (resJson === 'found') {
          return true;
        }

        return resJson;
      })
      .catch((e) => {
        throw e;
      });

  }

  // handle fullText
  handleInputAreaChange(event) {
    let value = event.target.value;
    this.setState({
      fullText: value
    })

    if (value === '') {
      this.setState({
        wordList: {}
      });
    }

    if (this.state.fullText) {
      this.setState({
        isGuideShown: false
      })
    }
  }

  // when press whitespace
  hanleKeyTrigger(event) {
    let theKey = event.key;
    let state = this.state;
    let typingText = state.typingText;

    this.setState({
      typingText: state.typingText + theKey,
    });

    // filter out numbers
    typingText = _.replace(typingText, /[0-9]/g, '');

    // only check spelling when whitespace is pressed and when a new word has been typed.
    if ((theKey === ' ' || theKey === 'Enter') && _.trim(typingText)) {
      this.correctFullText();
      this.setState({
        currentText: '',
      })
    }

    return;
  }

  // when focus or lost focus of the input area.
  handleFocusTrigger(event) {
    this.correctFullText();
  }

  renderGuide() {
    return (
      <div>
        <CSSTransition in={this.state.isGuideShown} appear={this.state.isGuideShown} timeout={600} classNames={{
          appear: "animated",
          appearActive: "rubberBand",
          appearDone: 'animated infinite pulse delay-2s',
          exit: "animated",
          exitActive: "fadeOutRight",
          exitDone: "guide-exit-done"
        }}>
          <div className="guide left">
            <div className="text-box">Type your words here,<br />press <span className="red">Whitespace</span> or <span className='red'>Enter</span> to check.</div>
            <svg className="arrow arrow-left" version="1.1" viewBox="0 0 16 16">
              <g fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1">
                <g id="Group" transform="translate(-96.000000, -336.000000)">
                  <path d="M112,344 L106,339 L106,342 C101.5,342 98,343 96,348 C99,345.5 102,345 106,346 L106,349 L112,344 L112,344 Z M112,344" id="Shape" />
                </g>
              </g>
            </svg>
          </div>
        </CSSTransition>

        <CSSTransition in={this.state.isGuideShown} appear={this.state.isGuideShown} timeout={600} classNames={{
          appear: "animated",
          appearActive: "rubberBand",
          exit: "animated",
          exitActive: "fadeOutLeft",
          exitDone: "guide-exit-done"
        }}>
          <div className="guide right">
            <div className="text-box">If a word <span className='red'> cannot be found in the dictionary</span>,<br />
              possible corrections will be shown here as you type. <br />
              corrections are listed from the most likely to the least. </div>
            <svg className="arrow arrow-left" version="1.1" viewBox="0 0 16 16">
              <g fillRule="evenodd" id="Icons with numbers" stroke="none" strokeWidth="1">
                <g id="Group" transform="translate(-96.000000, -336.000000)">
                  <path d="M112,344 L106,339 L106,342 C101.5,342 98,343 96,348 C99,345.5 102,345 106,346 L106,349 L112,344 L112,344 Z M112,344" id="Shape" />
                </g>
              </g>
            </svg>
          </div>
        </CSSTransition>
      </div>
    );;

  }

  render() {
    return (
      <div className='home-wrapper'>

        <div className="content-wrapper">

          {this.renderGuide()}

          {/* controlled textarea */}
          <InputArea
            inputVal={this.state.fullText}
            whenChange={(event) => this.handleInputAreaChange(event)}
            whenKeyPress={(event) => this.hanleKeyTrigger(event)}
            whenFocusTrigger={(event) => this.handleFocusTrigger(event)}
          />
          <CorrectionArea
            corrections={this.state.corrections}
            wordList={this.state.wordList}
          />

        </div>

      </div>
    )

  }
}

// ------------ Helpers ---------------

let responseParser = (res, theWord) => {

  let correctionEntry = {};

  // if the word cannot be found at all.
  if (_.isUndefined(res)) {
    correctionEntry[theWord] = false;
  } else {
    // unpack dictionaries
    for (let i = 0; i < res.length; i++) {
      if (!res[i].length) {
        correctionEntry[theWord] = false;
      } else {
        correctionEntry[theWord] = res[i];
      }
    }
  }

  return correctionEntry;
}

let textParser = (data) => {
  // eslint-disable-next-line
  let punctuationless = _.replace(data, /[\\\'\+\[\]\|<>?\-,\/#!$%\^&\*;:{}=\_`~()"“”]/g, "");
  punctuationless = _.replace(punctuationless, /\s{2,}/g, " ");
  punctuationless = _.replace(punctuationless, /\n/g, " "); //replace enter key to a whitespace
  punctuationless = punctuationless.toLocaleLowerCase();

  // remove all number
  let numberless = _.replace(punctuationless, /[0-9]/g, '');

  // turn the line into an array.
  // *may have extra whitespaces in*
  numberless = _.trim(numberless);
  let splitWs = numberless.split(' ');

  return splitWs;
}