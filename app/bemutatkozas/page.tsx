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
        <Card>
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
                  className={index !== teamMembers.length - 1 ? 'mr-6' : ''}
                >
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>Bemutatkozás</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-justify">{member.description}</p>
                  </CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
                  </CardFooter>
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
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos magni, sequi atque quia officia tenetur eius? Aliquid quia consectetur vel assumenda at asperiores sed laborum iure, veniam expedita voluptates et.',
  },
  {
    name: 'Várszegi Barnabás',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet vitae velit ducimus, libero corrupti repudiandae pariatur! Saepe asperiores quas, repellendus laboriosam eaque, labore quasi, tempora iusto repellat aliquid nostrum hic.',
  },
  {
    name: 'Lénárt Dániel',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. In quibusdam magnam sunt quos quae non, ipsa ipsum culpa asperiores animi ea alias amet quaerat illo repellendus expedita atque. Deleniti, iure.',
  },
];
