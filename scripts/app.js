import { saveBudgetData, getBudgetData, clearData } from './storage.js';


const budgetInput = document.getElementById('budgetInput');
const inputBtn = document.getElementById('inputBtn');
const resetBtn = document.getElementById('resetBtn');
const addBudget = document.getElementById('addBudget');
const addExpense = document.getElementById('addExpense');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('expenseModal');
const modalSubmit = document.getElementById('modalBtn');
const expensesContainer = document.getElementById('expenses');

let budget = 0;
let expenses = [];
let totalSpent = 0;
let remaining = 0;

init();

function init() {
    const savedData = getBudgetData();
    if (savedData) {
        budget = savedData.budget;
        expenses = savedData.expenses;
        totalSpent = savedData.totalSpent;
        remaining = savedData.remaining;
        updateUI();
        renderExpenses();
    }
    addEventListeners();
}

function addEventListeners() {
    inputBtn.addEventListener('click', enterBudget);
    resetBtn.addEventListener('click', resetAll);
    addBudget.addEventListener('click', editBudget);
    addExpense.addEventListener('click', showModal);
    closeModal.addEventListener('click', hideModal);
    modalSubmit.addEventListener('click', submitExpense);
    window.addEventListener('click', outsideModalClick);
}

function updateUI() {
    document.getElementById('budget').textContent = `Budget: $${budget.toFixed(2)}`;
    document.getElementById('totalBudget').textContent = `Total Budget: $${budget.toFixed(2)}`;
    document.getElementById('remainingBudget').textContent = `Remaining Budget: $${remaining.toFixed(2)}`;
    
    const progressWidth = budget > 0 ? (totalSpent / budget * 100) : 0;
    document.getElementById('progressBar').style.width = `${progressWidth}%`;
}

function renderExpenses() {
    expensesContainer.innerHTML = expenses.length ? '' : '<p>expenses will show here</p>';
    
    expenses.forEach((expense, index) => {
        const expenseEl = document.createElement('div');
        expenseEl.className = 'expense-item';
        expenseEl.innerHTML = `
            <span>${expense.name}</span>
            <span>$${expense.amount.toFixed(2)}</span>
            <button class="delete-btn" data-index="${index}">×</button>
        `;
        expensesContainer.appendChild(expenseEl);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteExpense);
    });
}

function enterBudget() {
    const value = parseFloat(budgetInput.value);
    if (!isNaN(value) && value > 0) {
        budget = value;
        remaining = budget - totalSpent;
        saveData();
        updateUI();
        budgetInput.value = '';
    }
}

function resetAll() {
    budget = 0;
    expenses = [];
    totalSpent = 0;
    remaining = 0;
    clearData();
    updateUI();
    renderExpenses();
}

function editBudget() {
    const newBudget = prompt('Enter new budget:', budget);
    if (newBudget && !isNaN(newBudget)) {
        budget = parseFloat(newBudget);
        remaining = budget - totalSpent;
        saveData();
        updateUI();
    }
}

function showModal() {
    modal.style.display = 'block';
}

function hideModal() {
    modal.style.display = 'none';
}

function outsideModalClick(e) {
    if (e.target === modal) {
        hideModal();
    }
}

function submitExpense() {
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (name && amount > 0) {
        expenses.push({ name, amount });
        totalSpent += amount;
        remaining = budget - totalSpent;
        saveData();
        updateUI();
        renderExpenses();
        hideModal();
    }
}

function deleteExpense(e) {
    const index = e.target.dataset.index;
    const deleted = expenses.splice(index, 1)[0];
    totalSpent -= deleted.amount;
    remaining += deleted.amount;
    saveData();
    updateUI();
    renderExpenses();
}

function saveData() {
    saveBudgetData({ budget, expenses, totalSpent, remaining });
}