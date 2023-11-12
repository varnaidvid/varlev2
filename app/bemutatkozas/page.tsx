import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <main className="container mx-auto text-gray-700">
      <div className="my-10">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2">
              A csapatunkról
            </CardTitle>
            <CardDescription>Bemutatkozás</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-justify">
              Elkötelezettek és szakmailag felkészültek vagyunk alkalmazásunk
              fejlesztésében. A csapat most intenzíven dolgozik a verseny
              idején, és minden erőfeszítésünket arra összpontosítjuk, hogy az
              alkalmazásunk a lehető legjobb teljesítményt nyújtsa a versenyen.
              A csapatunk tagjai szorosan együttműködnek, és kitartóan
              törekszünk a kiválóságra, hogy bizonyítsuk elhivatottságunkat és
              tehetségünket a versenyen.
            </p>

            <div className="flex mt-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className={index !== teamMembers.length - 1 ? 'mr-6' : ' + '}
                >
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>Bemutatkozás</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-justify">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const teamMembers = [
  {
    name: 'Várnai Dávid',
    description:
      'Webes applikációk fejlesztésében mélyültem el az elmúlt 2 évben mely során kipróbáltam számos könyvtárat, illetve keretrendszert. Jelenleg NextJS-t és Supabase-t használom "szerver nélküli" applikációk fejlesztésére.',
  },
  {
    name: 'Várszegi Barnabás',
    description:
      '3 éve az egyik Arduinós projektemhez kellett egy program, akkor kezdtem programozói pályafutásomat. Azóta több térbe is belekóstoltam, de végig a webfejlesztés maradt fókuszban.',
  },
  {
    name: 'Lénárt Dániel',
    description:
      'Édesapám nyomán én is az informatika után kezdtem érdeklődni már gyerek koromban is. Pár éve komolyabban is foglalkozom az informatikával, főleg webfejlesztés keretein belül.',
  },
];
