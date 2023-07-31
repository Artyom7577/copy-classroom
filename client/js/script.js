import classroomHeader from "./classroomHeader.js";
import classroomBody from "./classroomBody.js";
import performSearch from "./performSearch.js";

const root = document.getElementById("root");

const URL = "http://localhost:3000/api/classrooms";

fetch(URL)
  .then((resp) => resp.json())
  .then((resp) => {
    for (let classroom in resp) {
      root.appendChild(classroomTable(resp[classroom], classroom));
    }
  });

function classroomTable(classroom, classroomName) {
  const div = document.createElement("div");
  div.className = classroomName;

  const table = document.createElement("table");

  const h1 = document.createElement("h1");
  div.appendChild(h1);

  h1.innerHTML = classroomName;

  const thead = classroomHeader();
  table.appendChild(thead);

  const tbody = classroomBody(classroom, classroomName);

  table.appendChild(tbody);
  div.appendChild(table);

  return div;
}

document.querySelector(".btn-primary").onclick = performSearch;
