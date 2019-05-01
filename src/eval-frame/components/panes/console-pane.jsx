import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import deepEqual from "deep-equal";
import styled from "react-emotion";

import HelpOutline from "@material-ui/icons/HelpOutline";

import HistoryItem from "./history-item";
import ConsoleInput from "./console/console-input";

import EmptyPaneContents from "./empty-pane-contents";
import OnboardingContent from "../../../shared/components/onboarding-content";
import { getHistoryIdsForConsole } from "../../../shared/state-selectors/history-selectors";

const HelpIcon = styled(HelpOutline)`
  display: inline-block;
  font-size: 18px !important;
`;

export class ConsolePaneUnconnected extends React.Component {
  static propTypes = {
    historyIds: PropTypes.arrayOf(PropTypes.string),
    paneVisible: PropTypes.bool.isRequired
  };
  static whyDidYouRender = true;

  constructor(props) {
    super(props);
    this.historyScrollerRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return (
      !deepEqual(this.props, nextProps) &&
      (this.props.paneVisible || nextProps.paneVisible)
    );
  }

  componentDidUpdate() {
    // scroll to bottom on update
    this.historyScrollerRef.current.scrollTo({
      top: this.historyScrollerRef.current.scrollHeight,
      behavior: "smooth"
    });
  }

  render() {
    let histContents = [];
    if (this.props.historyIds.length) {
      // const historyIds = this.props.historyIdsStringList.split(",");
      histContents = this.props.historyIds.map(historyId => (
        <HistoryItem historyId={historyId} key={historyId} />
      ));
    } else {
      histContents.push(
        <EmptyPaneContents key="onboarding">
          <OnboardingContent fainter>
            You can always get back to this with the little <HelpIcon /> icon in
            the top right.
          </OnboardingContent>
        </EmptyPaneContents>
      );
    }

    return (
      <div
        className="pane-content"
        style={{
          overflow: "hidden"
        }}
      >
        <div
          className="console-pane"
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            maxWidth: "100%",
            height: "100%",
            overflow: "hidden"
          }}
        >
          <div
            className="history-items"
            style={{
              flexGrow: 1,
              maxHeight: "100%",
              overflow: "auto"
            }}
            ref={this.historyScrollerRef}
          >
            {histContents}
          </div>
          <ConsoleInput />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state) {
  return {
    historyIds: getHistoryIdsForConsole(state),
    paneVisible: state.panePositions.ConsolePositioner.display === "block"
  };
}

export default connect(mapStateToProps)(ConsolePaneUnconnected);
