function onSearchBody(classroom, time, weekday, group) {
  const searchTbody = document.createElement("tbody");

  const searchTr = document.createElement("tr");

  const groupTd = document.createElement("td");
  const classroomTd = document.createElement("td");
  const scheduleTd = document.createElement("td");

  groupTd.innerHTML = group["group"];
  classroomTd.innerHTML = classroom;
  scheduleTd.innerHTML = `${weekday.toUpperCase()}: ${time[0]}${time[1]}:${
    time[2]
  }${time[3]} Teacher ${group["teacher"]}`;

  searchTbody.appendChild(searchTr);

  searchTr.appendChild(groupTd);
  searchTr.appendChild(classroomTd);
  searchTr.appendChild(scheduleTd);

  return searchTbody;
}

const searchBtn = document.getElementById("searchBtn");
const availabilityBtn = document.getElementById("availabilityBtn");
const resetBtn = document.getElementById("resetBtn");

searchBtn.addEventListener("click", handleSearch);
availabilityBtn.addEventListener("click", handleSeeAvailability);
resetBtn.addEventListener("click", handleResetFilters);

function handleSearch() {
  // For example, you can perform a search operation or display search results
  console.log("Search button clicked");
}

function handleSeeAvailability() {
  const timeFrom = document.getElementById("timeFromDropdown").value;
  const timeTo = document.getElementById("timeToDropdown").value;
  const selectedDay = document.getElementById("weekdaysDropdown").value;

  fetch("http://localhost:3000/api/classrooms")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Filter available time slots and names within the specified range and day
      const availableSlots = [];
      for (const name in data) {
        const personSchedule = data[name];
        const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const times = [
          "1000",
          "1030",
          "1100",
          "1130",
          "1200",
          "1230",
          "1300",
          "1330",
          "1400",
          "1430",
          "1500",
          "1530",
          "1600",
          "1630",
          "1700",
          "1730",
          "1800",
          "1830",
          "1900",
          "1930",
          "2000",
          "2030",
          "2100",
          "2130",
        ];

        for (const time of times) {
          if (
            (time >= timeFrom && time <= timeTo) ||
            (timeFrom === "" && time <= timeTo) ||
            (time >= timeFrom && timeTo === "")
          ) {
            for (const weekday of weekdays) {
              if (
                (!selectedDay || weekday === selectedDay) &&
                (!personSchedule[time] || !personSchedule[time][weekday])
              ) {
                availableSlots.push({ name, time, weekday });
              }
            }
          }
        }
      }

      // Display available slots and names in the search results
      const searchResults = document.getElementById("searchResults");
      searchResults.innerHTML = "";
      const searchTbody = document.createElement("tbody");
      searchResults.appendChild(searchTbody);

      if (availableSlots.length === 0) {
        const searchTr = document.createElement("tr");
        const searchTd = document.createElement("td");
        searchTd.colSpan = 3;
        searchTd.textContent = "No available slots found.";
        searchTr.appendChild(searchTd);
        searchTbody.appendChild(searchTr);
      } else {
        for (const slot of availableSlots) {
          const searchTr = document.createElement("tr");
          searchTr.className = "availableSlot";

          const searchBody = onSearchBody(slot.name, slot.time, slot.weekday, {
            group: "N/A",
            teacher: "",
          });

          searchTr.appendChild(searchBody.firstElementChild);
          searchTbody.appendChild(searchTr);
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function handleResetFilters() {
  location.reload();
}

export default onSearchBody;
