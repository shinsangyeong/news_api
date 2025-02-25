const API_KEY = `35a6696bf7ac4d9e90db114d5635948e`;

let news = []

const getLatestNews = async ()=>{
 const url= new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr/top-headlines?country=us&apiKey=${API_KEY}`
 );

    const response = await fetch(url);
    const data = await response.json();

    news = data.articles;

    console.log("ddddd",news);
};
getLatestNews();
