const usersContainer = document.querySelector(".users-container .row");
const searchInput = document.getElementById("search-input");
const searchButton = document.querySelector["#button-search"];
const prevButton = document.getElementById("prevPageButton");
const nextButton = document.getElementById("nextPageButton");
let pagesrArray = [1, 2, 3, 4, 5];

document.addEventListener("DOMContentLoaded", async function () {
  let usersList = await getUsersList(0);
  showUsers(usersList);
  setPages(pagesrArray);

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
});

async function getUsersList(skip) {
  const apiUrl = `https://dummyjson.com/users?skip=${skip}&limit=12`;

  const result = await getUsers(apiUrl);
  const usersObj = Object.values(result)[0];
  console.log(usersObj);
  if (usersObj === undefined || usersObj.length === 0) {
    alert("no users");
    return;
  }

  return usersObj;
}

function showUsers(users) {
  renderUsers(users);

  searchInput.addEventListener("input", function (event) {
    const searchText = searchInput.value;

    if (searchText === null || searchText === undefined || searchText === "") {
      renderUsers(users);
    } else {
      clearUsersContainer(usersContainer);
      fundUsersBySearch(searchText, users);
    }
  });
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

async function getUsers(api) {
  try {
    let res = await fetch(api);
    console.log(res.users);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function onSearchClick() {
  const searchText = searchInput.value;
  const users = await getUsers(`http://127.0.0.1:3000/?term=${searchText}`);

  if (searchText === null || searchText === undefined || searchText === "") {
    renderUsers(users);
  } else {
    clearUsersContainer(usersContainer);
    fundUsersBySearch(searchText, users);
  }
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
                <h4 class="modal-title" id="exampleModalLabel"></h4>
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

function setPages(pagesrArray) {
  const buttonNext = document.querySelector(".next-page");
  let fragment = "";

  pagesrArray.forEach((page) => {
    const el = pagesTemplate(page);
    fragment += el;
  });
  buttonNext.insertAdjacentElement('beforebegin', fragment)
}

function pagesTemplate(page) {
  return `  
    <li
    class="page-item"
    id="prevPageButton"
    >
      <a
        class="page-link"
        href="#"
        tabindex="-1"
        aria-disabled="true"
      >
        ${page}
      </a>
    </li>
  `;
}

async function onPrevButtonClick() {

  console.log('prevBtn');
  let users = getUsersList(skip);
}

function onNextButtonClick() {
  console.log('nextBtn')
}
