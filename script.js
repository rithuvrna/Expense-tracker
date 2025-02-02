// Selecting Elements
const incomeDescription = document.getElementById("income-description");
const incomeAmount = document.getElementById("income-amount");
const incomeMonthlyLimit = document.getElementById("income-monthly_limit");

const expenseDescription = document.getElementById("Expense-description");
const expenseCategory = document.getElementById("Expense-category");
const expenseAmount = document.getElementById("Expense-spend");
const expenseMonthlyLimit = document.getElementById("expense-monthlylimit");

const transactionHistory = document.getElementById("transaction-history");

const totalIncomeEl = document.getElementById("total_income");
const totalExpenseEl = document.getElementById("total_expense");
const balanceEl = document.getElementById("balance");
const monthlyLimitEl = document.getElementById("monthly_limit");

// Variables for storing totals
let totalIncome = 0;
let totalExpense = 0;
let monthlyLimit = 0;
let transactions = [];

// Load Data from Local Storage
function loadFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem("expenseTracker"));
    if (savedData) {
        totalIncome = savedData.totalIncome;
        totalExpense = savedData.totalExpense;
        monthlyLimit = savedData.monthlyLimit;
        transactions = savedData.transactions;

        updateSummary();
        transactions.forEach(addTransactionToTable);
    }
}

// Save Data to Local Storage
function saveToLocalStorage() {
    localStorage.setItem(
        "expenseTracker",
        JSON.stringify({
            totalIncome,
            totalExpense,
            monthlyLimit,
            transactions,
        })
    );
}

// Function to Add Income
function AddIncome() {
    const description = incomeDescription.value.trim();
    const amount = parseFloat(incomeAmount.value);
    const monthlyLimitValue = parseFloat(incomeMonthlyLimit.value);

    if (!description || isNaN(amount) || isNaN(monthlyLimitValue)) {
        alert("Please fill out all fields correctly!");
        return;
    }

    totalIncome += amount;
    monthlyLimit += monthlyLimitValue;

    const transaction = {
        id: Date.now(),
        description,
        category: "Income",
        amount,
        monthlyLimitValue,
    };

    transactions.push(transaction);
    addTransactionToTable(transaction);
    updateSummary();
    saveToLocalStorage();
    clearIncomeFields();
}

// Function to Add Expense
function AddExpense() {
    const description = expenseDescription.value.trim();
    const category = expenseCategory.value;
    const amount = parseFloat(expenseAmount.value);
    const monthlyLimitValue = parseFloat(expenseMonthlyLimit.value);

    if (!description || isNaN(amount) || isNaN(monthlyLimitValue)) {
        alert("Please fill out all fields correctly!");
        return;
    }

    if (totalIncome - totalExpense < amount) {
        alert("Not enough balance! Reduce expense.");
        return;
    }

    totalExpense += amount;
    monthlyLimit -= monthlyLimitValue;

    const transaction = {
        id: Date.now(),
        description,
        category,
        amount: -amount,
        monthlyLimitValue,
    };

    transactions.push(transaction);
    addTransactionToTable(transaction);
    updateSummary();
    saveToLocalStorage();
    clearExpenseFields();
}

// Function to Add a Transaction to Table
function addTransactionToTable(transaction) {
    const transactionRow = document.createElement("tr");
    transactionRow.innerHTML = `
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.amount >= 0 ? `+${transaction.amount}` : transaction.amount}</td>
        <td>${transaction.monthlyLimitValue}</td>
        <td><button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button></td>
    `;

    transactionHistory.appendChild(transactionRow);
}

// Function to Delete a Transaction
function deleteTransaction(transactionId) {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;

    transactions = transactions.filter((t) => t.id !== transactionId);

    if (transaction.amount > 0) {
        totalIncome -= transaction.amount;
    } else {
        totalExpense += transaction.amount;
    }

    monthlyLimit += transaction.monthlyLimitValue;

    saveToLocalStorage();
    updateSummary();
    reloadTransactionTable();
}

// Reload Transaction Table
function reloadTransactionTable() {
    transactionHistory.innerHTML = "";
    transactions.forEach(addTransactionToTable);
}

// Function to Update Summary
function updateSummary() {
    totalIncomeEl.textContent = totalIncome;
    totalExpenseEl.textContent = totalExpense;
    balanceEl.textContent = totalIncome - totalExpense;
    monthlyLimitEl.textContent = monthlyLimit;
}

// Function to Clear Income Input Fields
function clearIncomeFields() {
    incomeDescription.value = "";
    incomeAmount.value = "";
    incomeMonthlyLimit.value = "";
}

// Function to Clear Expense Input Fields
function clearExpenseFields() {
    expenseDescription.value = "";
    expenseAmount.value = "";
    expenseMonthlyLimit.value = "";
}

// Function to Clear All Data
function clearall() {
    if (!confirm("Are you sure you want to clear all data?")) return;

    totalIncome = 0;
    totalExpense = 0;
    monthlyLimit = 0;
    transactions = [];

    localStorage.removeItem("expenseTracker");
    transactionHistory.innerHTML = "";
    updateSummary();
}

// Initialize Summary on Load
loadFromLocalStorage();
updateSummary();
