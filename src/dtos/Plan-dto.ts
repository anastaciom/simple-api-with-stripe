import { TPlanDto } from "./plan/type";

export class PlanDto {
  private readonly props: TPlanDto;

  constructor(props: TPlanDto) {
    this.props = props;
  }

  get get() {
    const {
      createdAt,
      description,
      id,
      isActive,
      name,
      price,
      priceId,
      themeColor,
      typeOfCharge,
      updatedAt,
    } = this.props;

    return {
      createdAt,
      description,
      id,
      isActive,
      name,
      price: price.toFixed(2),
      priceId,
      themeColor,
      typeOfCharge,
      updatedAt,
    };
  }
}
