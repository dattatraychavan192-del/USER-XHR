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

function fetchUser() {
  let xhr = new XMLHttpRequest();
  let postUrl = `${baseUrl}/posts`;
  xhr.open("GET", postUrl);
  xhr.send(null);

  xhr.onload = function () {
    userArr = JSON.parse(xhr.response);
    creatCards(userArr.reverse());
  };
}

fetchUser();

function creatCards(eve) {
  let result = "";
  eve.forEach((element) => {
    result += `
     <div class="col-md-3 my-4" id=${element.id} >
            <div class="card ">
              <div class="card-header">
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
  let newObj = {
    userId: userId.value,
    title: title.value,
    body: body.value,
  };

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
              <div class="card-header">
               <h2>${newObj.title}</h2>
              </div>
              <div class="card-body">
                <p>${newObj.body}</p>
              </div>
             <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-primary btn-sm"  id="edit" onclick = "onEdit(this)" >Edit</button>
               <button class="btn btn-danger btn-sm"  id="delete" onclick ="removeFun(this)" >Delete</button>
            </div>
          </div>`;

      swal.fire({
        title: `User Add with id ${response.id}   successfully`,
        icon: "success",
        timer: 800,
      });
      cardContaier.prepend(div);
      userForm.reset();
    }
  };
}

function onEdit(ele) {
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
    } else {
      cl("something wents wrong");
    }
  };
}

function onUpdate(eve) {
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
    } else {
      cl("something wents wrong");
    }
  };
}

function removeFun(ele) {
  let removeId = ele.closest(".col-md-3").id;
  let removeUrl = `${baseUrl}/posts/${removeId}`;

  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", removeUrl);
  xhr.send();
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      ele.closest(".col-md-3").remove();
    }
  };
}

userForm.addEventListener("submit", cardHandalar);
updatBtn.addEventListener("click", onUpdate);
