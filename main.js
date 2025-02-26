const API_KEY = `35a6696bf7ac4d9e90db114d5635948e`;

let newsList = []

const getLatestNews = async ()=>{
 const url= new URL(
   `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&apiKey=${API_KEY}`
 ); 

    const response = await fetch(url);
    const data = await response.json();

    newsList = data.articles;
    render();
    console.log("ddddd",newsList);
};

const render = () =>{
  const newsHTML = newsList.map(
    (news)=>`<div class="row news" >
    <div class="col-lg-4">
        <img class="news-img-size" 
        src=${news.urlToImage} alt />
    </div>
    <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>
           ${news.description}
        </p>
        <div> ${news.source.name} *  ${news.publishedAt}
    </div>
 </div>`
).join('');

console.log("html", newsHTML);

  document.getElementById("news-board").innerHTML = newsHTML;

}


getLatestNews();



