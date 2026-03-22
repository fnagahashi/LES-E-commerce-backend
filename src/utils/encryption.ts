import * as bcrypt from 'bcryptjs';

export class EncryptionUtil {
  private static readonly SALT_ROUNDS = 10;

  static async criptografar(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }


  static async comparar(password: string, passwordEncryption: string): Promise<boolean> {
    await bcrypt.compare(password, passwordEncryption);
    return;
  }
}