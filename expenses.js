// URL of Google Script
const scriptURL = "https://script.google.com/macros/s/AKfycbxnC1TDSrsHXZjntXZG7Qr7FipF15WL_YXsPAoMT2xMyk_MRpmMgDJmRUq9lsbXOTWH/exec";

document.addEventListener("DOMContentLoaded", function () {

    const detailsInput = document.getElementById("details");
    const amountInput = document.getElementById("amount");
    const amountBox = document.getElementById("amountBox");
    const saveBox = document.getElementById("saveBox");
    const saveBtn = document.getElementById("saveBtn");
    const statusText = document.getElementById("status");

    // Show amount box when details entered
    detailsInput.addEventListener("input", function () {
        if (detailsInput.value.trim() !== "") {
            amountBox.classList.remove("hidden");
        } else {
            amountBox.classList.add("hidden");
            saveBox.classList.add("hidden");
        }
    });

    // Show save button when amount entered
    amountInput.addEventListener("input", function () {
        if (amountInput.value.trim() !== "") {
            saveBox.classList.remove("hidden");
        } else {
            saveBox.classList.add("hidden");
        }
    });

    // Move focus on Enter key
    detailsInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (detailsInput.value.trim() !== "") {
                amountInput.focus();
            }
        }
    });

    amountInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (amountInput.value.trim() !== "") {
                saveBtn.click(); // trigger save
            }
        }
    });

    // Save button click
    saveBtn.addEventListener("click", function () {
        const data = {
            details: detailsInput.value,
            amount: amountInput.value
        };

        fetch(scriptURL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(data)
        })
        .then(() => {
            statusText.innerText = "Expense Added Successfully!";
            // Wait 1 second, then refresh to reset form
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch(error => {
            statusText.innerText = "Error sending data";
        });
    });

});
