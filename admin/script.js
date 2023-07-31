const URL = "http://localhost:3000/api/classrooms";

function displaySchedule(scheduleData) {
  const scheduleContainer = document.getElementById("scheduleContainer");

  for (const name in scheduleData) {
    const personSchedule = scheduleData[name];

    const personHeader = document.createElement("h2");
    personHeader.textContent = name;
    scheduleContainer.appendChild(personHeader);

    const scheduleList = document.createElement("ul");

    for (const time in personSchedule) {
      const timeSlot = personSchedule[time];

      for (const day in timeSlot) {
        const daySchedule = timeSlot[day];

        const group = daySchedule.group ? daySchedule.group : "N/A";
        const teacher = daySchedule.teacher ? daySchedule.teacher : "N/A";
        const rec = daySchedule.rec;
        const reserved = daySchedule.reserved;

        const recTag = rec ? " [REC]" : "";

        const scheduleEntryText = `Day: ${day}, Hour: ${time}, Group: ${group}, Teacher: ${teacher}${recTag}`;

        const listItem = document.createElement("li");
        listItem.textContent = scheduleEntryText;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          handleDeleteEntry(name, time, day);
        });

        listItem.appendChild(deleteButton);
        scheduleList.appendChild(listItem);
      }
    }

    scheduleContainer.appendChild(scheduleList);
  }
}

function handleDeleteEntry(name, time, day) {
  fetch(`http://localhost:3000/api/classrooms/${name}/${time}/${day}`, {
    method: "DELETE",
  })
    .then((resp) => resp.json())
    .then((data) => {
      const scheduleContainer = document.getElementById("scheduleContainer");
      const scheduleEntries = scheduleContainer.querySelectorAll("li");
      scheduleEntries.forEach((entry) => {
        const entryText = entry.textContent;
        const entryName = name;
        const entryTime = time;

        if (entryName === name && entryTime === time) {
          entry.remove();
        }
      });

      location.reload();
    })
    .catch((error) => {
      console.error("Error deleting data:", error);
    });
}

fetch(URL)
  .then((resp) => resp.json())
  .then((data) => {
    displaySchedule(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

document
  .getElementById("addScheduleForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const day = document.getElementById("day").value;
    const time = document.getElementById("time").value;
    const group = document.getElementById("group").value;
    const teacher = document.getElementById("teacher").value;
    const rec = document.getElementById("rec").checked;

    try {
      const response = await fetch(`${URL}/${name}/${time}/${day}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group,
          teacher,
          rec,
        }),
      });

      if (response.ok) {
        console.log("Schedule entry updated successfully");
        fetch(URL)
          .then((resp) => resp.json())
          .then((data) => {
            displaySchedule(data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
        location.reload();
      } else {
        console.error("Error updating schedule entry:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  });
