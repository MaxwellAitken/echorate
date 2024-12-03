import { db } from "../_utils/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

export async function getUsers(){
    try {
        const allUsers = collection(db, "users");
        const allUsersQuery = query(allUsers);
        const allUsersSnapshot = await getDocs(allUsersQuery);

        let userList = [];

        allUsersSnapshot.forEach((doc) => {
            let thisUser = {
                id: doc.id,
                ...doc.data()
            };
            userList.push(thisUser);
        });

        return userList;
    } catch (error) {
        console.error(error);
    }
}

// ?????????????????????????????
export async function addUser(userId, user) {
    try {
        const newUserReference = collection(db, "users", userId, "users");
        await addDoc(newUserReference, user);
    } catch (error){
        console.error(error);
    }
}
