import * as React from "react";

export const css = new Set(); // CSS for all rendered React components

class CssInjector extends React.PureComponent<{}, any> {

  public getChildContext() {
    return {
      insertCss(...styles: any[]) {
        if (styles.length === 1 && Object.getOwnPropertyNames(styles[0]).length === 0) {
          return [{}];
        }
        styles.forEach((style) => {
          style._insertCss();
        });
      },
    };
  }

  public render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

(CssInjector as React.ComponentClass<any>).childContextTypes = {
  insertCss: React.PropTypes.func.isRequired,
};

export default CssInjector as React.ComponentClass<any>;
