"use strict"

// Функция priority позволяет получить
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент — строку
// с арифметическим выражением и делит его на токены
// (числа, операторы, скобки). Возвращаемое значение —
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (let char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// Функция compile принимает один аргумент — строку
// с арифметическим выражением, записанным в инфиксной
// нотации, и преобразует это выражение в обратную
// польскую нотацию (ОПН). Возвращаемое значение —
// результат преобразования в виде строки, в которой
// операторы и операнды отделены друг от друга пробелами.
// Выражение может включать действительные числа, операторы
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_..).

function compile(str) {
    let out = [];
    let stack = [];
    for (let token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент — строку
// с арифметическим выражением, записанным в обратной
// польской нотации. Возвращаемое значение — результат
// вычисления выражения. Выражение может включать
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запис..).

function evaluate(str) {
    let polish = tokenize(compile(str));
    let stack = [];
    for (const el of polish) {
        if (isNumeric(el)) {
            stack.push(Number(el));
        } else {
            if (el == "+") stack.push(stack.pop() + stack.pop());

            else if (el == "-") {
                let b = stack.pop();
                let a = stack.pop();
                stack.push(a - b);
            }

            else if (el == "*") stack.push(stack.pop() * stack.pop());

            else if (el == "/") {
                let a = stack.pop();
                let b = stack.pop();
                stack.push(b / a);
            }
        }
    }

    return stack.pop().toFixed(2);
}

// Функция clickHandler предназначена для обработки
// событий клика по кнопкам калькулятора.
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана
// должно очищаться.
// По нажатию на кнопку с классом result на экране
// должен появиться результат вычисления введённого выражения
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования
// событий (https://learn.javascript.ru/event-delegation), чтобы
// не назначать обработчик для каждой кнопки в отдельности.

function clickHandler(event) {
    // your code here
    if (event.target.className in { 'key-digit': 0, 'key-operation': 1, 'key-bracket': 2 }) {
        document.querySelector('.expression').innerHTML += event.target.innerHTML;
        return;
    }

    if (event.target.className == 'key-clear') {
        document.querySelector('.expression').innerHTML = '';
    }

    if (event.target.className == 'key-result') {
        document.querySelector('.expression').innerHTML = evaluate(document.querySelector('.expression').innerHTML)
    }
}

// Назначьте нужные обработчики событий.
window.onload = function () {
    // your code here
    let buttons = document.querySelector('.buttons');
    buttons.addEventListener('click', clickHandler);
}