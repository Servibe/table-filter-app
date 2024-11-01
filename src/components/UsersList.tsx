// Importamos los types del User
import { SortBy, type User } from "../types.d";

// Creamos el Interface Props y lo asignamo al users
interface Props {
  users: User[];
  showColors: boolean;
  deleteUser: (email: string) => void;
  changeSorting: (sort: SortBy) => void;
}

export function UsersList({
  users,
  showColors,
  deleteUser,
  changeSorting,
}: Props) {
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>Foto</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.NAME)}>Nombre</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.LAST)}>Apellido</th>
          <th className="pointer" onClick={() => changeSorting(SortBy.COUNTRY)}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          const backgroundColor = index % 2 === 0 ? "#333" : "#555";
          const color = showColors ? backgroundColor : "transparent";

          return (
            <tr key={user.email} style={{ backgroundColor: color }}>
              <td>
                <img src={user.picture.thumbnail} alt="Foto usuario" />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button
                  onClick={() => {
                    deleteUser(user.email);
                  }}
                >
                  Borrar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
