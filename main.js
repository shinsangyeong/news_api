const API_KEY = `35a6696bf7ac4d9e90db114d5635948e`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
const sideNav = document.querySelectorAll(".side-nav button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));
sideNav.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`);

const getNews = async () => {
  try{
    const response = await fetch(url);

    const data = await response.json();
    if(response.status === 200){
      if(data.articles.length === 0){
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      render();
    }else{
      throw new Error(data.message);
    }
  }catch(error){
    errorRender(error.message);
  }
}

// 최신 뉴스 가져오기
const getLatestNews = async () => {
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`);
  await getNews();
};

// 카테고리별 뉴스 가져오기
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
  await getNews();
}
// 키워드 검색 뉴스 가져오기
const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);
  await getNews();
};

// 뉴스 데이터 렌더링
const render = () => {
  const newsHTML = newsList.map((news) => {
    const newsTitle = news.title ? news.title : "제목 없음"; // 제목 없을 경우 기본값 설정
    const newsSource = news.source && news.source.name ? news.source.name : "No Source"; // 출처가 없을 경우 기본값
    const urlImg = news.urlToImage ? news.urlToImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"; // 이미지 없을 경우 기본 이미지
    const momentTime = news.publishedAt ? moment(news.publishedAt).fromNow() : "날짜 없음"; // moment.js를 이용한 날짜 변환
    const newsDescription = textLimit(news.description, 200); // 내용 길이 제한

    return `<div class="row news">
              <div class="col-lg-4">
                <img class="news-img-size" src="${urlImg}" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';" />
              </div>
              <div class="col-lg-8">
                <h2>${newsTitle}</h2>
                <p>${newsDescription}</p>
                <div>${newsSource} * ${momentTime}</div>
              </div>
            </div>`;
  }).join('');
  
  document.getElementById("news-board").innerHTML = newsHTML;
};

// 에러 메세지
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage};
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
}

// 텍스트 길이 제한 함수
const textLimit = (text, limit) => {
  if (!text) return "내용 없음"; // 내용이 없을 경우 기본값 설정
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

getLatestNews();

// search-input Enter 키 이벤트 추가
document.getElementById("search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getNewsByKeyword();
    event.target.value = "";
  }
});

// sideNav open, close
const openNav = () => {
  document.getElementById("sideNav").style.left = "0";
};
const closeNav = () => {
  document.getElementById("sideNav").style.left = "-300px";
};

// openSearchBOX
const openSearchBox = () => {
  document.querySelector(".search-wrap").classList.toggle("active");
};

