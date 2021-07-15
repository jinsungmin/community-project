const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");

import {
    INewsList
} from '../interfaces/news'

async function getNews(): Promise<INewsList> {
    const {data} = await axios({
        url:"https://news.naver.com/",
        method: "GET",
        responseType: "arraybuffer"
    })
    console.log("response ok");
    const bodyDecoded = iconv.decode(data, "euc-kr");
    const $ = cheerio.load(bodyDecoded);

    const list_text_inner_arr = $(
        "#_rankingList0 > li > div > div > div"
    ).toArray();

    const result = [];
    list_text_inner_arr.forEach((div, index: number) => {
        const aFirst = $(div).find("a").first(); // 첫번째 <a> 태그
        const path = aFirst.attr("href"); // 첫번째 <a> 태그 url
        const url = `https://news.naver.com/${path}`; // 도메인을 붙인 url 주소
        const title = aFirst.text().trim();

        const aLast = $(div).find("a").last(); // <두번째(마지막) <a>태그
        const author = aLast.text().trim();
        result.push({
            id: index+1,
            url,
            title,
            author,
        });
    });
    return {data: result, total: result.length}
}

export {getNews}