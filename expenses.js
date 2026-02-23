const scriptURL = "https://script.google.com/macros/s/AKfycbxnC1TDSrsHXZjntXZG7Qr7FipF15WL_YXsPAoMT2xMyk_MRpmMgDJmRUq9lsbXOTWH/exec";

document.addEventListener("DOMContentLoaded", function () {

    const detailsInput = document.getElementById("details");
    const amountInput = document.getElementById("amount");
    const amountBox = document.getElementById("amountBox");
    const saveBox = document.getElementById("saveBox");
    const statusText = document.getElementById("status");
    const form = document.getElementById("expenseForm");

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

    // Handle form submit (Enter works on mobile)
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // prevent page reload

        if (document.activeElement === detailsInput && detailsInput.value.trim() !== "") {
            // Enter pressed in Details → focus Amount
            amountInput.focus();
        } else if (document.activeElement === amountInput && amountInput.value.trim() !== "") {
            // Enter pressed in Amount → save
            saveExpense();
        }
    });

    function saveExpense() {
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
            setTimeout(() => {
                window.location.reload(); // refresh after 1 second
            }, 1000);
        })
        .catch(error => {
            statusText.innerText = "Error sending data";
        });
    }

    // Save button click also triggers save
    document.getElementById("saveBtn").addEventListener("click", saveExpense);

});
