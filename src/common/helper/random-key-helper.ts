export class RandomKeyHelper {
    public static readonly alphabetLower = 'abcdefghijklmnopqrstuvwxyz';
    public static readonly alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    public static readonly alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    public static readonly numeric = '0123456789';
    public static readonly alphaNumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    public static readonly alphaLowerNumeric = 'abcdefghijklmnopqrstuvwxyz0123456789';
    public static readonly alphaUpperNumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    public static readonly allCharacter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

    private static getRandomArbitrary(min: number, max: number): number {
        return Math.trunc(Math.random() * (max - min) + min);
    }

    public static create(keyLength: number, validChars: string): string {
        let res = '';
        for (let i = 0; i < keyLength; i++) {
            const index = this.getRandomArbitrary(0, validChars.length);
            res += validChars[index];
        }
        return res;
    }
}
