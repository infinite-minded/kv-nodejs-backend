interface CalculatorInterface {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
  square(a: number): number;
  cube(a: number): number;
}

class Calculator implements CalculatorInterface {
    add(a: number, b: number): number {
        return a+b;
    }
    subtract(a: number, b: number): number {
        return a-b;
    }
    multiply(a: number, b: number): number {
        return a*b;
    }
    divide(a: number, b: number): number {
        if (b==0) return undefined;
        return a/b;
    }
    square(a: number): number{
        return a*a;
    }
    cube(a: number): number{
        return a*a*a;
    }
}

const calc = new Calculator();
console.log(calc.add(3,4));
console.log(calc.subtract(2,4));
console.log(calc.multiply(5,2));
console.log(calc.divide(4,3).toPrecision(2));
console.log(calc.square(3));
console.log(calc.cube(5));