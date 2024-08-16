let currentValue = "0";
const MAX_DIGITS = 13;
let hasDecimalPoint = false;
let lastCharacterIsOperator = false;
let operandCount = 1;
let isResult = false;

function clearDisplay() {
	isResult = false;
	currentValue = "0";
	lastCharacterIsOperator = hasDecimalPoint = false;
	operandCount = 1;
	updateDisplay();
}

function appendNumber(value) {
	if (isResult) {
		clearDisplay();
	}
	if (currentValue.length < MAX_DIGITS) {
		currentValue = currentValue === "0" ? value.toString() : currentValue + value.toString();
		lastCharacterIsOperator = false;
		updateDisplay();
	}
}

function updateDisplay() {
	document.getElementById("display").innerHTML = currentValue;
}

function deleteLastCharacter() {
	isResult = false;
	if (["÷", "×", "−", "+"].includes(currentValue[currentValue.length - 1])) {
		lastCharacterIsOperator = false;
		operandCount--;
	}
	if (currentValue[currentValue.length - 1] === ".") {
		hasDecimalPoint = false;
	}
	currentValue = currentValue.slice(0, -1);
	if (currentValue === "") {
		currentValue = "0";
	}
	updateDisplay();
}

function calculateSquareRoot() {
	if (operandCount === 1) {
		isResult = true;
		currentValue = Math.sqrt(parseFloat(currentValue)).toFixed(3);
		if (currentValue === "NaN") {
			clearDisplay();
			return;
		}

		while (currentValue.endsWith(".") || (currentValue.includes(".") && currentValue.endsWith("0"))) {
			currentValue = currentValue.slice(0, -1);
		}

		hasDecimalPoint = currentValue.includes(".");
		lastCharacterIsOperator = false;
		operandCount = 1;
		updateDisplay();
	}
}

function applyOperator(operator) {
	isResult = false;
	if (!lastCharacterIsOperator && operandCount === 1) {
		if (currentValue.length < MAX_DIGITS) {
			currentValue += operator;
			hasDecimalPoint = false;
			lastCharacterIsOperator = true;
			operandCount++;
			updateDisplay();
		}
	}
}

function appendDecimalPoint() {
	isResult = false;
	if (!lastCharacterIsOperator && !hasDecimalPoint) {
		currentValue += ".";
		hasDecimalPoint = true;
		lastCharacterIsOperator = true;
		updateDisplay();
	}
}

function evaluateExpression() {
	isResult = true;
	const operators = {
		'+': (a, b) => a + b,
		'−': (a, b) => a - b,
		'×': (a, b) => a * b,
		'÷': (a, b) => a / b
	};

	for (let operator in operators) {
		const operatorIndex = currentValue.indexOf(operator);

		if (operatorIndex !== -1) {
			if (operatorIndex === currentValue.length - 1) {
				currentValue = currentValue.slice(0, -1);
			} else {
				const [leftOperand, rightOperand] = currentValue.split(operator).map(Number);
				currentValue = operators[operator](leftOperand, rightOperand).toFixed(3);
			}
			break;
		}
	}

	if (["NaN", "Infinity", "-Infinity", "undefined"].includes(currentValue)) {
		clearDisplay();
		return;
	}

	while (currentValue.endsWith(".") || (currentValue.includes(".") && currentValue.endsWith("0"))) {
		currentValue = currentValue.slice(0, -1);
	}

	hasDecimalPoint = currentValue.includes(".");
	lastCharacterIsOperator = false;
	operandCount = 1;
	updateDisplay();
}

function toggleNegative() {
	isResult = false;
	if (currentValue === "0") {
		currentValue = "-";
		hasDecimalPoint = false;
		lastCharacterIsOperator = true;
		updateDisplay();
	} else if (currentValue[0] !== "-" && operandCount === 1) {
		currentValue = "-" + currentValue;
		hasDecimalPoint = false;
		updateDisplay();
	} else if (!lastCharacterIsOperator && operandCount === 1) {
		currentValue = currentValue.slice(1);
		hasDecimalPoint = false;
		updateDisplay();
	}
}

document.addEventListener('keydown', (event) => {
	const keyActions = {
		'Backspace': deleteLastCharacter,
		'Enter': evaluateExpression,
		'Escape': clearDisplay,
		'c': clearDisplay,
		'C': clearDisplay,
		'+': () => applyOperator('+'),
		'-': () => applyOperator('−'),
		'*': () => applyOperator('×'),
		'x': () => applyOperator('×'),
		'/': () => applyOperator('÷'),
		'.': appendDecimalPoint,
		',': appendDecimalPoint,
		's': calculateSquareRoot,
		'0': () => appendNumber(0),
		'1': () => appendNumber(1),
		'2': () => appendNumber(2),
		'3': () => appendNumber(3),
		'4': () => appendNumber(4),
		'5': () => appendNumber(5),
		'6': () => appendNumber(6),
		'7': () => appendNumber(7),
		'8': () => appendNumber(8),
		'9': () => appendNumber(9)
	};

	if (keyActions[event.key]) keyActions[event.key]();
});