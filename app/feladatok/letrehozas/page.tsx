'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  // field for .txt file upload
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type === 'text/plain' || file.name.endsWith('.txt'),
      {
        message: 'Csak .txt fájlok tölthetőek fel!', // Only .txt files can be uploaded!
      }
    ),
});

//question table:
// model Question {
//     id String @id @default(uuid())

//     question String
//     // syntax: word1 word2 word3 word4 6
//     // (4 szó, utolsó szám évfolyam)

//     competitions Competition[]
//     attempts     Attempt[]

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
// }

export default function FeladatLetrehozas() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // ✅ This will be type-safe and validated.
    console.log(data);
  };

  return (
    <div>
      <h1>Feladatok letrehozasa</h1>
    </div>
  );
}
