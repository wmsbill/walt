import React from "react";
import PropTypes from "prop-types";
import { Menu, Dropdown } from "semantic-ui-react";

class MenuBar extends React.PureComponent {
  static propTypes = {
    activeItem: PropTypes.string,
    examples: PropTypes.array,
    onMenuClick: PropTypes.func.isRequired,
    onRun: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
  };

  render() {
    const { examples, activeItem, onMenuClick, onRun, onSelect } = this.props;
    return (
      <Menu>
        <Menu.Item
          name="code"
          active={activeItem === "code"}
          onClick={onMenuClick}
        />
        <Menu.Item
          name="JS"
          active={activeItem === "JS"}
          onClick={onMenuClick}
        />
        <Menu.Item
          name="WASM"
          active={activeItem === "WASM"}
          onClick={onMenuClick}
        />
        <Menu.Item
          color="green"
          active={activeItem === "&#9658;"}
          name="&#9658;"
          onClick={onRun}
        />
        <Menu.Menu position="right">
          <Menu.Item>
            <Dropdown
              placeholder="Example"
              selection
              options={examples}
              onChange={onSelect}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default MenuBar;
