/**
 * @author <Aniket.P>
 * @description Math utils
 * @copyright Supra International, inc
 */
export class MathUtils {

    public static formatCurrency(amountInCent: number): string {
        if (!amountInCent || amountInCent === 0) {
            return '-';
        }
        const amount = Math.round(amountInCent / 100);
        const formattedAmount = amount.toString().includes('.') ? '$' + amount.toString() : '$' + amount.toString() + '.00';
        return formattedAmount;
    }
}
