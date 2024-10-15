const fetch = require("node-fetch");

async function ebsi() {
    const header = new Headers();
    header.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    const res = await (await fetch("https://www.ebsi.co.kr/ebs/xip/xipa/retrieveGrdCutList.ajax", { method: "POST", body: "subjectId=17012%2C17014%2C17020%2C110001&irecord=202409041&ord=1", headers: header })).text();

    // const start = res.indexOf("<p class=\"count\">")+17;
    // const end = res.indexOf(`</p>`, start);
    // const status = res.substring(start, end);
    let res_copy = res;
    // while (res_copy.indexOf("<td>-</td>") !== -1) {
    //
    // }
    return res.indexOf("grdTypCng('N')") === -1;
}

async function etoos() {
    const res = await (await fetch("https://www.etoos.com/report/exam/20241015_1/sub14.asp?Grd=1")).text();

    return res.indexOf("<td class=\"bg1\">-</td>") === -1;
}

async function megastudy() {
    const res = await (await fetch("https://www.megastudy.net/Entinfo/Exam/2024/go1/Exam_main.asp")).arrayBuffer();

    const decoded = (new TextDecoder("euc-kr")).decode(res);
    return decoded.indexOf("채점 데이터 집계 중입니다.") === -1;
}

async function mimac() {
    const res = await (await fetch("https://www.mimacstudy.com/hmockTestH1/HmockAnalysis.ds?groupNo=401")).arrayBuffer();

    const decoded = (new TextDecoder("euc-kr")).decode(res);
    return decoded.indexOf("산출중입니다.") === -1;
}

async function mock_test() { return await Promise.all([ebsi(), etoos(), megastudy(), mimac()]) }

module.exports = mock_test;