/* eslint-disable react/react-in-jsx-scope */
import { useMemo, useState } from "react";
import "./App.css";
import { UsersList } from "./components/UsersList";
import { SortBy, type User } from "./types.d";
import { useUsers } from "./hooks/useUsers";
import { Results } from "./components/Results";

function App() {
  const { status, error, users, refetch, fetchNextPage, hasNextPage } =
    useUsers();

  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;

    setSorting(newSortingValue);
  };

  const filteredUsers = useMemo(() => {
    // Hacemos el typeof para tener en cuenta que el valor que nos venga no sea nullable
    return typeof filterCountry === "string" && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    // toSorted esta soportado por TS pero se define en los types para que no marque error

    if (sorting === SortBy.NONE) return filteredUsers;

    let sortedFn = (a: User, b: User) =>
      a.location.country.localeCompare(b.location.country);

    if (sorting === SortBy.NAME) {
      sortedFn = (a, b) => a.name.first.localeCompare(b.name.first);
    }

    if (sorting === SortBy.LAST) {
      sortedFn = (a, b) => a.name.last.localeCompare(b.name.last);
    }

    return filteredUsers.toSorted(sortedFn);
  }, [filteredUsers, sorting]);

  const handleDelete = (email: string) => {
    // const filteredUsers = users.filter((user) => user.email !== email);
    // setUsers(filteredUsers);
  };

  const handleReset = () => {
    // setUsers(originalUsers.current);
    void refetch();
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  return (
    <div className="App">
      <h1>Filtrar Tabla</h1>
      <Results />
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          {sorting == SortBy.COUNTRY
            ? "No ordenar por país"
            : "Ordenar por país"}
        </button>
        <button onClick={handleReset}>Restaurar el estado</button>
        <input
          placeholder="Filtra por país"
          onChange={(e) => {
            setFilterCountry(e.target.value);
          }}
        />
      </header>
      <main>
        {status === "pending" ? (
          <strong>Cargando...</strong>
        ) : status === "error" ? (
          <p>Error al cargar los datos</p>
        ) : (
          <UsersList
            users={sortedUsers}
            showColors={showColors}
            deleteUser={handleDelete}
            changeSorting={handleChangeSort}
          />
        )}
        {!hasNextPage && <p>No hay más usuarios</p>}
        {hasNextPage && (
          <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
            Cargar mas resultados
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
