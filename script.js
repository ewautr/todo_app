"use strict";

const plusButton = document.querySelector(".newBtn");
const form = document.querySelector("form");
const filterAllBtn = document.querySelector(".filterAllBtn");
const filterWorkBtn = document.querySelector(".filterWorkBtn");
const filterPlayBtn = document.querySelector(".filterPlayBtn");
const allTasks = [];
let currentTasks = [];

get();

// HIDING AND DISPLAYING THE FORM
plusButton.addEventListener("click", plusBtnControl);

function plusBtnControl() {
  form.classList.toggle("hidden");
  if (plusButton.innerHTML === "+") {
    plusButton.innerHTML = "&ndash;";
  } else {
    plusButton.innerHTML = "+";
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  post();
});

// GETTING DATA FROM DATABASE
function get() {
  fetch("https://myfriends-1c1d.restdb.io/rest/todo", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": "5d8c66ea0e26877dd0577b43",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(tasks => {
      tasks.forEach(task => {
        allTasks.push(task);
      });
      rebuildList();
    });
}

function rebuildList() {
  currentTasks = allTasks;
  buildList(currentTasks);
}

function buildList(tasks) {
  document.querySelector("main").innerHTML = "";
  tasks.forEach(addTaskToDom);
}

//ADDING FETCHED TASK TO DOM
function addTaskToDom(task) {
  const clone = document.querySelector("template").content.cloneNode(true);

  clone.querySelector("article").dataset.id = task._id;
  clone.querySelector("h2").textContent = task.name;
  clone.querySelector(".time").textContent = "when: " + task.time;
  clone.querySelector(".workorplay").textContent =
    "type of task: " + task.workorplay;

  clone.querySelector(".deleteBtn").addEventListener("click", () => {
    deleteIt(task._id);
    currentTasks.pop(task);
  });

  document.querySelector("main").prepend(clone);
}

//ADDING NEW TASK
function post() {
  const newData = {
    name: form.elements.name.value,
    time: form.elements.time.value,
    workorplay: form.elements.workorplay.value
  };
  const postData = JSON.stringify(newData);

  fetch(`https://myfriends-1c1d.restdb.io/rest/todo`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": "5d8c66ea0e26877dd0577b43",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(data => {
      //   window.location = "";
      allTasks.push(data);
      buildList(allTasks);
    });
  form.elements.name.value = "";
  form.elements.time.value = "";
  form.elements.workorplay.value = "";
  plusBtnControl();
}

//DELETING THE TASK
function deleteIt(id) {
  document.querySelector(`[data-id="${id}"]`).style.opacity = "0";
  setTimeout(() => {
    document.querySelector(`[data-id="${id}"]`).remove();
  }, 1000);
  fetch("https://myfriends-1c1d.restdb.io/rest/todo/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8c66ea0e26877dd0577b43",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {});
}

//FILTERING

filterAllBtn.addEventListener("click", filterListAll);
filterWorkBtn.addEventListener("click", filterListWork);
filterPlayBtn.addEventListener("click", filterListPlay);

function filterListAll() {
  filterAllBtn.classList.add("active");
  filterPlayBtn.classList.remove("active");
  filterWorkBtn.classList.remove("active");
  buildList(allTasks);
}

function filterListWork() {
  filterWorkBtn.classList.add("active");
  filterAllBtn.classList.remove("active");
  filterPlayBtn.classList.remove("active");

  currentTasks = allTasks.filter(filterByWork);
  function filterByWork(task) {
    if (task.workorplay === "work") {
      return true;
    } else {
      return false;
    }
  }
  buildList(currentTasks);
}

function filterListPlay() {
  filterPlayBtn.classList.add("active");
  filterAllBtn.classList.remove("active");
  filterWorkBtn.classList.remove("active");
  currentTasks = allTasks.filter(filterByPlay);
  function filterByPlay(task) {
    if (task.workorplay === "play") {
      return true;
    } else {
      return false;
    }
  }
  buildList(currentTasks);
}
