const timeNode = document.querySelector("#localTime");
const yearNode = document.querySelector("#year");
const serviceRows = [...document.querySelectorAll(".service-row")];
const servicePreview = document.querySelector("#servicePreview");

function updateLocalTime() {
  if (!timeNode) return;

  timeNode.textContent = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

function setServicePreview(row) {
  const image = row.dataset.image;
  if (!image || !servicePreview) return;

  serviceRows.forEach((item) => item.classList.remove("active"));
  row.classList.add("active");
  servicePreview.src = image;
}

serviceRows.forEach((row) => {
  row.addEventListener("mouseenter", () => setServicePreview(row));
  row.addEventListener("focus", () => setServicePreview(row));
  row.addEventListener("click", () => setServicePreview(row));
});

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

updateLocalTime();
window.setInterval(updateLocalTime, 1000);
