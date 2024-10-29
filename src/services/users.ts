const delay = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

export const fetchUsers = async ({ pageParam }: { pageParam?: number }) => {
  await delay(300);

  return await fetch(
    `https://randomuser.me/api/?results=10&seed=midudev&page=${pageParam}`
  )
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Error al cargar los datos");
      }

      return await res.json();
    })
    .then((res) => {
      const currentPage = Number(res.info.page);
      const nextCursor = currentPage > 3 ? undefined : currentPage + 1;

      return {
        users: res.results,
        nextCursor,
      };
    });
};
