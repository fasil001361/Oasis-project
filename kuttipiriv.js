document.addEventListener('DOMContentLoaded', function () {

    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzIbAKg4Y0GS6h1bwMJubAgsRDRmPA3ddi_obShhHFyi6bkG38V9yE71LfemIGT3mev/exec";

    const bookInput = document.getElementById('bookNumber');
    const rangeSection = document.getElementById('rangeSection');
    const startInput = document.getElementById('startNumber');
    const uptoInput = document.getElementById('uptoNumber');
    const endInput = document.getElementById('endNumber');
    const confirmBtn = document.getElementById('confirmRangeBtn');

    const financeSection = document.getElementById('financeSection');
    const totalInput = document.getElementById('totalAmount');
    const onlineInput = document.getElementById('onlinePayment');
    const expensesInput = document.getElementById('expenses');
    const liquidDisplay = document.getElementById('liquidDisplay');
    const finalTotalDisplay = document.getElementById('finalTotalDisplay');
    const saveBtn = document.getElementById('saveExportBtn');

    let currentBook = null;

    // =========================
    // BOOK ENTER
    // =========================
    bookInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            currentBook = bookInput.value.trim();
            if (!currentBook) {
                alert("Enter Book Number");
                return;
            }

            rangeSection.classList.remove('hidden');
            rangeSection.scrollIntoView({ behavior: "smooth" });

            loadBookData(currentBook);

            setTimeout(() => startInput.focus(), 300);
        }
    });

    function loadBookData(book) {
        const savedData = JSON.parse(localStorage.getItem("book_" + book));

        if (savedData) {
            const nextStart = parseInt(savedData.lastUpto) + 1;

            if (nextStart > parseInt(savedData.endNumber)) {
                alert("✅ This Book is Completed!");
                return;
            }

            startInput.value = nextStart;
            endInput.value = savedData.endNumber;
            startInput.readOnly = true;
            endInput.readOnly = true;
        } else {
            startInput.readOnly = false;
            endInput.readOnly = false;
            startInput.value = "";
            endInput.value = "";
        }
    }

    // =========================
    // CONFIRM RANGE
    // =========================
    confirmBtn.addEventListener('click', function () {

        if (!startInput.value || !uptoInput.value || !endInput.value) {
            alert("Fill all range fields");
            return;
        }

        if (parseInt(uptoInput.value) > parseInt(endInput.value)) {
            alert("Upto cannot exceed Ending number");
            return;
        }

        financeSection.classList.remove('hidden');
        financeSection.scrollIntoView({ behavior: "smooth" });

        setTimeout(() => totalInput.focus(), 300);
    });

    // =========================
    // AUTO ENTER NAVIGATION
    // =========================
    const inputs = [
        bookInput,
        startInput,
        uptoInput,
        endInput,
        totalInput,
        onlineInput,
        expensesInput
    ];

    inputs.forEach((input, index) => {
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();

                if (input === endInput) {
                    confirmBtn.click();
                    return;
                }

                if (input === expensesInput) {
                    saveBtn.click();
                    return;
                }

                if (inputs[index + 1]) {
                    inputs[index + 1].focus();
                }
            }
        });
    });

    // =========================
    // FINANCE CALCULATION
    // =========================
    function calculate() {
        const total = parseFloat(totalInput.value) || 0;
        const online = parseFloat(onlineInput.value) || 0;
        const expenses = parseFloat(expensesInput.value) || 0;

        const liquid = total - online - expenses;
        const finalTotal = total - expenses;

        liquidDisplay.textContent = `Liquid = ₹${liquid.toFixed(2)}`;
        finalTotalDisplay.textContent = `Total: ₹${finalTotal.toFixed(2)}`;
    }

    totalInput.addEventListener('input', calculate);
    onlineInput.addEventListener('input', calculate);
    expensesInput.addEventListener('input', calculate);

    // =========================
    // SAVE & EXPORT
    // =========================
    saveBtn.addEventListener('click', function () {

        if (!currentBook) {
            alert("Book number missing");
            return;
        }

        const startVal = parseInt(startInput.value);
        const uptoVal = parseInt(uptoInput.value);
        const endVal = parseInt(endInput.value);

        if (!startVal || !uptoVal || !endVal) {
            alert("Invalid Range");
            return;
        }

        // Loading state
        saveBtn.textContent = "Saving...";
        saveBtn.disabled = true;

        localStorage.setItem("book_" + currentBook, JSON.stringify({
            lastUpto: uptoVal,
            endNumber: endVal
        }));

        const total = parseFloat(totalInput.value) || 0;
        const online = parseFloat(onlineInput.value) || 0;
        const expenses = parseFloat(expensesInput.value) || 0;

        const transaction = {
            Date: new Date().toLocaleDateString(),
            BookNumber: currentBook,
            Start: startVal,
            Upto: uptoVal,
            End: endVal,
            TotalAmount: total,
            OnlinePayment: online,
            Expenses: expenses,
            LiquidAmount: total - online - expenses,
            FinalTotal: total - expenses
        };

        sendToGoogleSheet(transaction);
    });

    // =========================
    // SEND TO GOOGLE SHEET
    // =========================
   function sendToGoogleSheet(data) {

    const formData = new FormData();

    for (let key in data) {
        formData.append(key, data[key]);
    }

    fetch(WEB_APP_URL, {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(result => {

        saveBtn.textContent = "✅ Saved!";
        saveBtn.style.backgroundColor = "#22c55e";

        setTimeout(() => {

            financeSection.classList.add('hidden');
            rangeSection.classList.add('hidden');

            totalInput.value = "";
            onlineInput.value = "";
            expensesInput.value = "";
            uptoInput.value = "";

            liquidDisplay.textContent = "Liquid = ₹0.00";
            finalTotalDisplay.textContent = "Total: ₹0.00";

            saveBtn.textContent = "Save & Export";
            saveBtn.style.backgroundColor = "";
            saveBtn.disabled = false;

            bookInput.focus();

        }, 1200);

    })
    .catch(error => {
        alert("Error sending data");
        console.error(error);

        saveBtn.textContent = "Save & Export";
        saveBtn.disabled = false;
    });
}
});
