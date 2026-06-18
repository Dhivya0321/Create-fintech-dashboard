// FINTECH DASHBOARD BUSINESS LOGIC ARCHITECTURE

// 1. Immutable State Store
let accountBalance = 5400.00;
let cumulativeExpenses = 1250.00;

const generalLedger = [
    { description: "Client Freelance Retainer", type: "income", amount: 2500.00 },
    { description: "SaaS Operational Server", type: "expense", amount: 450.00 },
    { description: "Office Hardware Upgrade", type: "expense", amount: 800.00 }
];

// 2. DOM Node Target Selection
const balanceNode = document.getElementById('totalBalance');
const expensesNode = document.getElementById('totalExpenses');
const ledgerBodyNode = document.getElementById('ledgerBody');
const executeBtnNode = document.getElementById('executeBtn');

const inputDesc = document.getElementById('desc');
const inputAmount = document.getElementById('amount');
const inputType = document.getElementById('type');

// 3. Currency Display Formatter
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

// 4. Synchronization Pipeline 
function synchronizeMetrics() {
    balanceNode.textContent = formatCurrency(accountBalance);
    expensesNode.textContent = formatCurrency(cumulativeExpenses);
}

function renderLedger() {
    // Wipe out the table workspace entirely to prevent structural duplicate loops
    ledgerBodyNode.innerHTML = '';

    // Walk backward down arrays so freshest records load physically higher up the UI
    for (let i = generalLedger.length - 1; i >= 0; i--) {
        const item = generalLedger[i];
        const row = document.createElement('tr');

        const badgeClass = item.type === 'income' ? 'badge-income' : 'badge-expense';
        const operatorHtml = item.type === 'income' ? '+' : '-';

        row.innerHTML = `
            <td>${item.description}</td>
            <td><span class="badge ${badgeClass}">${item.type.toUpperCase()}</span></td>
            <td style="font-weight: 600; color: ${item.type === 'income' ? '#10b981' : '#ef4444'}">
                ${operatorHtml} ${formatCurrency(item.amount)}
            </td>
        `;
        ledgerBodyNode.appendChild(row);
    }
}

// 5. Input Validation and Execution Event Handler
function processTransaction() {
    const descriptionValue = inputDesc.value.trim();
    const amountValue = parseFloat(inputAmount.value);
    const typeValue = inputType.value;

    // Field integrity verification
    if (descriptionValue === "" || isNaN(amountValue) || amountValue <= 0) {
        alert("Transaction Initialization Failure: Ensure all tracking parameters contain legal parameters.");
        return;
    }

    // Process accounting balance arithmetic
    if (typeValue === 'income') {
        accountBalance += amountValue;
    } else {
        if (amountValue > accountBalance) {
            alert("Action Denied: Insufficient liquidity available to execute operation.");
            return;
        }
        accountBalance -= amountValue;
        cumulativeExpenses += amountValue;
    }

    // Commit changes directly to the array model
    generalLedger.push({
        description: descriptionValue,
        type: typeValue,
        amount: amountValue
    });

    // Reset interaction interface input fields cleanly
    inputDesc.value = '';
    inputAmount.value = '';

    // Re-trigger UI render updates
    synchronizeMetrics();
    renderLedger();
}

// 6. Engine Initialization
executeBtnNode.addEventListener('click', processTransaction);
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
});

// Run immediate data synchronization on initial setup
synchronizeMetrics();
renderLedger();