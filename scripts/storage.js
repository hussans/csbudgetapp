export function saveBudgetData(data) {
    localStorage.setItem('budgetData', JSON.stringify(data));
}

export function getBudgetData() {
    const data = localStorage.getItem('budgetData');
    return data ? JSON.parse(data) : null;
}

export function clearData() {
    localStorage.removeItem('budgetData');
}