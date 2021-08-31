/**
 *
 * @param {string} url
 */
const fetch = require("node-fetch");
const { parse } = require("node-html-parser");
const Promise = require("bluebird");
const Keyv = require("keyv");
const { KeyvFile } = require("keyv-file");

const keyv = new Keyv({
  store: new KeyvFile({
    filename: `./cache.json`,
  }),
});

const MAX_PAGES_COUNT = 40;

// Request and captcha
const headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "en,ru-RU;q=0.9,ru;q=0.8,uk;q=0.7,en-US;q=0.6,fr;q=0.5",
  "cache-control": "max-age=0",
  "sec-ch-ua":
    '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
  "sec-ch-ua-mobile": "?0",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  cookie:
    "__uzma=f80eeca8-eaf7-43d7-a440-479db7baa49c; __uzmb=1630096855; __ssuzjsr2=a9be0cd8e; __uzmaj2=b3f13aea-9957-4aff-a698-0b72e703ed5f; __uzmbj2=1630096855; comm100_visitorguid_1000306=9c7e3543-216d-4eff-b39d-6f97dd34a6a9; didomi_token=eyJ1c2VyX2lkIjoiMTdiODk1ODAtZjcxMy02MmU0LWJkZWMtY2IxNWM5ZGU1NmQwIiwiY3JlYXRlZCI6IjIwMjEtMDgtMjdUMjA6NDA6NTcuMjU1WiIsInVwZGF0ZWQiOiIyMDIxLTA4LTI3VDIwOjQwOjU3LjI1NVoiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiZ29vZ2xlIiwiYzpwaW50ZXJlc3QiLCJjOmhvdGphciIsImM6bmV3LXJlbGljIiwiYzpjb21tMTAwIiwiYzpib29raXRzaC1LYjhuYkFEaCIsImM6Y29tbTEwMHZpLXdkbU1tNEo2IiwiYzpib29raXRsYS1NYVJnZ21QTiIsImM6ZG90bWV0cmljLWk4YnFnWkNMIiwiYzpkb3RtZXRyaWMtZ2IyZmpLQ0oiLCJjOmRvdG1ldHJpYy1yakFoZXBSZyIsImM6aXNsb25saW5lLUY5R0JncFFoIiwiYzpldGFyZ2V0LVd3RWpBUTNHIiwiYzpzdHlyaWEtcWhVY2trWmUiLCJjOnhpdGktQjN3Ym5KS1IiLCJjOmdvb2dsZWFuYS0yM2RkY3JEaCJdfSwicHVycG9zZXMiOnsiZW5hYmxlZCI6WyJkZXZpY2VfY2hhcmFjdGVyaXN0aWNzIiwiZ2VvbG9jYXRpb25fZGF0YSJdfSwidmVuZG9yc19saSI6eyJlbmFibGVkIjpbImdvb2dsZSJdfSwidmVyc2lvbiI6MiwiYWMiOiJBa3VBRUFGa0JKWUEuQWt1QUNBa3MifQ==; euconsent-v2=CPLnQp9PLnQp9AHABBENBoCsAP_AAH_AAAAAILtf_X__b3_j-_59f_t0eY1P9_7_v-0zjhfdt-8N2f_X_L8X42M7vF36pq4KuR4Eu3LBIQdlHOHcTUmw6okVrzPsbk2Mr7NKJ7PEmnMbO2dYGH9_n93TuZKY7__8___z__-v_v____f_r-3_3__5_X---_e_V399zLv9____39nN___9uCCYBJhqXkAXYljgybRpVCiBGFYSHQCgAooBhaJrCBlcFOyuAj1BCwAQmoCMCIEGIKMGAQACAQBIREBIAeCARAEQCAAEAKkBCAAjYBBYAWBgEAAoBoWIEUAQgSEGRwVHKYEBEi0UE9lYAlF3saYQhllgBQKP6KjARKEECwMhIWDmOAJAS4AA.f_gAD_gAAAAA; xtvrn=$413863$; _gid=GA1.2.1762453471.1630096857; _STUU=be7b4626-113e-4bf7-9aae-ffe890d4c71d; _hjid=e912caef-ec4c-4f93-98c0-a29135664d15; _hjFirstSeen=1; _hjAbsoluteSessionInProgress=0; __gfp_64b=xBuweaw3Zzj._qX82X4crwwgFPyyaFpOf2gJkbsmKZn.F7|1630096858; __utma=228389250.14840209.1630096857.1630096858.1630096858.1; __utmc=228389250; __utmz=228389250.1630096858.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); DM_SitId220=true; DM_SitId220SecId922=true; DM_SitId220SecId924=true; njuskalo_adblock_detected=true; PHPSESSID=6d41c871ea51d5993bd827fa7679674e; DM_SitId220SecId943=true; __utmt=1; _hjIncludedInSessionSample=0; DM_SitIdT220=true; DM_SitId220SecIdT943=true; __uzmc=9740010940659; uzdbm_a=57531cab-851d-81b5-4c61-3ac33fd43706; __uzmd=1630100248; __uzmcj2=334699762789; __uzmdj2=1630100249; _ga_JFK5H9SG0P=GS1.1.1630096857.1.1.1630100249.60; _ga=GA1.2.14840209.1630096857; _dc_gtm_UA-2376274-8=1; __utmb=228389250.60.9.1630100249664; DotMetricsTimeOnPage=%7B%22C%22%3A%222021-08-27T21%3A01%3A22.1335399Z%22%2C%22E%22%3A%2224b1005f-350d-4414-8e0d-6d64159474bb%22%2C%22S%22%3A924%2C%22T%22%3A353%2C%22V%22%3A%5B%5D%2C%22P%22%3A%22ksuub54kso9ms24o0r%22%7D",
};

const logger = require("./logger");

function isCaptchaRequired(responseString) {
  return responseString.includes("Solve the CAPTCHA and come to the dog side");
}
async function makeRequestSolvingCaptcha(urlToGet) {
  const cacheKey = `url-${urlToGet}`;

  if ((await keyv.get(cacheKey)) !== undefined) {
    return keyv.get(cacheKey);
  }

  const firstAttempt = await fetch(urlToGet, { headers });
  const firstAttemptHtml = await firstAttempt.text();

  if (isCaptchaRequired(firstAttemptHtml)) {
    logger.error(
      { firstAttemptHtml },
      "Captcha is required, application exits, this case is not implemented"
    );
    process.exit(1);
  } else {
    await keyv.set(cacheKey, firstAttemptHtml);
    return firstAttemptHtml;
  }
}

const entityListItemSelector =
  ".EntityList-items > .EntityList-item.EntityList-item--Regular";
const postTitleSelector = ".entity-title";
const postUrlSelector = ".entity-title .link";
const postDescriptionSelector = ".entity-description";
const postImageSelector = ".entity-thumbnail img";
const baseAddress = "https://www.njuskalo.hr";

function removeMoreThanTwoSpaces(stringToReplace) {
  return stringToReplace.replace(/(\s)\s+/g, "$1");
}

function getListOfPosts(dom) {
  const postsListDom = dom.querySelectorAll(entityListItemSelector);

  return postsListDom.map((postDom) => {
    const href = postDom.querySelector(postUrlSelector)?.getAttribute("href");

    const absoluteUrl = href ? baseAddress + href : null;
    return {
      title: postDom.querySelector(postTitleSelector)?.innerText,
      url: absoluteUrl,
      description: removeMoreThanTwoSpaces(
        postDom.querySelector(postDescriptionSelector)?.innerText?.trim()
      ),
      imageUrl:
        "https:" +
        postDom.querySelector(postImageSelector).getAttribute("data-src"),
    };
  });
}

const mapDataRegex =
  /app\.boot\.push\((\{"name":"ClassifiedDetailMap"[^\n]+)\);/is;

function getMapDataFromDetailedPage(html) {
  const regexResult = mapDataRegex.exec(html);

  if (!regexResult) {
    return null;
  }
  const mapDataJsonString = regexResult[1];
  const map = JSON.parse(mapDataJsonString)?.values;

  return map;
}

function getPriceDataFromDetailedPage(dom) {
  const priceString = dom.querySelector(
    ".ClassifiedDetailSummary-priceDomestic"
  ).textContent;

  const priceKunaRegex = /([\d\.]+)(?:&nbsp;|\s)kn/i;

  const kuna = priceString.match(priceKunaRegex)[1];

  const priceEurRegex = /([\d\.]+)(?:&nbsp;|\s)€/i;

  const eur = priceString.match(priceEurRegex)[1];

  return {
    kuna,
    eur,
  };
}
async function fulfillDataFromDetailedPage(listOfPosts) {
  return Promise.map(
    listOfPosts,
    async (postData) => {
      const postHtml = await makeRequestSolvingCaptcha(postData.url, {
        headers,
      });

      const dom = parse(postHtml);

      return {
        ...postData,
        map: getMapDataFromDetailedPage(postHtml),
        price: getPriceDataFromDetailedPage(dom),
        images: dom.querySelectorAll('[data-large-image-url]').map(el => el.getAttribute('data-large-image-url')),
      };
    },
    { concurrency: 1 }
  );
}

const paginationBlock = ".PaginationContainer--top .Pagination-items";
const latestPaginationItem = `${paginationBlock} .Pagination-item:nth-last-child(2)`;

function getLatestPage(dom) {
  // In the case, when only one page is present, the pagination block will not be visible
  if (!dom.querySelector(paginationBlock)) {
    return 1;
  }

  const lastPageRange = dom.querySelector(latestPaginationItem)?.textContent;
  if (!lastPageRange) {
    throw new Error("Paging is not present on the page");
  }

  const result = lastPageRange.includes("-")
    ? lastPageRange.split("-")[1]
    : lastPageRange;
  if (!/^[0-9]+$/.test(result)) {
    throw new Error("Page ranges is incorrect");
  }

  // We're not going to parse more than const MAX_PAGES_COUNT pages, it's gonna take a lot of time and there's a risk of being blocked
  return parseInt(result) <= MAX_PAGES_COUNT ? result : MAX_PAGES_COUNT;
}

function modifyUrlToUsePage(urlString, page) {
  const url = new URL(urlString);
  url.searchParams.append("page", page);

  return url.href;
}

module.exports = async function getDataByUrl(urlToGet, onProgress, logContext) {
  onProgress({ current: 0, total: null });

  const firstHtmlString = await makeRequestSolvingCaptcha(urlToGet);

  let dom = parse(firstHtmlString);

  let page = 1;
  let latestPage = null;

  const result = [];

  do {
    onProgress({ current: page, total: latestPage });

    const urlWithPage = modifyUrlToUsePage(urlToGet, page);
    logger.info(
      { ...logContext, url: urlWithPage, page },
      "processing the next page"
    );

    const htmlString = await makeRequestSolvingCaptcha(urlWithPage);
    dom = parse(htmlString);

    latestPage = getLatestPage(dom);

    const listOfPosts = getListOfPosts(dom);
    logger.debug({ ...logContext, listOfPosts }, "list of posts is parsed");
    const listOfPostsWithMapData = await fulfillDataFromDetailedPage(
      listOfPosts
    );
    logger.debug(
      { ...logContext, listOfPostsWithMapData },
      "list of posts with map data is fulfilled"
    );
    result.push(...listOfPostsWithMapData);

    page++;
  } while (page <= latestPage);

  return result;
};
