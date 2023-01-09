import { useState, useEffect } from "react";
import { db } from "./db/firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    age: 0,
  });
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, newUser);
    window.location.reload();
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const updatedFields = { age: age + 1 };
    await updateDoc(userDoc, updatedFields);
    window.location.reload();
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    window.location.reload();
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  return (
    <div className="container">
      <input
        placeholder="Name..."
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />

      <input
        placeholder="Age..."
        value={newUser.age}
        onChange={(e) =>
          setNewUser({ ...newUser, age: Number(e.target.value) })
        }
      />

      <button onClick={createUser}>Create User</button>

      {users.map((user) => {
        return (
          <div className="user" key={user.id}>
            <h1>Name: {user.name}</h1>
            <h2>Age: {user.age}</h2>
            <div className="buttons">
              <button onClick={() => updateUser(user.id, user.age)}>
                Increase Age
              </button>
              <button onClick={() => deleteUser(user.id)}>Delete User</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
