const usersContainer = document.querySelector(".users-container .row");
const searchInput = document.getElementById("search-input");
const searchButton = document.querySelector["#button-search"];

document.addEventListener("DOMContentLoaded", async function () {
  let usersList = await getUsersList();
  showUsers(usersList);

  const exampleModal = document.getElementById("exampleModal");
  exampleModal.addEventListener("show.bs.modal", (event) => {
    const card = event.relatedTarget;

    const userFullName = card.getAttribute("data-bs-fullname");
    const userPhone = card.getAttribute("data-bs-phone");
    const userEmail = card.getAttribute("data-bs-email");
    const userCompName = card.getAttribute("data-bs-company-name");
    const userCompanyTitle = card.getAttribute("data-bs-company-title");
    const userCompanyDepartment = card.getAttribute("data-bs-company-department");
    const userAddress = card.getAttribute("data-bs-address");

    const modalTitle = exampleModal.querySelector(".modal-title");
    const modalPhone = exampleModal.querySelector(".modal-info-phone");
    const modalEmail = exampleModal.querySelector(".modal-info-email");
    const modalCompName = exampleModal.querySelector(".modal-info-company-name");
    const modalCompanyTitle = exampleModal.querySelector(".modal-info-company-title");
    const modalCompanyDepartment = exampleModal.querySelector(".modal-info-company-department");
    const modalAddress = exampleModal.querySelector(".modal-info-address");

    modalTitle.textContent = `${userFullName}`;
    modalPhone.textContent = `${userPhone}`;
    modalEmail.textContent = `${userEmail}`;
    modalCompName.textContent = `${userCompName}`;
    modalCompanyTitle.textContent = `${userCompanyTitle}`;
    modalCompanyDepartment.textContent = `${userCompanyDepartment}`;
    modalAddress.textContent = `Разработчики используют текст Lorem ipsum в качестве заполнителя макета страницы. Так как дополнительная информации в JSON нет, а адрес нигде не используется - закинул его сюда. ${userAddress}`;
  });
});

async function getUsersList() {
  const apiUrl = "https://dummyjson.com/users/";

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

function usersTemplate({ firstName, maidenName, lastName, phone, email, user, company, address }) {
  return `
      <div class="col-6 col-md-4 mb-3">
        <div class="card p-3 mb-5 bg-white rounded border-0" data-bs-toggle="modal" data-bs-target="#exampleModal" 
        data-bs-fullname="${firstName} ${maidenName} ${lastName}" 
        data-bs-phone="${phone}" 
        data-bs-email="${email}" 
        data-bs-user="${user}" 
        data-bs-company-name="${company.name}"
        data-bs-company-title="${company.title}"
        data-bs-company-department="${company.department}"
        data-bs-address="${address.address}"
        >
            <div class="card-body">
            <h5 class="card-title">${firstName} ${lastName}</h5>
            <div class="card-line">
                <card-icon>
                  <div class="icon phone"></div>
                </card-icon>
                <p class="card-text">${phone}</p>
            </div>
            <div class="card-line" lang="en">
                <div class="card-icon">
                  <div class="icon email"></div>
                </div>
                <a href="#" class="card-text" lang="en">${email}</a>
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
                  <div class="col modal-info-company-name"><p></p></div>
                </div>
                <div class="row">
                  <div class="col-5"><p>Должность:</p></div>
                  <div class="col modal-info-company-title"><p></p></div>
                </div>
                <div class="row">
                  <div class="col-5"><p>Подразделение:</p></div>
                  <div class="col modal-info-company-department"><p></p></div>
                </div>
              </div>
              <div class="modal-footer justify-content-start">
                <p>Дополнительная информация:</p>
                <div class="col modal-info-bottom">
                  <p class="col modal-info-address"></p>
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
