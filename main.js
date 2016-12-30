const Promise = require('bluebird');
const fetch = require('isomorphic-fetch');
const fs = require('fs');
const wait = require('./wait');

const url = (year, page) => `https://theintercept.com/wp-json/posts?page=${page}&filter[posts_per_page]=25&filter[year]=${year}&filter[orderby]=post_date&filter[order]=DESC`;

function getPage(year, page) {
  console.log(`fetching: ${url(year, page)}`);
  return fetch(url(year, page)).then(res => {
    return res.json();
  });
}

function processPage(pageData) {
  return pageData.map(({ authors, categories, content, date, ID, language, link, slug, title }) => {
    console.log(`${ID} : ${date} : ${title} `);
    const articleAuthors = authors.map((author) => {
      // console.log(`${author.ID} : ${author.display_name}`);
      return {
        name: author.display_name,
        id: author.ID,
        title: author.user_title
      };
    });

    const articleCategories = categories.map(({ name }) => name);

    return {
      id: ID,
      authors: articleAuthors,
      categories: articleCategories,
      date,
      link,
      slug,
      title,
      ti_brasil: language.code === 'pt',
      word_count: content.split(' ').length
    }
  });
}

async function main(year, outputFilename) {
  let morePages = true;
  let allArticles = [];
  let currentPage = 0;

  while (morePages) {
    const pageJSON = await getPage(year, currentPage);
    if(pageJSON.length === 0) {
       morePages = false;
    } else {
      const articles = processPage(pageJSON);
      allArticles = allArticles.concat(articles);
      currentPage++;
      await wait(1000);
    }
  }

  fs.writeFileSync(outputFilename, JSON.stringify(allArticles));
  console.log(`wrote ${allArticles.length} article to ${outputFilename}`);
  process.exit(1);
}


module.exports = main;
