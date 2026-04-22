import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Book, BookFormValues } from '../types';

let db: any = null;
let auth: any = null;

const loadConfig = async () => {
    try {
        const configUrl = `${import.meta.env.BASE_URL}firebase-applet-config.json`;
        const configText = await fetch(configUrl).then(r => r.json());
        const app = initializeApp(configText);
        db = getFirestore(app, configText.firestoreDatabaseId);
        auth = getAuth(app);
        return { db, auth };
    } catch (e) {
        console.error("Firebase config not found or failed to load. Please complete Firebase setup.");
        return null;
    }
};

export const initFirebase = async (onUserChange: (user: User | null) => void) => {
    const services = await loadConfig();
    if (!services) return null;
    
    onAuthStateChanged(services.auth, onUserChange);
    return services;
};

export const loginWithGoogle = async () => {
    if (!auth) await loadConfig();
    if (!auth) throw new Error("Firebase not initialized");
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export const logout = async () => {
    if (!auth) await loadConfig();
    if (!auth) return;
    return auth.signOut();
};

export const saveBook = async (userId: string, bookData: BookFormValues & { category: string }) => {
    if (!db) await loadConfig();
    if (!db) throw new Error("Firebase not initialized");
    
    return addDoc(collection(db, 'books'), {
        ...bookData,
        userId,
        createdAt: serverTimestamp(),
        borrowDate: bookData.borrowDate ? Timestamp.fromDate(bookData.borrowDate) : null,
        returnDate: bookData.returnDate ? Timestamp.fromDate(bookData.returnDate) : null,
    });
};

export const subscribeToBooks = (userId: string, callback: (books: Book[]) => void) => {
    if (!db) {
        console.warn("DB not ready for subscription");
        return () => {};
    }
    
    const q = query(
        collection(db, 'books'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
        const books = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp)?.toDate(),
            borrowDate: (doc.data().borrowDate as Timestamp)?.toDate(),
            returnDate: (doc.data().returnDate as Timestamp)?.toDate(),
        })) as Book[];
        callback(books);
    });
};

export const deleteBookEntry = async (bookId: string) => {
    if (!db) await loadConfig();
    if (!db) throw new Error("Firebase not initialized");
    return deleteDoc(doc(db, 'books', bookId));
};
