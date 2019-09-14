import React from "react";
import axios from "axios";
import mdui from "mdui";
import { ip } from "../../interceptors";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      psw: "",
      repsw: "",
      //isLogin: false,
      msg: "你还没有登陆qwq", //气泡提示
      textArea: ""
      //sendTo:'000'
    };
  }

  componentDidMount() {
    /*
     *
     * 用户免密登录验证*/
    const userToken = localStorage.getItem(`userToken`);
    //axios.defaults.headers.common["Authorization"] = userToken;
    if (userToken) {
      axios({
        url: `http://${ip}/auth`,
        method: `post`,
        data: `免密登錄認證`
      }).then(res => {
        console.log(res);
        this.setState({ msg: "免密登录成功" });
        this.props.doLogin(res.data.data);
        this.setToken(res.data.jwtoken);
      });
    }
  }
  /*
   *
   * 用户输入*/
  handleInput = (key, v) => {
    this.setState({
      [key]: v.target.value
    });
    //console.log(this.state)
  };

  setToken = v => {
    localStorage.setItem("userToken", v);
  };

  /**
   *
   * {用户登录}
   * @memberof Login
   */
  handleLogin = () => {
    let username = this.state.username;
    let psw = this.state.psw;
    let data = { username, psw };
    axios
      .post(`http://${ip}/login`, data)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          if (res.data.code === 1) {
            this.setState({ msg: "用户名或密码错误" });
            this.props.doMsg("用户名或密码错误");
          } else {
            this.setState({ msg: "登录成功" });
            this.props.doLogin(res.data.data);
            this.setToken(res.data.jwtoken);
          }
        } else {
          console.log(res.status);
          this.setState({ msg: "好像发生了一些错误" });
        }
      })
      .catch(e => console.log("Error", e));
  };
  /*
   *
   * 用户注册*/
  handleRegister = () => {
    let username = this.state.username;
    let psw = this.state.psw;
    let repsw = this.state.repsw;
    if (psw === repsw) {
      let data = { username, psw };
      axios
        .post(`http://${ip}/register`, data)
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.code === 1) {
              this.setState({ msg: "用户已存在" });
              mdui.snackbar({
                message: this.state.msg,
                position: "right-top"
              });
            } else {
              this.setState({ msg: "注册成功" });
              this.props.doLogin(res.data.data);
              this.setToken(res.data.jwtoken);
              mdui.snackbar({
                message: this.state.msg,
                position: "right-top"
              });
            }
          } else {
            console.log(res.status);
            this.setState({ msg: "好像发生了一些错误" });
            mdui.snackbar({
              message: this.state.msg,
              position: "right-top"
            });
          }
        })
        .catch(e => console.log("Error", e));
    } else {
      this.setState({ msg: "请确认两次密码相同" });
      mdui.snackbar({
        message: this.state.msg,
        position: "right-top"
      });
    }
  };
  /*
   *
   * 发送消息*/
  handleSend = () => {
    const defaultValue = "";
    const errorValue = "输入信息不能伟空或仅含空格";
    console.log(this.props.state);
    if (this.state.textArea.trim() === "") {
      //document.getElementById("msg").value = errorValue
      mdui.snackbar({
        message: errorValue,
        position: "right-top"
      });
    } else {
      this.props.socket.emit("sendMsg", {
        content: this.state.textArea,
        from: this.props.state.userinfo,
        to: this.props.state.choose,
        time: new Date().toLocaleString()
      });
      this.setState({ textArea: "" });
      document.getElementById("msg").value = defaultValue;
    }
  };

  render() {
    return this.props.isLogin ? (
      <>
        <div className="mdui-textfield mdui-col-xs-11">
          <textarea
            className="mdui-textfield-input"
            rows="1"
            placeholder="Message"
            onChange={v => this.handleInput("textArea", v)}
            id={"msg"}
          />
        </div>
        <button
          className="mdui-btn mdui-btn-icon mdui-ripple"
          onClick={() => this.handleSend()}
        >
          <i className="mdui-icon material-icons">send</i>
        </button>
      </>
    ) : (
      <>
        <>
          <button
            className="mdui-btn mdui-btn-raised mdui-btn-dense mdui-ripple mdui-color-theme-accent"
            mdui-dialog="{target: '#loginWindow'}"
            style={{ marginRight: "2em" }}
          >
            你还没有登陆
          </button>
          <div
            className="mdui-dialog mdui-col-xs-3"
            id="loginWindow"
            style={{ width: "25%" }}
          >
            <div className="mdui-dialog-title">用妇登录</div>
            <div className="mdui-dialog-content">
              <div className="mdui-row">
                <div
                  className="mdui-col-xs-4 mdui-col-sm-8"
                  style={{ float: "none", margin: "0 auto", width: "17em" }}
                >
                  <div className="mdui-textfield">
                    <input
                      className="mdui-textfield-input"
                      type="text"
                      placeholder="User Name"
                      onChange={v => this.handleInput("username", v)}
                    />
                  </div>
                </div>
              </div>
              <div className="mdui-row">
                <div
                  className="mdui-col-xs-4 mdui-col-sm-8"
                  style={{ float: "none", margin: "0 auto", width: "17em" }}
                >
                  <div className="mdui-textfield">
                    <input
                      className="mdui-textfield-input"
                      type="password"
                      placeholder="Password"
                      onChange={v => this.handleInput("psw", v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mdui-dialog-actions">
              <button className="mdui-btn mdui-ripple" mdui-dialog-close="true">
                cancel
              </button>
              <button
                className="mdui-btn mdui-ripple"
                mdui-dialog-confirm="true"
                onClick={() => this.handleLogin()}
              >
                OK
              </button>
            </div>
          </div>

          <button
            className="mdui-btn mdui-btn-raised mdui-btn-dense mdui-ripple mdui-text-color-theme-accent"
            mdui-dialog="{target: '#registerWindow'}"
          >
            注册
          </button>
          <div
            className="mdui-dialog mdui-col-xs-3"
            id="registerWindow"
            style={{ width: "25%" }}
          >
            <div className="mdui-dialog-title">用妇注册</div>
            <div className="mdui-dialog-content">
              <div className="mdui-row">
                <div
                  className="mdui-col-xs-4 mdui-col-sm-8"
                  style={{ float: "none", margin: "0 auto", width: "17em" }}
                >
                  <div className="mdui-textfield">
                    <input
                      className="mdui-textfield-input"
                      type="text"
                      placeholder="User Name"
                      onChange={v => this.handleInput("username", v)}
                    />
                  </div>
                </div>
              </div>
              <div className="mdui-row">
                <div
                  className="mdui-col-xs-4 mdui-col-sm-8"
                  style={{ float: "none", margin: "0 auto", width: "17em" }}
                >
                  <div className="mdui-textfield">
                    <input
                      className="mdui-textfield-input"
                      type="password"
                      placeholder="Password"
                      onChange={v => this.handleInput("psw", v)}
                    />
                  </div>
                </div>
              </div>
              <div className="mdui-row">
                <div
                  className="mdui-col-xs-4 mdui-col-sm-8"
                  style={{ float: "none", margin: "0 auto", width: "17em" }}
                >
                  <div className="mdui-textfield">
                    <input
                      className="mdui-textfield-input"
                      type="password"
                      placeholder="Repassword"
                      onChange={v => this.handleInput("repsw", v)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mdui-dialog-actions">
              <button className="mdui-btn mdui-ripple" mdui-dialog-close="true">
                cancel
              </button>
              <button
                className="mdui-btn mdui-ripple"
                mdui-dialog-confirm="true"
                onClick={() => this.handleRegister()}
              >
                注册
              </button>
            </div>
          </div>
        </>
      </>
    );
  }
}
export default Login;
