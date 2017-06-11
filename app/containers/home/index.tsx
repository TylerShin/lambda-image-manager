import * as React from "react";
const withStyles = require("isomorphic-style-loader/lib/withStyles").default;
const styles = require("./home.scss");

class Home extends React.PureComponent<null, null> {
  public render() {
    return (
      <div className="jumbotron">
        <h1>HOME~</h1>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
