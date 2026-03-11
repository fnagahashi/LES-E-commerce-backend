import * as bcrypt from 'bcryptjs';

export class CriptografiaUtil {
  private static readonly SALT_ROUNDS = 10;

  static async criptografar(senha: string): Promise<string> {
    return await bcrypt.hash(senha, this.SALT_ROUNDS);
  }


  static async comparar(senhaTextoPlano: string, senhaCriptografada: string): Promise<boolean> {
    return await bcrypt.compare(senhaTextoPlano, senhaCriptografada);
  }
}