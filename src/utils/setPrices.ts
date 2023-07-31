const setPrices = (name: string) => {
  switch (name) {
    case "Padrão":
      return 19.9;
    case "Básico":
      return 9.9;
    case "Premium":
      return 80.0;
    default:
      return null;
  }
};

export { setPrices };
