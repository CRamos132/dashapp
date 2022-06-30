import { firestore } from "../firebase";
import {
  collection,
  query,
  getDocs,
  orderBy as firestoreOrderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { IEvent } from "../../interfaces/Event";

type eventId = string;

export async function getEventById(eventId: eventId): Promise<IEvent> {
  const eventDocRef = doc(firestore, "eventos", eventId as string);
  const eventDocSnap = await getDoc(eventDocRef);
  return { id: eventDocSnap.data() && eventDocSnap.id, ...eventDocSnap.data() } as IEvent;
}
