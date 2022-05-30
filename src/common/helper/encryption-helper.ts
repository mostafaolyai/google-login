import * as crypto from 'crypto';
import * as hash from 'object-hash';
import * as moment from 'moment';

export class EncryptionHelper {
    private static enc_algorithm = 'aes-256-cbc';
    private static enc_key = Buffer.from('8l4VcgZ7b2pysZznW025123kjhUIOHGF', 'utf8');
    private static enc_iv = Buffer.from('-y/B?D(R+R;lQeTh', 'utf8');

    public static initialize(algorithm: string, key: string, iv: string): void {
        EncryptionHelper.enc_algorithm = algorithm;
        EncryptionHelper.enc_key = Buffer.from(key, 'utf8');
        EncryptionHelper.enc_iv = Buffer.from(iv, 'utf8');
    }

    public static encrypt(text): string {
        const cipher = crypto.createCipheriv(this.enc_algorithm, Buffer.from(this.enc_key), this.enc_iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }

    public static decrypt(text): string {
        const encryptedText = Buffer.from(text, 'hex');
        const decipher = crypto.createDecipheriv(this.enc_algorithm, Buffer.from(this.enc_key), this.enc_iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    static generateUniqueHash(object: any, uniqueLabels: string[]): string {
        const uniqueObject = {};
        uniqueLabels.forEach((item) => {
            uniqueObject[item] =
                object[item] === undefined
                    ? null
                    : item.toLowerCase().indexOf('date') !== -1
                    ? moment(
                          object[item],
                          [
                              'YYYY-MM-DD',
                              'YYYY-M-D',
                              'DD-MM-YYYY',
                              'YYYY/MM/DD',
                              'D-M-YYYY',
                              'DD/MM/YYYY',
                              'D/M/YYYY',
                              'MM-DD-YY',
                              'M-D-YY',
                              'MM/DD/YY',
                              'M/D/YY',
                          ],
                          null,
                          true,
                      ).format('YYYY-MM-DD')
                    : object[item];
            if (item.toLowerCase().indexOf('date') !== -1 && !moment(uniqueObject[item], 'YYYY-MM-DD').isValid()) console.log('here...');
        });
        return hash.sha1(uniqueObject);
    }
}
