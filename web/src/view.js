import { Message } from "element-ui";
const viewFile = row => {
  if (!localStorage.token) {
    return Message.warning("登录后才可以预览");
  }

  const url = row.aliyun_url;
  const tmp = url.split(".");
  const ext = tmp[tmp.length - 1];
  const img = ["png", "gif", "jpg", "bmp", "jpeg", "svg"];
  const pdf = ["pdf"];
  const doc = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

  if (img.find(i => i === ext)) {
    const win = window.open();
    win.document.write('<img src="' + url + '"/>');
  } else if (pdf.find(i => i === ext)) {
    window.open(url);
    // win.document.write('<iframe src="' + url + '"/>')
  } else if (doc.find(i => i === ext)) {
    const win = window.open();
    win.document.write(
      '<iframe style="width:100%;height: 100%;" src="https://view.officeapps.live.com/op/view.aspx?src=' +
        url +
        '"/>'
    );
  } else {
    Message.warning("不支持的文件格式");
  }
};
export default viewFile;
