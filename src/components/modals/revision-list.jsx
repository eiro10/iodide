import PropTypes from "prop-types";
import React from "react";
import styled from "react-emotion";
import format from "date-fns/format";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const RevisionListContainer = styled("div")`
  overflow: auto;
`;

export class RevisionList extends React.Component {
  static propTypes = {
    revisionList: PropTypes.arrayOf(
      PropTypes.shape({
        created: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired
      })
    ),
    selectedRevisionId: PropTypes.number,
    revisionClicked: PropTypes.func.isRequired
  };

  render() {
    return (
      <RevisionListContainer>
        <List>
          <ListItem
            button
            key="local-changes"
            onClick={() => this.props.revisionClicked(undefined)}
            selected={this.props.selectedRevisionId === undefined}
          >
            <ListItemText primary="Unsaved Changes" />
          </ListItem>
          {this.props.revisionList &&
            this.props.revisionList.map(revision => (
              <ListItem
                button
                key={`revision-${revision.id}`}
                onClick={() => this.props.revisionClicked(revision.id)}
                selected={this.props.selectedRevisionId === revision.id}
              >
                <ListItemText
                  primary={format(
                    new Date(revision.created),
                    "MMM dd, uuuu HH:MM"
                  )}
                />
              </ListItem>
            ))}
        </List>
      </RevisionListContainer>
    );
  }
}
