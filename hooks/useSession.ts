import { useState } from 'react';


export type LocalSession = { id: string; email: string; firstName: string; lastName: string } | null;


export function useSession() {
const [session, setSession] = useState<LocalSession>(null);
return { session, setSession };
}