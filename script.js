document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const originalPriceInput = document.getElementById('originalPrice');
    const discountTypeSelect = document.getElementById('discountType');
    const discountValueInput = document.getElementById('discountValue');
    const discountSymbol = document.getElementById('discountSymbol');
    const discountValueGroup = document.getElementById('discountValueGroup');
    const tieredDiscountGroup = document.getElementById('tieredDiscountGroup');
    const tierRulesContainer = document.querySelector('.tier-rules');
    const addTierBtn = document.getElementById('addTier');
    const quantityInput = document.getElementById('quantity');
    const taxCheckbox = document.getElementById('taxCheckbox');
    const taxRateGroup = document.getElementById('taxRateGroup');
    const taxRateInput = document.getElementById('taxRate');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const compareModal = document.getElementById('compareModal');
    const comparisonResults = document.getElementById('comparisonResults');
    const refreshComparisonBtn = document.getElementById('refreshComparison');
    
    // Result elements
    const originalPriceResult = document.getElementById('originalPriceResult');
    const discountAppliedResult = document.getElementById('discountAppliedResult');
    const discountedPriceResult = document.getElementById('discountedPriceResult');
    const taxAmountResult = document.getElementById('taxAmountResult');
    const totalPriceResult = document.getElementById('totalPriceResult');
    const youSaveResult = document.getElementById('youSaveResult');
    const savingsPercentageResult = document.getElementById('savingsPercentageResult');
    const savingsProgress = document.getElementById('savingsProgress');
    const effectivePriceResult = document.getElementById('effectivePriceResult');
    const taxResultRow = document.getElementById('taxResultRow');
    const totalResultRow = document.getElementById('totalResultRow');
    const bestDealCard = document.getElementById('bestDealCard');
    const bestDealContent = document.getElementById('bestDealContent');
    
    // New persistence elements
    const saveCalculationBtn = document.getElementById('saveCalculation');
    const loadCalculationBtn = document.getElementById('loadCalculation');
    const exportPDFBtn = document.getElementById('exportPDF');
    const exportCSVBtn = document.getElementById('exportCSV');
    const shareCalculationBtn = document.getElementById('shareCalculation');
    const savedCalculationsList = document.getElementById('savedCalculationsList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const calculationsModal = document.getElementById('calculationsModal');
    
    // Modal elements
    const historyModal = document.getElementById('historyModal');
    const alertModal = document.getElementById('alertModal');
    const showHistoryBtn = document.getElementById('showHistory');
    const setupAlertBtn = document.getElementById('setupAlert');
    const comparePricesBtn = document.getElementById('comparePrices');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const saveAlertBtn = document.getElementById('saveAlert');
    const priceHistoryChart = document.getElementById('priceHistoryChart');
    
    // Theme toggle
    themeToggle.addEventListener('change', toggleTheme);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Discount type change handler
    discountTypeSelect.addEventListener('change', function() {
        updateDiscountInput();
    });
    
    // Tax checkbox handler
    taxCheckbox.addEventListener('change', function() {
        taxRateGroup.style.display = this.checked ? 'block' : 'none';
    });
    
    // Add tier handler
    addTierBtn.addEventListener('click', addTierRule);
    
    // Calculate button handler
    calculateBtn.addEventListener('click', calculateDiscount);

    // Add this with your other event listeners
     comparePricesBtn.addEventListener('click', showComparePrices);
    
    // Reset button handler
    resetBtn.addEventListener('click', resetCalculator);
    
    // Modal handlers
    showHistoryBtn.addEventListener('click', () => showModal(historyModal));
    setupAlertBtn.addEventListener('click', () => showModal(alertModal));
    comparePricesBtn.addEventListener('click', showComparePrices);
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            historyModal.style.display = 'none';
            alertModal.style.display = 'none';
            calculationsModal.style.display = 'none';
        });
    });
    
    saveAlertBtn.addEventListener('click', savePriceAlert);
    
    // New persistence handlers
    saveCalculationBtn.addEventListener('click', saveCurrentCalculation);
    loadCalculationBtn.addEventListener('click', () => showModal(calculationsModal));
    exportPDFBtn.addEventListener('click', exportAsPDF);
    exportCSVBtn.addEventListener('click', exportAsCSV);
    shareCalculationBtn.addEventListener('click', generateShareableLink);
    clearHistoryBtn.addEventListener('click', clearCalculationHistory);
    
    // View code and learn more links
    document.getElementById('viewCode').addEventListener('click', function(e) {
        e.preventDefault();
        alert('This would link to your GitHub repository in a real implementation.');
    });
    
    document.getElementById('learnMore').addEventListener('click', function(e) {
        e.preventDefault();
        alert('This would provide more information about the project in a real implementation.');
    });
    
    // Initialize calculator
    updateDiscountInput();
    addTierRule(); // Add one initial tier rule
    renderSavedCalculationsList();
    checkForSharedCalculation();
    
    // Functions
    function toggleTheme() {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
    
    function updateDiscountInput() {
        const discountType = discountTypeSelect.value;
        
        switch(discountType) {
            case 'percentage':
                discountSymbol.textContent = '%';
                discountValueInput.placeholder = 'Enter discount percentage';
                discountValueGroup.style.display = 'block';
                tieredDiscountGroup.style.display = 'none';
                break;
            case 'fixed':
                discountSymbol.textContent = '$';
                discountValueInput.placeholder = 'Enter fixed amount';
                discountValueGroup.style.display = 'block';
                tieredDiscountGroup.style.display = 'none';
                break;
            case 'bogo':
                discountValueGroup.style.display = 'none';
                tieredDiscountGroup.style.display = 'none';
                break;
            case 'tiered':
                discountValueGroup.style.display = 'none';
                tieredDiscountGroup.style.display = 'block';
                break;
        }
    }
    
    function addTierRule() {
        const tierRule = document.createElement('div');
        tierRule.className = 'tier-rule';
        tierRule.innerHTML = `
            <input type="number" placeholder="Min quantity" class="tier-min" min="1">
            <span>+</span>
            <input type="number" placeholder="Discount %" class="tier-discount" min="0" max="100" step="1">
            <span>% off</span>
            <button class="remove-tier"><i class="fas fa-times"></i></button>
        `;
        
        tierRulesContainer.appendChild(tierRule);
        
        // Add event listener to remove button
        tierRule.querySelector('.remove-tier').addEventListener('click', function() {
            // Don't allow removing the last tier rule
            if (tierRulesContainer.children.length > 1) {
                tierRule.remove();
            } else {
                alert('You need at least one tier rule.');
            }
        });
    }
    
    function calculateDiscount() {
        const originalPrice = parseFloat(originalPriceInput.value);
        const quantity = parseInt(quantityInput.value) || 1;
        const discountType = discountTypeSelect.value;
        const includeTax = taxCheckbox.checked;
        const taxRate = parseFloat(taxRateInput.value) || 0;
        
        if (!originalPrice || originalPrice <= 0) {
            alert('Please enter a valid original price');
            return;
        }
        
        let discountAmount = 0;
        let discountPercentage = 0;
        let discountedPrice = 0;
        let totalOriginalPrice = originalPrice * quantity;
        let totalDiscountedPrice = 0;
        let bestDeal = null;
        
        switch(discountType) {
            case 'percentage':
                const percentage = parseFloat(discountValueInput.value) || 0;
                if (percentage < 0 || percentage > 100) {
                    alert('Discount percentage must be between 0 and 100');
                    return;
                }
                discountPercentage = percentage;
                discountAmount = (originalPrice * discountPercentage / 100);
                discountedPrice = originalPrice - discountAmount;
                totalDiscountedPrice = discountedPrice * quantity;
                break;
                
            case 'fixed':
                const fixedAmount = parseFloat(discountValueInput.value) || 0;
                if (fixedAmount < 0 || fixedAmount > originalPrice) {
                    alert('Fixed discount amount must be between 0 and the original price');
                    return;
                }
                discountAmount = fixedAmount;
                discountPercentage = (discountAmount / originalPrice) * 100;
                discountedPrice = originalPrice - discountAmount;
                totalDiscountedPrice = discountedPrice * quantity;
                break;
                
            case 'bogo':
                // Buy One Get One free
                const pairs = Math.floor(quantity / 2);
                const remainder = quantity % 2;
                totalDiscountedPrice = (pairs * originalPrice) + (remainder * originalPrice);
                discountAmount = originalPrice * pairs;
                discountPercentage = (discountAmount / totalOriginalPrice) * 100;
                discountedPrice = originalPrice; // per item, though some are free
                break;
                
            case 'tiered':
                const tierRules = Array.from(tierRulesContainer.querySelectorAll('.tier-rule'));
                const tierResults = [];
                
                tierRules.forEach(rule => {
                    const minQty = parseInt(rule.querySelector('.tier-min').value) || 0;
                    const tierDiscount = parseFloat(rule.querySelector('.tier-discount').value) || 0;
                    
                    if (minQty > 0 && tierDiscount >= 0 && tierDiscount <= 100) {
                        tierResults.push({
                            minQty,
                            tierDiscount,
                            totalPrice: calculateTieredPrice(originalPrice, quantity, minQty, tierDiscount)
                        });
                    }
                });
                
                if (tierResults.length === 0) {
                    alert('Please enter valid tier rules');
                    return;
                }
                
                // Find the best deal (lowest total price)
                tierResults.sort((a, b) => a.totalPrice - b.totalPrice);
                bestDeal = tierResults[0];
                
                totalDiscountedPrice = bestDeal.totalPrice;
                discountAmount = totalOriginalPrice - totalDiscountedPrice;
                discountPercentage = (discountAmount / totalOriginalPrice) * 100;
                discountedPrice = totalDiscountedPrice / quantity;
                break;
        }
        
        // Add these functions with your other function definitions

function showComparePrices() {
    if (!originalPriceInput.value || isNaN(parseFloat(originalPriceInput.value))) {
        alert('Please calculate a price first');
        return;
    }
    
    generateComparisonData();
    showModal(compareModal);
}

function generateComparisonData() {
    const originalPrice = parseFloat(originalPriceInput.value);
    const discountType = discountTypeSelect.value;
    const discountValue = parseFloat(discountValueInput.value) || 0;
    const quantity = parseInt(quantityInput.value) || 1;
    
    // Get selected retailers
    const selectedRetailers = Array.from(
        document.querySelectorAll('.retailer-checkboxes input[type="checkbox"]:checked')
    ).map(checkbox => checkbox.value);
    
    // Sample retailer data (in a real app, this might come from an API)
    const retailers = {
        amazon: { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com' },
        walmart: { name: 'Walmart', logo: 'https://logo.clearbit.com/walmart.com' },
        target: { name: 'Target', logo: 'https://logo.clearbit.com/target.com' },
        bestbuy: { name: 'Best Buy', logo: 'https://logo.clearbit.com/bestbuy.com' },
        ebay: { name: 'eBay', logo: 'https://logo.clearbit.com/ebay.com' }
    };
    
    // Clear previous results
    comparisonResults.innerHTML = '';
    
    // Generate comparison for each selected retailer
    selectedRetailers.forEach(retailer => {
        // Generate random price variations (80-120% of original price)
        const basePrice = originalPrice * (0.8 + Math.random() * 0.4);
        const retailerPrice = parseFloat(basePrice.toFixed(2));
        const savings = originalPrice - retailerPrice;
        
        const comparisonItem = document.createElement('div');
        comparisonItem.className = 'retailer-comparison';
        comparisonItem.innerHTML = `
            <img src="${retailers[retailer].logo}" alt="${retailers[retailer].name}" class="retailer-logo" onerror="this.src='https://via.placeholder.com/50'">
            <div class="retailer-info">
                <div class="retailer-name">${retailers[retailer].name}</div>
                <div class="retailer-stock">In Stock</div>
            </div>
            <div class="retailer-pricing">
                <div class="retailer-price">$${retailerPrice.toFixed(2)}</div>
                <div class="retailer-savings">Save $${Math.abs(savings).toFixed(2)} (${Math.abs((savings/originalPrice)*100).toFixed(1)}%)</div>
            </div>
        `;
        
        comparisonResults.appendChild(comparisonItem);
    });
    
    // Add event listener for refresh button
    refreshComparisonBtn.onclick = generateComparisonData;
}
        // Calculate tax if included
        let taxAmount = 0;
        let totalPrice = totalDiscountedPrice;
        
        if (includeTax) {
            taxAmount = totalDiscountedPrice * (taxRate / 100);
            totalPrice = totalDiscountedPrice + taxAmount;
        }
        
        // Update results
        originalPriceResult.textContent = `$${totalOriginalPrice.toFixed(2)}`;
        discountAppliedResult.textContent = `$${discountAmount.toFixed(2)} (${discountPercentage.toFixed(2)}%)`;
        discountedPriceResult.textContent = `$${totalDiscountedPrice.toFixed(2)}`;
        
        if (includeTax) {
            taxAmountResult.textContent = `$${taxAmount.toFixed(2)}`;
            totalPriceResult.textContent = `$${totalPrice.toFixed(2)}`;
            taxResultRow.style.display = 'flex';
            totalResultRow.style.display = 'flex';
        } else {
            taxResultRow.style.display = 'none';
            totalResultRow.style.display = 'none';
        }
        
        youSaveResult.textContent = `$${discountAmount.toFixed(2)}`;
        savingsPercentageResult.textContent = `${discountPercentage.toFixed(2)}%`;
        effectivePriceResult.textContent = `$${discountedPrice.toFixed(2)} per item`;
        
        // Update progress bar
        const progressPercentage = Math.min(discountPercentage, 100);
        savingsProgress.style.width = `${progressPercentage}%`;
        
        // Show best deal for tiered pricing
        if (discountType === 'tiered' && bestDeal) {
            bestDealCard.style.display = 'block';
            bestDealContent.innerHTML = `
                <div class="result-row">
                    <span>Minimum Quantity:</span>
                    <span>${bestDeal.minQty}+</span>
                </div>
                <div class="result-row">
                    <span>Discount Applied:</span>
                    <span>${bestDeal.tierDiscount}%</span>
                </div>
                <div class="result-row highlight">
                    <span>Your Quantity:</span>
                    <span>${quantity}</span>
                </div>
            `;
        } else {
            bestDealCard.style.display = 'none';
        }
        
        // Show price history chart
        showPriceHistoryChart(originalPrice, discountedPrice);
    }
    
    function calculateTieredPrice(originalPrice, quantity, minQty, discount) {
        return quantity >= minQty 
            ? (originalPrice * quantity * (100 - discount) / 100)
            : originalPrice * quantity;
    }
    
    function resetCalculator() {
        originalPriceInput.value = '';
        discountValueInput.value = '';
        quantityInput.value = '1';
        taxCheckbox.checked = false;
        taxRateGroup.style.display = 'none';
        
        // Reset tier rules to one default
        tierRulesContainer.innerHTML = '';
        addTierRule();
        
        // Reset results
        originalPriceResult.textContent = '$0.00';
        discountAppliedResult.textContent = '$0.00 (0%)';
        discountedPriceResult.textContent = '$0.00';
        taxAmountResult.textContent = '$0.00';
        totalPriceResult.textContent = '$0.00';
        youSaveResult.textContent = '$0.00';
        savingsPercentageResult.textContent = '0%';
        effectivePriceResult.textContent = '$0.00 per item';
        savingsProgress.style.width = '0%';
        
        taxResultRow.style.display = 'none';
        totalResultRow.style.display = 'none';
        bestDealCard.style.display = 'none';
    }
    
    function showModal(modal) {
        if (modal === calculationsModal) {
            renderSavedCalculationsList();
        }
        modal.style.display = 'block';
    }
    
    function showPriceHistoryChart(originalPrice, discountedPrice) {
        const ctx = priceHistoryChart.getContext('2d');
        
        // Destroy previous chart if it exists
        if (priceHistoryChart.chart) {
            priceHistoryChart.chart.destroy();
        }
        
        // Generate some random historical data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const labels = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
        
        const historicalPrices = labels.map((month, i) => {
            const basePrice = originalPrice * (0.9 + Math.random() * 0.2); // Random between 90-110%
            return {
                month,
                price: parseFloat(basePrice.toFixed(2))
            };
        });
        
        // Add current discounted price
        historicalPrices.push({
            month: 'Now',
            price: discountedPrice
        });
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: historicalPrices.map(item => item.month),
                datasets: [{
                    label: 'Price History',
                    data: historicalPrices.map(item => item.price),
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(74, 107, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Price: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return `$${value}`;
                            }
                        }
                    }
                }
            }
        });
        
        // Store chart reference
        priceHistoryChart.chart = chart;
    }
    
    function showComparePrices() {
        alert('In a full implementation, this would compare prices across different retailers.');
    }
    
    function savePriceAlert() {
        const alertPrice = parseFloat(document.getElementById('alertPrice').value);
        const alertEmail = document.getElementById('alertEmail').value;
        
        if (!alertPrice || alertPrice <= 0) {
            alert('Please enter a valid alert price');
            return;
        }
        
        if (!alertEmail || !alertEmail.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        
        alert(`Price alert set! You'll be notified at ${alertEmail} when the price drops below $${alertPrice.toFixed(2)}`);
        alertModal.style.display = 'none';
    }
    
    // Save current calculation to localStorage
    function saveCurrentCalculation() {
        const calculationData = getCurrentCalculationData();
        
        if (!calculationData.originalPrice) {
            alert('No calculation to save');
            return;
        }
        
        // Get existing calculations or create new array
        const savedCalculations = JSON.parse(localStorage.getItem('savedCalculations')) || [];
        
        // Add timestamp and ID
        calculationData.timestamp = new Date().toISOString();
        calculationData.id = Date.now();
        
        // Add to beginning of array
        savedCalculations.unshift(calculationData);
        
        // Save to localStorage (limit to 50 most recent)
        localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations.slice(0, 50)));
        
        alert('Calculation saved successfully!');
        renderSavedCalculationsList();
    }
    
    // Get all data from current calculation
    function getCurrentCalculationData() {
        return {
            originalPrice: originalPriceInput.value,
            discountType: discountTypeSelect.value,
            discountValue: discountValueInput.value,
            quantity: quantityInput.value,
            includeTax: taxCheckbox.checked,
            taxRate: taxRateInput.value,
            tierRules: getTierRulesData(),
            results: getCurrentResultsData()
        };
    }
    
    // Get tier rules data
    function getTierRulesData() {
        const tierRules = Array.from(tierRulesContainer.querySelectorAll('.tier-rule'));
        return tierRules.map(rule => ({
            minQty: rule.querySelector('.tier-min').value,
            discount: rule.querySelector('.tier-discount').value
        }));
    }
    
    // Get current results data
    function getCurrentResultsData() {
        return {
            originalPrice: originalPriceResult.textContent,
            discountApplied: discountAppliedResult.textContent,
            discountedPrice: discountedPriceResult.textContent,
            youSave: youSaveResult.textContent,
            savingsPercentage: savingsPercentageResult.textContent,
            effectivePrice: effectivePriceResult.textContent
        };
    }
    
    // Render saved calculations list
    function renderSavedCalculationsList() {
        const savedCalculations = JSON.parse(localStorage.getItem('savedCalculations')) || [];
        
        savedCalculationsList.innerHTML = savedCalculations.map(calc => `
            <div class="saved-calculation" data-id="${calc.id}">
                <h4>${formatDiscountType(calc.discountType)}</h4>
                <p>Original: ${calc.originalPrice}</p>
                <p>Quantity: ${calc.quantity}</p>
                <p>Saved: ${calc.results.youSave}</p>
                <p class="calculation-date">${new Date(calc.timestamp).toLocaleString()}</p>
            </div>
        `).join('');
        
        // Add click handlers to each saved calculation
        document.querySelectorAll('.saved-calculation').forEach(item => {
            item.addEventListener('click', function() {
                loadCalculation(this.dataset.id);
                calculationsModal.style.display = 'none';
            });
        });
    }
    
    // Load a specific calculation
    function loadCalculation(id) {
        const savedCalculations = JSON.parse(localStorage.getItem('savedCalculations')) || [];
        const calculation = savedCalculations.find(calc => calc.id.toString() === id);
        
        if (!calculation) {
            alert('Calculation not found');
            return;
        }
        
        // Set form values
        originalPriceInput.value = calculation.originalPrice;
        discountTypeSelect.value = calculation.discountType;
        discountValueInput.value = calculation.discountValue;
        quantityInput.value = calculation.quantity;
        taxCheckbox.checked = calculation.includeTax;
        taxRateInput.value = calculation.taxRate;
        
        // Update UI based on discount type
        updateDiscountInput();
        
        // Set tier rules if applicable
        if (calculation.discountType === 'tiered' && calculation.tierRules) {
            tierRulesContainer.innerHTML = '';
            calculation.tierRules.forEach(rule => {
                addTierRule();
                const lastRule = tierRulesContainer.lastElementChild;
                lastRule.querySelector('.tier-min').value = rule.minQty;
                lastRule.querySelector('.tier-discount').value = rule.discount;
            });
        }
        
        // Show tax rate if included
        taxRateGroup.style.display = calculation.includeTax ? 'block' : 'none';
        
        // Recalculate to update results
        calculateDiscount();
    }
    
    // Clear calculation history
    function clearCalculationHistory() {
        if (confirm('Are you sure you want to clear all saved calculations?')) {
            localStorage.removeItem('savedCalculations');
            renderSavedCalculationsList();
        }
    }
    
    // Export current calculation as PDF
    function exportAsPDF() {
        // In a real implementation, you would use a library like jsPDF
        // This is a simplified version for demonstration
        
        const calculationData = getCurrentCalculationData();
        const results = calculationData.results;
        
        const content = `
            <h1>Discount Calculation Report</h1>
            <h2>${new Date().toLocaleString()}</h2>
            <hr>
            <h3>Input Parameters</h3>
            <p>Original Price: $${calculationData.originalPrice}</p>
            <p>Discount Type: ${formatDiscountType(calculationData.discountType)}</p>
            <p>Quantity: ${calculationData.quantity}</p>
            ${calculationData.includeTax ? `<p>Tax Rate: ${calculationData.taxRate}%</p>` : ''}
            <hr>
            <h3>Results</h3>
            <p>Original Total: ${results.originalPrice}</p>
            <p>Discount Applied: ${results.discountApplied}</p>
            <p>Discounted Total: ${results.discountedPrice}</p>
            <p>You Save: ${results.youSave}</p>
            <p>Savings Percentage: ${results.savingsPercentage}</p>
            <p>Effective Price: ${results.effectivePrice}</p>
        `;
        
        // In a real implementation, you would generate an actual PDF here
        // For this example, we'll just show the content that would be exported
        alert('PDF Export (simulated):\n\n' + content.replace(/<[^>]*>/g, ''));
        
        // Real implementation might use:
        // const doc = new jsPDF();
        // doc.fromHTML(content, 15, 15);
        // doc.save('discount-calculation.pdf');
    }
    
    // Export current calculation as CSV
    function exportAsCSV() {
        const calculationData = getCurrentCalculationData();
        const results = calculationData.results;
        
        const csvContent = [
            ['Field', 'Value'],
            ['Original Price', `$${calculationData.originalPrice}`],
            ['Discount Type', formatDiscountType(calculationData.discountType)],
            ['Discount Value', calculationData.discountValue || 'N/A'],
            ['Quantity', calculationData.quantity],
            ['Include Tax', calculationData.includeTax ? 'Yes' : 'No'],
            ['Tax Rate', calculationData.includeTax ? `${calculationData.taxRate}%` : 'N/A'],
            [],
            ['Results', ''],
            ['Original Total', results.originalPrice],
            ['Discount Applied', results.discountApplied],
            ['Discounted Total', results.discountedPrice],
            ['You Save', results.youSave],
            ['Savings Percentage', results.savingsPercentage],
            ['Effective Price', results.effectivePrice],
            [],
            ['Exported On', new Date().toLocaleString()]
        ].map(row => row.join(',')).join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `discount-calculation-${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Generate shareable link
    function generateShareableLink() {
        const calculationData = getCurrentCalculationData();
        
        if (!calculationData.originalPrice) {
            alert('No calculation to share');
            return;
        }
        
        // For a real implementation, you would use LZString or similar compression
        // Here we'll just use a simple base64 encoding for demonstration
        const shareData = btoa(JSON.stringify(calculationData));
        const shareUrl = `${window.location.origin}${window.location.pathname}?calculation=${shareData}`;
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Shareable link copied to clipboard!\n\nPaste this URL to share your calculation.');
            }).catch(() => {
                prompt('Copy this link to share your calculation:', shareUrl);
            });
        } else {
            prompt('Copy this link to share your calculation:', shareUrl);
        }
    }
    
    // Check for shared calculation on page load
    function checkForSharedCalculation() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedCalculation = urlParams.get('calculation');
        
        if (sharedCalculation) {
            try {
                const calculationData = JSON.parse(atob(sharedCalculation));
                
                if (confirm('Load shared calculation?')) {
                    // Create a temporary ID and add to history
                    calculationData.id = Date.now();
                    calculationData.timestamp = new Date().toISOString();
                    loadCalculation(calculationData.id.toString());
                }
            } catch (e) {
                console.error('Error loading shared calculation', e);
            }
        }
    }
    
    // Helper function to format discount type for display
    function formatDiscountType(type) {
        const types = {
            'percentage': 'Percentage Off',
            'fixed': 'Fixed Amount Off',
            'bogo': 'Buy One Get One',
            'tiered': 'Tiered Discount'
        };
        return types[type] || type;
    }
});