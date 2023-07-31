const weekdays = ["TIME", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function classroomHeader() {
  const thead = document.createElement("thead");
  thead.className = "classrom_header";
  const tr = document.createElement("tr");

  weekdays.forEach((day) => {
    const th = document.createElement("th");
    th.innerHTML = day;
    tr.appendChild(th);
  });
  thead.appendChild(tr);

  return thead;
}

export default classroomHeader;
