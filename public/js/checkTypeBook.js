const tipeSelect = document.getElementById("tipeSelect");
const rakGroup = document.getElementById("rakGroup");
const digitalFileGroup = document.getElementById("digitalFileGroup");

function checkTipeBuku() {
  const tipe = tipeSelect.value;

  if (tipe === "digital") {
    rakGroup.classList.add("d-none");
    digitalFileGroup.classList.remove("d-none");
  } else {
    rakGroup.classList.remove("d-none");
    digitalFileGroup.classList.add("d-none");
  }
}

tipeSelect.addEventListener("change", checkTipeBuku);
checkTipeBuku(); // ✅ BOLEH, AMAN
