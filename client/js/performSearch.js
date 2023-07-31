import onSearchHeader from "./onSearcheHeader.js";
import onSearchBody from "./onSearchBody.js";

const result = document.getElementById("searchResults");

const searchInput = document.getElementById("search");

const url = "http://localhost:3000/api/classrooms";

let arr = [];

function performSearch(arr) {
  fetch(url)
    .then((resp) => resp.json())
    .then((resp) => onSearching(resp));
}

function onSearching(arr) {
  const searchDiv = document.createElement("div");
  const title = document.createElement("h1");
  title.innerHTML = "Search Result";
  searchDiv.appendChild(title);
  searchDiv.appendChild(onSearchHeader());

  for (let classroom in arr) {
    for (let time in arr[classroom]) {
      for (let weekday in arr[classroom][time]) {
        if (
          hasAllLetters(
            searchInput.value,
            arr[classroom][time][weekday]["teacher"]
          ) ||
          hasAllLetters(
            searchInput.value,
            arr[classroom][time][weekday]["group"]
          )
        ) {
          searchDiv.appendChild(
            onSearchBody(
              classroom,
              time,
              weekday,
              arr[classroom][time][weekday]
            )
          );
        }
      }
    }
  }
  result.appendChild(searchDiv);
}

function hasAllLetters(str1, str2) {
  var regex = new RegExp(str1, "i");
  return regex.test(str2);
}

export default performSearch;
