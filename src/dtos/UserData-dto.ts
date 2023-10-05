import { TUserData } from "./types/userData-types";

export class UserDataDto {
  private readonly props: TUserData;

  constructor(props: TUserData) {
    this.props = props;
  }

  get get() {
    const { email, name, authorizations, subscription, avatarUrl } = this.props;

    return {
      avatarUrl,
      email,
      name,
      authorizations,
      subscription,
    };
  }
}
