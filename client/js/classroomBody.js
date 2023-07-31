function classroomBody(classroom) {
  const tbody = document.createElement("tbody");
  tbody.className = "classroomBody";

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

  // Create rows for each time
  for (let time of times) {
    const tr = document.createElement("tr");
    tr.className = "clases_same_time";

    const tdTime = document.createElement("td");
    tdTime.innerHTML = time.slice(0, 2) + ":" + time.slice(2);
    tr.appendChild(tdTime);

    for (let weekday of weekdays) {
      const tdTeacherSubject = document.createElement("td");
      tdTeacherSubject.className = "tdTeacherSubject";

      if (classroom[time] && classroom[time][weekday]) {
        const teacherName = document.createElement("div");
        teacherName.className = "teacherName";
        teacherName.innerHTML = classroom[time][weekday]["teacher"];

        const subjectName = document.createElement("span");
        subjectName.className = "subjectName";
        subjectName.innerHTML = classroom[time][weekday]["group"];

        // Add new colors here
        if (
          classroom[time][weekday]["reserved"] &&
          classroom[time][weekday]["rec"]
        ) {
          subjectName.classList.add("bg-yellow");
        } else if (
          !classroom[time][weekday]["reserved"] &&
          classroom[time][weekday]["rec"]
        ) {
          subjectName.classList.add("bg-lightred");
        } else {
          subjectName.classList.add("bg-green");
        }

        tdTeacherSubject.append(subjectName, teacherName);
      }

      tr.appendChild(tdTeacherSubject);
    }
    tbody.appendChild(tr);
  }
  return tbody;
}

export default classroomBody;
