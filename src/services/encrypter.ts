import bcrypt from "bcrypt";

export class EncrypterService {
  private readonly salt = 10;

  async encrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.salt);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);

    return match;
  }
}
