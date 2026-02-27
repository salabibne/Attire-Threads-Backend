export const paginate10 = (page: number, limit: number) => {
  //  convert page and limit to numbers
  page = Number(page);
  limit = Number(limit);
  // Add validation for page and limit
  if (page < 1) {
    page = 1;
  }
  if (limit < 1) {
    limit = 10; // default limit
  }

  const take = limit;
  const skip = (page - 1) * limit;
  return { take, skip };
};
