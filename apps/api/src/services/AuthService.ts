import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserRepository, UserRepository } from "@repo/domain/src/repositories/IUserRepository.js";
import { IUser } from "@repo/domain/src/entities/IUser";
import { AuthenticationError, ConflictError } from "@repo/lib/src/utils/errors";
import { inject, injectable } from "tsyringe";

const JWT_EXPIRATION_TIME = 360000;
const INVALID_CREDS_MESSAGE = "Invalid credentials  ";
type JwtPayload = Pick<IUser, "email" | "id">;

@injectable()
export class AuthService {
  
  constructor(
    private userRepo: UserRepository,
    @inject("jwtSecret") private secret: string,
  ) {}

  private async encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  private generateToken(payload: JwtPayload) {
    return jwt.sign(payload, this.secret, {
      expiresIn: JWT_EXPIRATION_TIME,
    });
  }

  verifyJwt(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }

  async login(email: string, password: string): Promise<string> {
    const user = (await this.userRepo.select({ email }))[0];

    if (!user) {
      throw new AuthenticationError(INVALID_CREDS_MESSAGE);
    }

    const valid = await this.comparePasswords(password, user.password);
    if (!valid) {
      throw new AuthenticationError(INVALID_CREDS_MESSAGE);
    }

    const token = this.generateToken({
      email: user.email,
      id: user.id,
    });

    return token;
  }

  async register(email: string, password: string): Promise<string> {
    const existing = await this.userRepo.select({ email });
    if (existing?.length > 0) {
      throw new ConflictError("User already exists");
    }
    const hashedPassword = await this.encryptPassword(password);
    const createdUsers = await this.userRepo.save([
      {
        email,
        password: hashedPassword,
      },
    ]);

    const token = this.generateToken({
      email: email,
      id: createdUsers[0]!.id,
    });

    console.log(createdUsers);

    return token;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async revokeToken(email: string) {
    throw new Error("Unimplemented");
  }
}
