type operator = '+' | '-' | '*' | '/' | '^' | '%'

/**
 * get result of calculation num1 op num2
 * 
 * @param num1 
 * @param num2 
 * @param op operator
 * @returns the result
 */
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

/**
 * evaluate mathematical string expression
 * using Shunting Yard algorithm
 * 
 * @param expr string expression that wants to be evaluated
 * @returns the result 
 */
export function evaluate(expr: string): number {
    const opRegex = /([\+\-\*\/\(\)\^\%])/
    const numRegex = /^[-]?(\d*\.\d+|\d+)$/
    // operator's precedence
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
            // check if previous token is not a number and next token is a number
            if (Number.isNaN(prevToken) && !Number.isNaN(nextToken) && tokens[i - 1] != ")") {
                outputQueue.push(-1 * nextToken);
                i++; // skip next token
            } else {
                while (opStack.length > 0 && 
                    precedence[tokens[i] as operator] <= precedence[opStack[opStack.length - 1] as operator]) {
                    outputQueue.push(opStack.pop());
                }
                opStack.push(tokens[i]);
            }
        }
        else if (precedence[tokens[i] as operator]) { // if token is an operator
            // push opStack into outputQueue while
            // current token precedence is less than or equal to the 
            // precedence of the top operator stack 
            while (opStack.length > 0 && 
                precedence[tokens[i] as operator] <= precedence[opStack[opStack.length - 1] as operator]) {
                outputQueue.push(opStack.pop());
            }
            console.info("op", tokens[i], "opstack", opStack)
            opStack.push(tokens[i]);
        }
        else if (tokens[i] == '(') { // if token is an opening parantheses
            opStack.push(tokens[i]);
        }
        else if (tokens[i] == ')') { // if token is a closing parantheses
            // push opStack into outputQueue until
            // the top of operator stack is an opening parantheses
            while (opStack.length > 0 && opStack[opStack.length - 1] != '(') {
                outputQueue.push(opStack.pop());
            }
            // check if there is an opening parantheses
            if (opStack.length > 0 && opStack[opStack.length - 1] == '(') {
                opStack.pop();
            } else {
                throw new Error("Penggunaan tanda kurung tidak valid");
            }
        } else {
            throw new Error(`Simbol '${tokens[i]}' tidak diketahui`)
        }
    }
    // push the remaining operator into the output queue
    while (opStack.length > 0) {
        const op = opStack.pop();
        if (op == '(' || op == ')') { // if it's a parantheses
            throw new Error("Penggunaan tanda kurung tidak valid");
        } else {
            outputQueue.push(op);
        }
    }
    console.info("output queue", outputQueue);
    // calculate result
    const result: number[] = [];
    for (const token of outputQueue) {
        if (typeof token == "number") {
            result.push(token);
        } else {
            const num1 = result.pop();
            const num2 = result.pop();
            // check if num1 and num2 is not undefined
            if (num1 != undefined && num2 != undefined) {
                result.push(calc(num2, num1, token as string));
            } else {
                throw new Error(`Expected angka setelah operator '${token}'`)
            }
        }
        console.info("token", token, "result", result)
    }
    // if there is no result
    if (result.length != 1) {
        throw new Error("Tidak dapat melakukan kalkulasi");
    }
    return result[0];
}