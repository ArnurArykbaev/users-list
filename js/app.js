const baseURL = "https://dummyjson.com";

const usersContainer = document.querySelector(".users-container .row");
const searchInput = document.getElementById("search-input");
const searchButton = document.querySelector["#button-search"];
const pagination = document.querySelector(".pagination");
const prevButton = document.getElementById("prevPageButton");
const nextButton = document.getElementById("nextPageButton");
let currentPage = "1";
let pagesArray = [1, 2, 3, 4, 5];
let total = null;
const dataLimit = 12;

document.addEventListener("DOMContentLoaded", async function () {
  let usersList = await getUsersList(currentPage);
  showUsers(usersList);
  setPages(pagesArray);
  searchInputWatch();
  setModalWindows();

  pagination.addEventListener("click", (e) => {
    if (e.target.classList.contains("link-number")) {
      changeCurrentPage(e);
    }
  });
});

function searchInputWatch() {
  searchInput.addEventListener("input", async function (event) {
    const searchText = searchInput.value;

    if (
      searchText.length === 0 ||
      searchText === null ||
      searchText === undefined ||
      searchText === ""
    ) {
      return;
    } else {
      clearUsersContainer(usersContainer);
      const data = await getData(`${baseURL}/users/search?q=${searchText}`);
      renderUsers(data);
    }
  });
}

function setModalWindows() {
  const exampleModal = document.getElementById("exampleModal");
  exampleModal.addEventListener("show.bs.modal", (event) => {
    const card = event.relatedTarget;

    const userFullName = card.getAttribute("data-bs-fullname");
    const userPhone = card.getAttribute("data-bs-phone");
    const userEmail = card.getAttribute("data-bs-email");

    const modalTitle = exampleModal.querySelector(".modal-title");
    const modalPhone = exampleModal.querySelector(".modal-info-phone");
    const modalEmail = exampleModal.querySelector(".modal-info-email");

    modalTitle.textContent = `${userFullName}`;
    modalPhone.textContent = `${userPhone}`;
    modalEmail.textContent = `${userEmail}`;
  });
}

async function getUsersList(currentPage) {
  let skip;
  if (currentPage === 1) {
    skip = currentPage - 1;
  } else {
    skip = currentPage * dataLimit - dataLimit;
  }
  const apiUrl = `${baseURL}/users?skip=${skip}&limit=${dataLimit}`;

  const dataArray = await getData(apiUrl);
  return dataArray;
}

async function getData(apiUrl) {
  const data = await fetchData(apiUrl);
  total = data.total;
  const dataArr = Object.values(data)[0];
  if (dataArr === undefined || dataArr.length === 0) {
    alert("data empty");
    return;
  }

  return dataArr;
}

function showUsers(users) {
  renderUsers(users);
}

function fundUsersBySearch(search, users) {
  let resArr = [];
  users.map((user) =>
    Object.values(user).forEach((val) => {
      if (val.toLowerCase().includes(search.toLowerCase())) {
        resArr.push(user);
      }
    })
  );

  const searchRes = resArr.filter(function (item, pos) {
    return resArr.indexOf(item) == pos;
  });

  if (searchRes.length === 0) {
    clearUsersContainer(usersContainer);
    alert("No match info");
  }
  renderUsers(searchRes);
}

function renderUsers(users) {
  const usersContainer = document.querySelector(".users-container .row");
  if (usersContainer.children.length) {
    clearContainer(usersContainer);
  }
  let fragment = "";

  users.forEach((usersItem) => {
    const el = usersTemplate(usersItem);
    fragment += el;
  });

  usersContainer.insertAdjacentHTML("afterbegin", fragment);
}

function clearContainer() {
  usersContainer.innerHTML = "";
}

async function fetchData(api) {
  try {
    let res = await fetch(api);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function onSearchClick() {
  const searchText = searchInput.value;
  const users = await fetchData(`http://127.0.0.1:3000/?term=${searchText}`);

  if (searchText === null || searchText === undefined || searchText === "") {
    renderUsers(users);
  } else {
    clearUsersContainer(usersContainer);
    fundUsersBySearch(searchText, users);
  }
}
function clearSearchInput() {
  if (!searchInput.value.length) {
    return;
  }
  searchInput.value = null;
}

function usersTemplate(user) {
  return `
      <div class="col-6 col-md-4 mb-3">
        <div class="card p-3 mb-5 bg-white rounded border-0" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-fullname="${user.firstName} ${user.maidenName} ${user.lastName}" data-bs-phone="${user.phone}" data-bs-email="${user.email}" data-bs-user="${user.user}">
            <div class="card-body">
            <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
            <div class="card-line">
                <card-icon>
                  <div class="icon phone"></div>
                </card-icon>
                <p class="card-text">${user.phone}</p>
            </div>
            <div class="card-line" lang="en">
                <div class="card-icon">
                  <div class="icon email"></div>
                </div>
                <a href="#" class="card-text" lang="en">${user.email}</a>
            </div>
            </div>
        </div>
        <div class="user-modal modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title modal-title" id="exampleModalLabel"></h4>
                <div class="card-icon" data-bs-dismiss="modal" aria-label="Close">
                  <img src="./assets/img/x-circle-fill 1.png" alt="" class="close">
                </div>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-5"><p>Телефон:</p></div>
                  <div class="col modal-info-phone"><p></p></div>
                </div>
                <div class="row">
                  <div class="col-5"><p>Почта:</p></div>
                  <div class="col modal-info-email"><p></p></div>
                </div>
                <div class="row">
                  <div class="col-5"><p>Дата приема:</p></div>
                  <div class="col modal-info-name"><p>${user.company.name}</p></div>
                </div>
                <div class="row">
                  <div class="col-5"><p>Должность:</p></div>
                  <div class="col modal-info-title"><p>${user.company.title}</p></div>
                </div>
                <div class="row">
                  <div class="col-5"><p>Подразделение:</p></div>
                  <div class="col modal-info-department"><p>${user.company.department}</p></div>
                </div>
              </div>
              <div class="modal-footer justify-content-start">
                <p>Дополнительная информация:</p>
                <div class="col modal-info-bottom">
                  <p>Разработчики используют текст Lorem ipsum в качестве заполнителя макета страницы. Так как дополнительная информации в JSON нет, а адрес нигде не используется - закинул его сюда. ${user.address.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
}

function clearUsersContainer(container) {
  let children = container.lastElementChild;

  while (children) {
    container.removeChild(children);
    children = container.lastElementChild;
  }
}

/* pagination */
async function changeCurrentPage(e) {
  const currentLimit = Math.ceil(total / dataLimit);

  clearSearchInput();
  currentPage = e.target.innerHTML;
  changePage(currentLimit);
}

async function changePage(currentLimit) {
  let usersList = await getUsersList(currentPage);
  clearUsersContainer(usersContainer);
  renderUsers(usersList);
  disabledJumpPages(currentPage, currentLimit);
  changePagesArray(currentPage, currentLimit);
  clearPages();
  setPages(pagesArray);
  setModalWindows();
}

function disabledJumpPages(currentPage, limit) {
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (currentPage > 3) {
    prevBtn.classList.remove("disabled");
  } else if (currentPage <= 3 && !prevBtn.classList.contains("disabled")) {
    prevBtn.classList.add("disabled");
  }

  if (currentPage >= limit - 2 && !nextBtn.classList.contains("disabled")) {
    nextBtn.classList.add("disabled");
  } else if (
    currentPage < limit - 2 &&
    nextBtn.classList.contains("disabled")
  ) {
    nextBtn.classList.remove("disabled");
  }
}

function changePagesArray(currentPage, limit) {
  if (currentPage < 3) {
    pagesArray = [1, 2, 3, 4, 5];
    return pagesArray;
  } else {
    pagesArray = calculatePagesArray(currentPage, limit);
    return pagesArray;
  }
}

function calculatePagesArray(page, limit) {
  let resArray = [];

  if (page >= limit - 2) {
    let array = [];
    for (let i = 0; array.length < 5; i++) {
      array.push(limit - i);
    }
    resArray = array.reverse();
  } else {
    for (let i = 0; resArray.length < 5; i++) {
      let numberPage = i + Number(page) - 2;
      resArray.push(numberPage);
    }
  }

  return resArray;
}

function setPages(pagesArray) {
  let fragment = "";

  pagesArray.forEach((page) => {
    const el = pagesTemplate(page);
    fragment += el;
  });

  nextButton.insertAdjacentHTML("beforebegin", fragment);
  setActivePage(currentPage);
}

function pagesTemplate(page) {
  return `  
    <li
    class="page-item page-number"
    id="pageButton"
    >
      <a
        class="page-link link-number"
        href="#"
        tabindex="-1"
        aria-disabled="true"
      >${page}</a>
    </li>
  `;
}

function setActivePage(currentPage) {
  const pages = document.querySelectorAll(".link-number");
  pages.forEach((el) => {
    if (el.innerHTML === currentPage) {
      el.parentElement.classList.add("active");
    }
  });
}

function clearPages() {
  const pages = document.querySelectorAll(".page-number");
  pages.forEach((el) => el.remove());
}

async function onNextButtonClick() {
  const currentLimit = Math.ceil(total / dataLimit);
  currentPage = currentLimit;
  changePage(currentLimit);
}

async function onPrevButtonClick() {
  const currentLimit = Math.ceil(total / dataLimit);
  currentPage = 1;
  changePage(currentLimit);
}
