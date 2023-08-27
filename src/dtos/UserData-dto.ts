import { TUserData } from "./types/userData-types";

export class UserDataDto {
  private readonly props: TUserData;

  constructor(props: TUserData) {
    this.props = props;
  }

  get get() {
    const { email, name, authorizations, subscription } = this.props;

    return {
      email,
      name,
      authorizations,
      subscription: subscription ?? "Nenhuma inscrição.",
    };
  }
}
