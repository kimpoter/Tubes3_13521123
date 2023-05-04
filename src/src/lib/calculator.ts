type operator = '+' | '-' | '*' | '/' | '^' | '%'

function calc(num1: number, num2: number, op: string) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
        case '^':
            return num1 ** num2;
        case '%':
            return num1 % num2;
        default:
            throw new Error(`Unknown operator '${op}'`);
    }
}

export function evaluate(expr: string): number {
    const opRegex = /([\+\-\*\/\(\)\^\%])/
    const numRegex = /^[-+]?(\d*\.\d+|\d+)$/
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2,
        '^': 3,
    }
    // get tokens
    const tokens = expr.split(opRegex).filter(token => token.trim() !== '');
    console.info("tokens", tokens);

    const opStack: string[] = [];
    const outputQueue = [];

    for (let i =0; i < tokens.length; i++) {
        // check if token is a number (include digit)
        if (numRegex.test(tokens[i])) {
            outputQueue.push(parseFloat(tokens[i]));
        }
        else if (tokens[i] == '-') { // negative value
            let prevToken = parseFloat(tokens[i - 1]);
            let nextToken = parseFloat(tokens[i + 1]);
            if (Number.isNaN(prevToken) && !Number.isNaN(nextToken)) {
                outputQueue.push(-1 * nextToken);
                i++;
            } else {
                opStack.push('-');
            }
        }
        else if (precedence[tokens[i] as operator]) {
            while (opStack.length > 0 && 
                precedence[tokens[i] as operator] <= precedence[opStack[opStack.length - 1] as operator]) {
                outputQueue.push(opStack.pop());
            }

            opStack.push(tokens[i]);
        }
        else if (tokens[i] == '(') {
            opStack.push(tokens[i]);
        }
        else if (tokens[i] == ')') {
            while (opStack.length > 0 && opStack[opStack.length - 1] != '(') {
                outputQueue.push(opStack.pop());
            }
            if (opStack.length > 0 && opStack[opStack.length - 1] == '(') {
                opStack.pop();
            } else {
                throw new Error("Penggunaan tanda kurung tidak valid");
            }
        } else {
            throw new Error(`Simbol '${tokens[i]}' tidak diketahui`)
        }
    }

    while (opStack.length > 0) {
        const op = opStack.pop();
        if (op == '(' || op == ')') {
            throw new Error("Penggunaan tanda kurung tidak valid");
        } else {
            outputQueue.push(op);
        }
    }

    console.info(outputQueue);
    const result: number[] = [];
    for (const token of outputQueue) {
        if (typeof token == "number") {
            result.push(token);
        } else {
            const num1 = result.pop();
            const num2 = result.pop();
            if (num1 != undefined && num2 != undefined) {
                result.push(calc(num2, num1, token as string));
            } else {
                throw new Error(`Expected angka setelah operator '${token}'`)
            }
        }
    }

    if (result.length != 1) {
        throw new Error("Tidak dapat melakukan kalkulasi");
    }
    return result[0];
}