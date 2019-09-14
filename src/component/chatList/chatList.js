import React from "react";
import axios from "axios";
import { ip } from "../../interceptors";

class Chatlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: [...this.props.state.current]
      //choose:'000'
    };
  }

  componentDidMount() {
    let avater = document.getElementById("000").getContext("2d");
    avater.fillStyle = "green";
  }

  componentDidCatch(error, info) {
    // 获取到javascript错误
    console.log(error);
    console.log(info);
  }

  /*
   *
   * 生成字母头像*/
  avGenerater = v => {
    const name = v;
    console.log(v);
    let firstName = v.toString().substring(1, 0);

    let tranColor = name => {
      var str = "";
      for (var i = 0; i < name.length; i++) {
        str += parseInt(name[i].charCodeAt(0), 10).toString(16);
      }
      return "#" + str.slice(1, 4);
    };
    const bgColor = tranColor(name);
    console.log(bgColor);
    return bgColor;
  };

  render() {
    return this.props.state.isLogin ? (
      <>
        {/*{
                        this.setState({
                            current: [...this.props.state.userinfo.group]
                        })
                    }*/}
        <ul className="mdui-list">
          {this.state.current.map(v => {
            return (
              <>
                <li className="mdui-list-item mdui-ripple">
                  <div className="mdui-list-item-avatar">
                    <canvas id={v} />
                  </div>
                  <div className="mdui-list-item-content">{v}</div>
                </li>
              </>
            );
          })}
        </ul>
      </>
    ) : (
      <>
        <ul className="mdui-list">
          {this.state.current.map(v => {
            return (
              <>
                <li className="mdui-list-item mdui-ripple">
                  <div className="mdui-list-item-avatar">
                    <canvas id={v} />
                  </div>
                  <div className="mdui-list-item-content">{v}</div>
                </li>
              </>
            );
          })}
        </ul>
      </>
    );
  }
}

export default Chatlist;
