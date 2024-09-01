import db from '..'
import { Fan } from '../../interface'

export async function createFan(fan: Fan): Promise<FirebaseFirestore.DocumentReference> {
  return db.collection('fans').add({
    fid: fan.fid,
    score: fan.score,
    reactions: fan.reactions,
    recasts: fan.recasts,
    ranks: fan.ranks,
  })
}

export async function getFan(id: string): Promise<FirebaseFirestore.DocumentSnapshot> {
  return db.collection('fans').doc(id).get()
}