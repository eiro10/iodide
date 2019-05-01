import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { get } from "lodash";
import styled from "react-emotion";

import "./react-table-styles.css";

import { serializeForTinyRep } from "./rep-utils/tiny-rep-serializer";

import DefaultRenderer from "./default-handler";
import TinyRep from "./tiny-rep";

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require("@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js");
  whyDidYouRender(React);
}

const TableDetails = styled.div`
  border: solid #e5e5e5;
  border-width: 0px 1px 1px 1px;
  padding: 5px;
`;
const TableDetailsMessage = styled.div`
  color: #999;
  font-style: italic;
  font-family: "Open Sans", sans-serif;
  padding-bottom: ${props => (props.pad ? "3px" : "0px")};
`;

const CellDetails = props => {
  if (props.focusedRow !== undefined && props.focusedCol !== undefined) {
    const focusedPath = `[${props.focusedRow}]["${props.focusedCol}"]`;
    return (
      <TableDetails>
        <TableDetailsMessage pad>
          {`details for ${focusedPath}`}
        </TableDetailsMessage>
        <DefaultRenderer value={get(props.value, focusedPath)} />
      </TableDetails>
    );
  }
  return (
    <TableDetails>
      <TableDetailsMessage>Click a table cell for details</TableDetailsMessage>
    </TableDetails>
  );
};
CellDetails.propTypes = {
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  focusedRow: PropTypes.number,
  focusedCol: PropTypes.string
};

class CellRenderer extends React.PureComponent {
  static propTypes = {
    value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    cellIsFocused: PropTypes.bool.isRequired
  };
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "1px 5px",
          backgroundColor: this.props.cellIsFocused
            ? "rgb(230, 230, 230)"
            : "none"
        }}
      >
        <TinyRep {...serializeForTinyRep(this.props.value)} />
      </div>
    );
  }
}
// CellRenderer.whyDidYouRender = true;

const PX_PER_CHAR = 7;
const MIN_CELL_CHAR_WIDTH = 22;

export default class TableRenderer extends React.PureComponent {
  static propTypes = {
    valueContainer: PropTypes.string.isRequired,
    valueKey: PropTypes.string.isRequired
  };
  static whyDidYouRender = true;

  constructor(props) {
    super(props);
    this.state = { focusedRow: undefined, focusedCol: undefined };
  }

  handleCellClick(rowInfo, column) {
    this.setState({ focusedRow: rowInfo.index, focusedCol: column.id });
  }

  render() {
    // const { value } = this.props;
    const { valueContainer, valueKey } = this.props;
    const value = window[valueContainer][valueKey];

    const columns = Object.keys(value[0]).map(k => ({
      Header: k,
      accessor: k,
      width: Math.max(k.length, MIN_CELL_CHAR_WIDTH) * PX_PER_CHAR,
      Cell: rowInfo => {
        return (
          <CellRenderer
            cellIsFocused={
              this.state.focusedCol === k &&
              this.state.focusedRow === rowInfo.index
            }
            value={rowInfo.value}
          />
        );
      }
    }));

    const pageSize = value.length > 10 ? 10 : value.length;
    return (
      <div>
        <ReactTable
          data={value}
          columns={columns}
          showPaginationTop
          showPaginationBottom={false}
          resizable={false}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          minRows={0}
          defaultPageSize={pageSize}
          getTdProps={(state, rowInfo, column) => {
            return {
              onClick: (e, handleOriginal) => {
                this.handleCellClick(rowInfo, column);
                if (handleOriginal) {
                  handleOriginal();
                }
              }
            };
          }}
        />
        <CellDetails
          value={value}
          focusedRow={this.state.focusedRow}
          focusedCol={this.state.focusedCol}
        />
      </div>
    );
  }
}
