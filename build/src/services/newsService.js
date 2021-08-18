"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNews = void 0;
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
async function getNews(keywords) {
    let ret = { data: [], total: 0 };
    let id = 1;
    for (let i = 0; i < keywords.length; i++) {
        const { data } = await axios({
            url: `https://news.google.com/rss/search?q=${encodeURIComponent(keywords[i])}+when:1d&hl=ko&gl=KR&ceid=KR:ko`,
        });
        const $ = cheerio.load(data);
        const list_text_inner_arr = $("channel > item").toArray();
        const result = [];
        await list_text_inner_arr.map(async (item, index) => {
            let title = $(item).find("title").first(); // 첫번째 <title> 태그
            title = title.text().trim();
            let guid = $(item).find("guid").first(); // 첫번째 <guid> 태그
            guid = guid.text().trim();
            let test = $(item).text().trim();
            test = test.substring(title.length);
            let url = test.split(',')[0];
            url = url.substring(0, url.length - guid.length - 3);
            let pubDate = $(item).find("pubDate").first(); // 첫번째 <title> 태그
            pubDate = new Date(pubDate.text().trim());
            await ret.data.push({
                id: id++,
                keyword: keywords[i],
                url,
                title,
                pubDate
            });
        });
    }
    ret.total = --id;
    return ret;
}
exports.getNews = getNews;
