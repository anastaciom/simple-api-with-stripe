import { PrismaClient as PrismaClientLib } from "@prisma/client";

export class PrismaClient {
  private static instance: PrismaClientLib;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): PrismaClientLib {
    if (!PrismaClient.instance) {
      PrismaClient.instance = new PrismaClientLib();
    }

    return PrismaClient.instance;
  }
}
