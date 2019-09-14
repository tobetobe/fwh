import React from "react";
import Curchat from "./component/curChat/curChat";
import Chatlist from "./component/chatList/chatList";
import Sidebar from "./component/sidebar/sideBar";
import Login from "./component/login/login";
import io from "socket.io-client";
import mdui from "mdui";

import { ip } from "./interceptors";
import Logo from "./img/logo.png";

/*
 *
 * 接收websocket消息
 * */
const socket = io(`ws://${ip}`);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.doLogin = this.doLogin.bind(this);
    this.doMsg = this.doMsg.bind(this);
    this.state = {
      isLogin: false,
      msg: "",
      userinfo: {},
      current: ["000"], //默认000，公共聊天室
      choose: "000"
    };
  }

  /*
   * 未登录时只获取000默认群组的信息*/
  componentDidMount() {}

  doLogin(v) {
    this.setState({ isLogin: true, userinfo: { ...v } });
  }

  doMsg(v) {
    this.setState({ msg: v });
    mdui.snackbar({
      message: this.state.msg,
      position: "right-top"
    });
  }

  handleUpdate_avatar(v) {
    let new_userinfo = { ...this.state.userinfo };
    new_userinfo.avatar = v;
    this.setState({ userinfo: new_userinfo });
  }

  render() {
    return (
      <>
        <img src={Logo} alt={"服務號Logo"} />
        <div className="mdui-row">
          <div className="mdui-col-xs-1">
            <Sidebar
              info={this.state}
              handleUpdate_avatar={v => this.handleUpdate_avatar(v)}
            />
          </div>
          <div
            className="mdui-col-xs-3"
            style={{ overflow: "auto", height: "35em" }}
          >
            <Chatlist state={this.state} />
          </div>

          <div
            className="mdui-col-xs-8"
            style={{ float: "right", overflow: "auto", height: "35em" }}
          >
            <Curchat
              socket={socket}
              isLogin={this.state.isLogin}
              username={this.state.username}
              choose={this.state.choose}
              id={"curchat"}
            />
          </div>
          <div
            className="mdui-col-xs-8"
            style={{
              textAlign: "center",
              float: "right",
              marginTop: "1em",
              display: "flex",
              alignItems: "flex-end"
            }}
          >
            <Login
              socket={socket}
              state={this.state}
              isLogin={this.state.isLogin}
              doLogin={v => this.doLogin(v)}
              doMsg={v => this.doMsg(v)}
            />
          </div>
        </div>
      </>
    );
  }
}

export default App;
