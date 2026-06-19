const cl = console.log;

const userForm = document.getElementById("userForm");
const title = document.getElementById("title");
const body = document.getElementById("body");
const userId = document.getElementById("userId");
const editBtn = document.getElementById("editId");
const updatBtn = document.getElementById("updatId");

const cardContaier = document.getElementById("cardContaier");

let userArr = [];

let baseUrl = "https://jsonplaceholder.typicode.com";

function snackbar(msg, icon) {
  swal.fire({
    title: msg,
    icon: icon,
    timer: 2000,
  });
}

const spinner = document.getElementById("spinner");

function fetchUser() {
  spinner.classList.remove("d-none");

  let xhr = new XMLHttpRequest();
  let postUrl = `${baseUrl}/posts`;
  xhr.open("GET", postUrl);
  xhr.send(null);

  xhr.onload = function () {
    userArr = JSON.parse(xhr.response);
    creatCards(userArr.reverse());
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    spinner.classList.add("d-none");
  };
}

fetchUser();

function creatCards(eve) {
  let result = "";
  eve.forEach((element) => {
    result += `
     <div class="col-md-3 my-4" id=${element.id} >
            <div class="card ">
              <div class="card-header"data-toggle="tooltip" data-placement="top" title="${element.title}">
               <h2>${element.title}</h2>
              </div>
              <div class="card-body">
                <p>${element.body}</p>
              </div>
             <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-primary btn-sm"  id="edit" onclick = "onEdit(this)" >Edit</button>
               <button class="btn btn-danger btn-sm"  id="delete" onclick ="removeFun(this)" >Delete</button>
            </div>
          </div>
        </div>
    `;
  });

  cardContaier.innerHTML = result;
}

function cardHandalar(eve) {
  eve.preventDefault();
  spinner.classList.remove("d-none");

  let newObj = {
    userId: userId.value,
    title: title.value,
    body: body.value,
  };

  userArr.unshift(newObj);

  let xhr = new XMLHttpRequest();
  let postUrl = `${baseUrl}/posts`;
  xhr.open("POST", postUrl);
  xhr.send(JSON.stringify(newObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let response = JSON.parse(xhr.response);
      let div = document.createElement("div");
      div.className = "col-md-3 my-4";
      div.id = response.id;

      div.innerHTML = `
       <div class="card ">
              <div class="card-header" data-toggle="tooltip" data-placement="top" title="${newObj.title}">
               <h2>${newObj.title}</h2>
              </div>
              <div class="card-body">
                <p>${newObj.body}</p>
              </div>
             <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-primary btn-sm"  onclick = "onEdit(this)" >Edit</button>
               <button class="btn btn-danger btn-sm"  onclick ="removeFun(this)" >Delete</button>
            </div>
          </div>`;

      cardContaier.prepend(div);
      userForm.reset();
      spinner.classList.add("d-none");
      snackbar(`User Add with id ${response.id}   successfully`, "success");
    }
  };
}

function onEdit(ele) {
  spinner.classList.remove("d-none");

  let editId = ele.closest(".col-md-3").id;
  localStorage.setItem("editId", editId);

  let editUrl = `${baseUrl}/posts/${editId}`;
  let xhr = new XMLHttpRequest();

  xhr.open("GET", editUrl);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.setRequestHeader("Autho", "Get Token form");
  xhr.send(null);
  // let editObj = JSON.parse(xhr.response);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let editObj = JSON.parse(xhr.response);
      cl(editObj);
      title.value = editObj.title;
      body.value = editObj.body;
      userId.value = editObj.userId;

      editBtn.classList.add("d-none");
      updatBtn.classList.remove("d-none");
      spinner.classList.add("d-none");

      userForm.classList.remove("d-none");

      userForm.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      cl("something wents wrong");
    }
  };
}

function onUpdate(eve) {
  spinner.classList.remove("d-none");

  let updateId = localStorage.getItem("editId");
  let updateObj = {
    userId: userId.value,
    title: title.value,
    body: body.value,
    id: updateId,
  };

  let updateUrl = `${baseUrl}/posts/${updateId}`;

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", updateUrl);
  xhr.send(JSON.stringify(updateObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let div = document.getElementById(updateId);
      let h2 = div.querySelector(".card-header h2");
      let p = div.querySelector(".card-body p");
      h2.innerText = updateObj.title;
      p.innerText = updateObj.body;

      swal.fire({
        title: "User update successfully",
        icon: "success",
        timer: 800,
      });

      editBtn.classList.remove("d-none");
      updatBtn.classList.add("d-none");

      userForm.reset();
      spinner.classList.add("d-none");

      div.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      cl("something wents wrong");
    }
  };
}

function removeFun(ele) {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let removeId = ele.closest(".col-md-3").id;
      let removeUrl = `${baseUrl}/posts/${removeId}`;

      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", removeUrl);
      xhr.send();
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
          ele.closest(".col-md-3").remove();
          spinner.classList.add("d-none");
          snackbar("Post delete successfully,", "success");
        }
      };
    }
  });
}

userForm.addEventListener("submit", cardHandalar);
updatBtn.addEventListener("click", onUpdate);
