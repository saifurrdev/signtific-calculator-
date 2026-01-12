
import { AngleMode } from '../types';

export class MathEngine {
  private static factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  public static evaluate(expression: string, mode: AngleMode): number {
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString());

    const tokens = this.tokenize(sanitized);
    return this.parseAndEval(tokens, mode);
  }

  private static tokenize(expr: string): string[] {
    const regex = /\d*\.\d+|\d+|[+\-*/^()!]|sin|cos|tan|log|ln|sqrt/g;
    return expr.match(regex) || [];
  }

  private static parseAndEval(tokens: string[], mode: AngleMode): number {
    let pos = 0;
    const peek = () => tokens[pos];
    const consume = () => tokens[pos++];

    const parsePrimary = (): number => {
      let token = consume();
      if (!token) return 0;
      if (token === '(') {
        const val = parseExpression();
        consume(); 
        return val;
      }
      if (token === '-') return -parsePrimary();
      if (/^\d*\.\d+|\d+$/.test(token)) return parseFloat(token);

      if (['sin', 'cos', 'tan', 'sqrt', 'log', 'ln'].includes(token)) {
        const next = parsePrimary();
        let res: number;
        switch (token) {
          case 'sin': 
            res = mode === AngleMode.DEG ? Math.sin(next * Math.PI / 180) : Math.sin(next);
            return Math.abs(res) < 1e-15 ? 0 : res;
          case 'cos': 
            res = mode === AngleMode.DEG ? Math.cos(next * Math.PI / 180) : Math.cos(next);
            return Math.abs(res) < 1e-15 ? 0 : res;
          case 'tan': 
            const rad = mode === AngleMode.DEG ? (next * Math.PI / 180) : next;
            if (Math.abs(Math.cos(rad)) < 1e-15) throw new Error("Tangent Undefined");
            res = Math.tan(rad);
            return Math.abs(res) < 1e-15 ? 0 : res;
          case 'sqrt': return Math.sqrt(next);
          case 'log': return Math.log10(next);
          case 'ln': return Math.log(next);
          default: return 0;
        }
      }
      return 0;
    };

    const parseFactorial = (): number => {
      let val = parsePrimary();
      while (peek() === '!') {
        consume();
        val = this.factorial(val);
      }
      return val;
    };

    const parseExponent = (): number => {
      let val = parseFactorial();
      while (peek() === '^') {
        consume();
        val = Math.pow(val, parseExponent());
      }
      return val;
    };

    const parseMulDiv = (): number => {
      let val = parseExponent();
      while (peek() === '*' || peek() === '/') {
        const op = consume();
        const next = parseExponent();
        if (op === '*') val *= next;
        if (op === '/') {
          if (next === 0) throw new Error("Divide by Zero");
          val /= next;
        }
      }
      return val;
    };

    const parseExpression = (): number => {
      let val = parseMulDiv();
      while (peek() === '+' || peek() === '-') {
        const op = consume();
        const next = parseMulDiv();
        if (op === '+') val += next;
        if (op === '-') val -= next;
      }
      return val;
    };

    const result = parseExpression();
    if (isNaN(result)) throw new Error("Invalid Input");
    return result;
  }

  public static formatResult(val: number): string {
    if (isNaN(val)) return 'Error';
    if (!isFinite(val)) return 'Infinity';
    if (Math.abs(val) > 1e12 || (Math.abs(val) < 1e-9 && val !== 0)) {
      return val.toExponential(6);
    }
    // Correctly round floating point artifacts
    return Number(val.toPrecision(12)).toString();
  }
}
