const tipeSelect = document.getElementById("tipeSelect");
const stokGroup = document.getElementById("stokGroup");
const rakGroup = document.getElementById("rakGroup");
const digitalFileGroup = document.getElementById("digitalFileGroup");

function checkTipeBuku() {
  const tipe = tipeSelect.value;

  if (tipe === "digital") {
    // sembunyikan fisik
    stokGroup.classList.add("d-none");
    rakGroup.classList.add("d-none");

    // tampilkan digital
    digitalFileGroup.classList.remove("d-none");

    // optional: reset value fisik
    stokGroup.querySelector("input").value = "";
    rakGroup.querySelector("input").value = "";
  } else {
    // tampilkan fisik
    stokGroup.classList.remove("d-none");
    rakGroup.classList.remove("d-none");

    // sembunyikan digital
    digitalFileGroup.classList.add("d-none");

    // optional: reset file
    digitalFileGroup.querySelector("input").value = "";
  }
}

tipeSelect.addEventListener("change", checkTipeBuku);
checkTipeBuku(); // jalan saat page load
