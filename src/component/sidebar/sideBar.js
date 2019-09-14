import React from "react";
import axios from "axios";
import Upload from "rc-upload";
import { ip } from "../../interceptors";

class Sidebar extends React.Component {
  // constructor(props) {
  //   super(props);
  //   //this.handleUpdate_avatar=this.props.handleUpdate_avatar.bind(this)
  // }

  /*
   *
   * 父组件状态更新并需要子组件更新时不应使用componentDidMount*/
  componentDidUpdate() {
    if (this.props.info.isLogin === true) {
      axios({
        method: "get",
        url: `http://${ip}/getavatar?filename=${
          this.props.info.userinfo.avatar
        }`,
        responseType: "blob"
      }).then(res => {
        console.log(res);
        if (res.status === 200 && res.statusText === "OK") {
          const c = document.getElementById("main-avatar"),
            d = document.getElementById("preview");
          c.src = res.request.responseURL;
          d.src = res.request.responseURL;
        } else {
          console.log(`get_main_avatar-failed`);
        }
      });
    } else {
      console.log(`未登录`);
    }
  }

  render() {
    let uploaderProps = {
      props: this.props, //this指向问题！！
      action: `http://${ip}/upload`,
      name: "avatar",
      data: { user: this.props.info.userinfo.user }, //提交用户姓名
      multiple: true,
      beforeUpload(file) {
        console.log("beforeUpload", file.name);
      },
      onStart: file => {
        //console.log(this.state)
        console.log("onStart", file.name, file);
        // this.refs.inner.abort(file);
      },
      onSuccess(file) {
        console.log("onSuccess", file);
        console.log(file.data.file.filename);
        axios({
          method: "get",
          url: `http://${ip}/getavatar?filename=${file.data.file.filename}`,
          responseType: "blob"
        }).then(res => {
          console.log(res);
          const c = document.getElementById("preview");
          c.src = res.request.responseURL;
          /*
           *
           * 获取文件名*/
          let responseURL = res.request.responseURL;
          console.log(responseURL);
          let filename = responseURL.split(""),
            new_filename = [];
          for (let i = 0; i < filename.length; i++) {
            if (filename[i] === "=") {
              for (let j = i + 1; j < filename.length; j++) {
                new_filename.push(filename[j]);
              }
              new_filename = new_filename.join("");
              console.log(new_filename);
              break;
            }
          }
          console.log(this);
          /*
           *
           * 改变父组件state*/
          this.props.handleUpdate_avatar(new_filename);
        });
      },
      onProgress(step, file) {
        console.log("onProgress", Math.round(step.percent), file.name);
      },
      onError(err) {
        console.log("onError", err);
      }
    };
    return this.props.info.isLogin ? (
      <>
        <div
          className="mdui-list-item-avatar"
          mdui-dialog="{target: '#userinfo'}"
        >
          <img id={"main-avatar"} alt={"avatar"} />
        </div>
        <div className="mdui-dialog" id={"userinfo"} style={{ width: "30%" }}>
          <div className="mdui-dialog-content">
            <div className="mdui-dialog-title">个人信息设置</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Upload className="mdui-list-item-avatar" {...uploaderProps}>
                <img id={"preview"} alt={"avatar"} />
              </Upload>
              修改头像
            </div>
          </div>

          <div className="mdui-dialog-actions">
            <button className="mdui-btn mdui-ripple" mdui-dialog-close="true">
              关闭
            </button>
            <button className="mdui-btn mdui-ripple" mdui-dialog-confirm="true">
              完成!
            </button>
          </div>
        </div>
        {this.props.info.userinfo.user}
      </>
    ) : (
      <>游客</>
    );
  }
}

export default Sidebar;
