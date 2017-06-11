import * as React from "react";
const withStyles = require("isomorphic-style-loader/lib/withStyles").default;
const styles = require("./app.scss");

class App extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={styles.appWrapper}>
        <div className={styles.contentWrapper}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(App);
