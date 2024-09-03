import db from "..";
import { Participant } from "../../interface";

export async function createParticipant(
  participant: Participant
): Promise<FirebaseFirestore.DocumentReference> {
  return db.collection("participants").add({
    fid: participant?.fid,
  });
}

export async function getParticipant(
  id: string
): Promise<FirebaseFirestore.DocumentSnapshot> {
  return db.collection("participants").doc(id).get();
}
