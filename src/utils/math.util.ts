//static keyword to call average directly without creating object of MathUtil
export class MathUtil {
  static average(num1: number, num2: number) {
    //num1 += 5; - uncomment this and test case will fail in math.util.test (when ulla sthalath)
    return this.sum(num1, num2) / 2;
  }

  static sum(num1: number, num2: number) {
    return num1 + num2;
  }
}
