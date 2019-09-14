import React from "react";
import axios from "axios";
import "./index.css";
import { ip } from "../../interceptors";

class Curchat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgs: [], //Chats after login
      allchat: [] //All chats in history 性能问题
    };
  }

  componentDidMount() {
    console.log(document.querySelector("#root > div > div:nth-child(3)"));
    let c = document.querySelector("#root > div > div:nth-child(3)");
    if (!this.props.isLogin) {
      console.log(this.props.choose);
      let choose = this.props.choose;
      /*
       *
       * 获取登录前聊天消息*/
      axios.post(`http://${ip}/msg`, { choose }).then(res => {
        this.setState({ allchat: [...this.state.allchat, ...res.data] });
        console.log(this.state.allchat);
        c.scrollTop = c.scrollHeight;
      });
      /*
       *
       * 获取当前已发送聊天消息*/
      this.props.socket.on(`receive${this.props.choose}`, chats => {
        this.setState({
          msgs: [...this.state.msgs, chats]
        });
        console.log(chats);
        //&& chats.from !== this.props.username
        /*
         *
         * build后都无反应*/
        if (window.Notification) {
          let popNotication = () => {
            let notification = new Notification(`${chats.from}说:`, {
              body: `${chats.content}`
            });
            notification.onclick = () => {
              notification.close();
            };
          };
          console.log(`1`);
          if (Notification.permission === "granted") {
            console.log(`2`);
            popNotication();
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function(permission) {
              console.log(`2`);
              popNotication();
            });
          }
        } else {
          console.log(`对不起！你的浏览器好辣鸡！`);
        }
        c.scrollTop = c.scrollHeight;
      });
    } else {
      console.log(this.props.username);
    }
  }

  /**
   * {组件更细后触发}
   *
   * @param {*} prevProps
   * @param {*} prevState
   * @param {*} snapshot
   * @memberof Curchat
   */
  componentDidUpdate(prevProps, prevState, snapshot) {}

  handleUser_avatar = v => {
    axios({
      method: `post`,
      url: `http://${ip}/getuseravatar`,
      data: { from: v }
    }).then(res => {
      console.log(res);
      axios({
        method: "get",
        url: `http://${ip}/getavatar?filename=${res.data.data}`,
        responseType: "blob"
      }).then(res => {
        console.log(res);
        if (res.status === 200 && res.statusText === "OK") {
          const c = document.getElementsByClassName(v);
          console.log(c);
          for (let i = 0; i < c.length; i++) {
            c[i].src = res.request.responseURL;
          }
        } else {
          console.log(`get_msg_avatar_failed`);
        }
      });
    });
  };

  render() {
    return (
      <>
        <div>
          {this.state.allchat.length >= 1
            ? this.state.allchat.map(v => {
                console.log(v);
                let msg = v.content;
                let from = v.from;
                this.handleUser_avatar(from);
                //console.log(`key=>${v._id} props=>${this.props}`);
                return (
                  <>
                    <div key={v._id} className={"item left"}>
                      <div className="mdui-list-item-avatar">
                        <img className={`${v.from}`} alt={`avatar`} />
                      </div>
                      <div>
                        <div style={{ marginLeft: "1em" }}>
                          {v.from} {v.time}
                        </div>
                        <div className="message">{msg}</div>
                      </div>
                    </div>
                  </>
                );
              })
            : null}
          {this.state.msgs.length >= 1
            ? this.state.msgs.map(v => {
                console.log(v);
                let msg = v.content;
                let from = v.from;
                this.handleUser_avatar(from);
                //console.log(`key=>${v._id} props=>${this.props}`);
                return (
                  <>
                    <div key={v._id} className={"item left"}>
                      <div className="mdui-list-item-avatar">
                        <img className={v.from} alt={`avatar`} />
                      </div>
                      <div>
                        <div style={{ marginLeft: "1em" }}>
                          {v.from} {v.time}
                        </div>
                        <div className="message">{msg}</div>
                      </div>
                    </div>
                  </>
                );
              })
            : null}
        </div>
      </>
    );
  }
}

export default Curchat;
