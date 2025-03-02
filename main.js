const API_KEY = `35a6696bf7ac4d9e90db114d5635948e`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));
const sideNav = document.querySelectorAll(".side-nav button");
sideNav.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)));
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try{
    url.searchParams.set("page", page);  // &page=page
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();

    if(response.status === 200){
      if(data.articles.length === 0){
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults =data.totalResults;
      console.log("date", data);
      render();
      paginationRender();
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
    const urlImg = news.urlToImage ? news.urlToImage : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"; // 이미지 없을 경우 기본 이미지
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

// pagination
const paginationRender = () => {
  // totalResult
  // page
  // pageSize
  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  // groupSize

  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = pageGroup * groupSize;
  // 마지막 페이지 그룹이 그룹 사이즈보다 작다? lastPage = totalPages
  if(lastPage > totalPages){
    lastPage = totalPages;
  }

  // firstPage
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1: lastPage - (groupSize - 1);

  let last = pageGroup * 5;
  if (last > totalPages) {
    // 마지막 그룹이 5개 이하이면
    last = totalPages;
  }
  let first = last - 4 <= 0 ? 1 : last - 4; // 첫그룹이 5이하이면

  let paginationHTML = `<li class="page-item ${page <= 1 ? "d-none" : ""}" onclick="moveToPage(${firstPage})">
                                          <a class="page-link" href="#" aria-label="Previous">
                                            <span aria-hidden="true">&laquo;</span>
                                          </a>
                                        </li>`;

  paginationHTML += `<li class="page-item ${page === firstPage ? "d-none" : ""}" onclick="moveToPage(${page - 1})">
                                      <a class="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&#60;</span>
                                      </a>
                                    </li>`;

  for(let i = firstPage; i <= lastPage; i++){
    paginationHTML += `<li class="page-item ${i === page ? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item ${page === lastPage ? "d-none" : ""}" onclick="moveToPage(${page + 1})">
                                    <a class="page-link" href="#" aria-label="Next">
                                      <span aria-hidden="true">&#62;</span>
                                    </a>
                                  </li>`;

  paginationHTML += `<li class="page-item ${page === lastPage ? "d-none" : ""}" onclick="moveToPage(${lastPage})">
                                      <a class="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                      </a>
                                    </li>`;

                                    
  document.querySelector(".pagination").innerHTML = paginationHTML;


};

const moveToPage = (pageNum) => {
  console.log("moveToPage", pageNum);
  page = pageNum;
  getNews();
};

getLatestNews();


