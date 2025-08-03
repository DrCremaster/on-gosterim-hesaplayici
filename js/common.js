// js/common.js

function validateInputAndGetResultDiv(inputId, resultId, requiredInputs = []) {
    let isValid = true;

    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const valueInput = document.getElementById(inputId);
    const value = parseFloat(valueInput.value);
    const resultDiv = document.getElementById(resultId);
    const warningSpan = document.getElementById(inputId + '_warning');

    if (isNaN(value) || value <= 0) {
        warningSpan.textContent = "Lütfen geçerli (pozitif) bir değer girin.";
        isValid = false;
    } else {
        warningSpan.textContent = "";
    }

    for (const input of requiredInputs) {
        const el = document.getElementById(input.id);
        const elWarningSpan = document.getElementById(input.id + '_warning');
        let val;
        if (input.type === 'number') {
            val = parseFloat(el.value);
            if (isNaN(val) || val <= 0) {
                elWarningSpan.textContent = "Lütfen geçerli (pozitif) bir değer girin.";
                isValid = false;
            } else {
                elWarningSpan.textContent = "";
            }
        } else if (input.type === 'select') {
            val = el.value;
            if (!val) {
                elWarningSpan.textContent = `Lütfen ${el.options[el.selectedIndex].text.replace('-- ', '').replace(' --', '').toLowerCase()} seçin.`;
                isValid = false;
            } else {
                elWarningSpan.textContent = "";
            }
        }
    }

    if (!isValid) {
        showResult(resultDiv, "Lütfen tüm gerekli alanları doğru şekilde doldurun.", false);
        return null;
    }
    return {
        value,
        resultDiv
    };
}

function showResult(resultDiv, content, isSuccess = true) {
    resultDiv.innerHTML = content;
    resultDiv.style.backgroundColor = isSuccess ? '#f0f7ff' : '#fff3cd';
    resultDiv.style.borderLeftColor = isSuccess ? 'var(--primary-color)' : 'var(--warning-color)';
    resultDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}
