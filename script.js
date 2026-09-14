const expenseForm = document.getElementById("expenseForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");

const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const expenseCount = document.getElementById("expenseCount");
const clearAllButton = document.getElementById("clearAll");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");

// Load expenses from localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Stores the ID of the expense currently being edited
let editingId = null;

// ========================================
// SAVE EXPENSES
// ========================================

function saveExpenses() {
localStorage.setItem("expenses", JSON.stringify(expenses));
}

// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {
const total = expenses.reduce((sum, expense) => {
return sum + Number(expense.amount);
}, 0);

totalAmount.textContent = `₹${total.toFixed(2)}`;
expenseCount.textContent = expenses.length;


}

// ========================================
// DISPLAY EXPENSES
// ========================================

function displayExpenses() {
expenseList.innerHTML = "";

if (expenses.length === 0) {
    expenseList.innerHTML = `
        <p class="empty-message">No expenses yet.</p>
    `;

    updateSummary();
    return;
}

expenses.forEach((expense) => {

    const expenseItem = document.createElement("div");
    expenseItem.className = "expense-item";

    expenseItem.innerHTML = `
        <div class="expense-info">

            <h3>${escapeHTML(expense.description)}</h3>

            <div class="expense-meta">

                <span class="category-badge ${expense.category.toLowerCase()}">
                    ${escapeHTML(expense.category)}
                </span>

                <span>${expense.date}</span>

            </div>

        </div>

        <div class="expense-right">

            <span class="expense-amount">
                ₹${Number(expense.amount).toFixed(2)}
            </span>

            <button
                type="button"
                class="edit-btn"
                onclick="editExpense(${expense.id})"
            >
                Edit
            </button>

            <button
                type="button"
                class="delete-btn"
                onclick="deleteExpense(${expense.id})"
            >
                Delete
            </button>

        </div>
    `;

    expenseList.appendChild(expenseItem);
});

updateSummary();


}

// ========================================
// ADD / UPDATE EXPENSE
// ========================================

expenseForm.addEventListener("submit", function (event) {

event.preventDefault();

const description = descriptionInput.value.trim();
const amount = Number(amountInput.value);
const category = categoryInput.value;

// Validate input
if (description === "") {
    alert("Please enter a description.");
    descriptionInput.focus();
    return;
}

if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    amountInput.focus();
    return;
}


// ====================================
// UPDATE EXISTING EXPENSE
// ====================================

if (editingId !== null) {

    const expenseIndex = expenses.findIndex(
        (expense) => expense.id === editingId
    );

    if (expenseIndex !== -1) {

        expenses[expenseIndex].description = description;
        expenses[expenseIndex].amount = amount;
        expenses[expenseIndex].category = category;

    }

    // Exit edit mode
    editingId = null;

    // Change form back to Add mode
    formTitle.textContent = "Add Expense";
    submitBtn.textContent = "Add Expense";

}


// ====================================
// ADD NEW EXPENSE
// ====================================

else {

    const newExpense = {
        id: Date.now(),
        description: description,
        amount: amount,
        category: category,
        date: new Date().toLocaleDateString()
    };

    expenses.unshift(newExpense);
}


// Save and refresh
saveExpenses();
displayExpenses();

// Clear form
expenseForm.reset();

descriptionInput.focus();


});

// ========================================
// EDIT EXPENSE
// ========================================

function editExpense(id) {

const expense = expenses.find(
    (expense) => expense.id === id
);

if (!expense) {
    console.error("Expense not found:", id);
    return;
}

// Put existing values into the form
descriptionInput.value = expense.description;
amountInput.value = expense.amount;
categoryInput.value = expense.category;

// Store ID of expense being edited
editingId = id;

// Change form to edit mode
formTitle.textContent = "Edit Expense";
submitBtn.textContent = "Update Expense";

// Scroll to form
document.querySelector(".expense-form").scrollIntoView({
    behavior: "smooth",
    block: "start"
});

// Focus description
descriptionInput.focus();


}

// ========================================
// DELETE EXPENSE
// ========================================

function deleteExpense(id) {

const expense = expenses.find(
    (expense) => expense.id === id
);

if (!expense) {
    return;
}

const confirmed = confirm(
    `Delete "${expense.description}"?`
);

if (!confirmed) {
    return;
}

expenses = expenses.filter(
    (expense) => expense.id !== id
);

// If deleting the expense currently being edited
if (editingId === id) {

    editingId = null;

    formTitle.textContent = "Add Expense";
    submitBtn.textContent = "Add Expense";

    expenseForm.reset();
}

saveExpenses();
displayExpenses();


}

// ========================================
// CLEAR ALL EXPENSES
// ========================================

clearAllButton.addEventListener("click", function () {

if (expenses.length === 0) {
    alert("There are no expenses to clear.");
    return;
}

const confirmed = confirm(
    "Are you sure you want to delete all expenses?"
);

if (!confirmed) {
    return;
}

expenses = [];
editingId = null;

// Reset form
expenseForm.reset();

// Reset form title/button
formTitle.textContent = "Add Expense";
submitBtn.textContent = "Add Expense";

// Save and refresh
saveExpenses();
displayExpenses();


});

// ========================================
// ESCAPE HTML
// Prevents HTML from being inserted
// through the description field.
// ========================================

function escapeHTML(value) {

const div = document.createElement("div");

div.textContent = value;

return div.innerHTML;


}

// ========================================
// INITIAL DISPLAY
// ========================================

displayExpenses();
updateSummary();