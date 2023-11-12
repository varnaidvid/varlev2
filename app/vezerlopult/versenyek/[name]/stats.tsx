import { useContext, useEffect, useState } from 'react';
import { VezerloContext } from '../../layout';
import { Button } from '@/components/ui/button';
import { Hash } from '@phosphor-icons/react';
import {
  getAttemptsByTeamId,
  getCompetitionData,
  getTeamStatsById,
} from '@/lib/actions';
import { Attempt, Competitor, Team, User } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

type TeamAttemptCount = {
  teamId: string;
  totalAttempts: number;
  correctAttempts: number;
  averageTimeTaken: number;
};

export default function Stats() {
  const { competition } = useContext(VezerloContext);

  if (competition == undefined) return null;

  const [teams, setTeams] = useState<Team[]>([]);
  const [jurys, setJurys] = useState<User[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const [teamAttempts, setTeamAttempts] = useState<any>({});

  useEffect(() => {
    async function getData() {
      let temp = await getCompetitionData(competition?.name!);

      setTeams(temp.teams);
      setJurys(temp.jurys);
      setCompetitors(temp.teams.map((team) => team.competitors).flat());

      temp.teams.forEach(async (team) => {
        console.log(team.id);
        let temp = await getTeamStatsById(team.id, competition?.id!);

        console.log(temp);

        if (temp !== undefined) {
          setTeamAttempts((prev: any) => ({
            ...prev,
            [team.id]: temp,
          }));
        }
      });
    }

    if (competition) getData();
  }, [competition]);

  return (
    <div>
      <h3 className="text-lg mb-4">{competition.name}</h3>

      <div className="flex gap-4">
        <Button
          variant="outline"
          type="button"
          size="sm"
          className="hidden h-8 lg:flex mb-4 hover:cursor-default"
        >
          <Hash color="blue" className="mr-2 h-4 w-4" />
          {competitors.length} versenyző töltötte ki
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="text-base">Rövid leírása:</h3>

        <span className="text-base font-light">{competition.description}</span>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="text-base">Zsűri tagok:</h3>

        <span className="text-base font-light">
          {jurys.map((jury) => jury.username).join(', ')}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="text-base">Kezdés:</h3>

        <span className="text-base font-light">
          {new Date(competition.startDate).toLocaleString()}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <h3 className="text-base">Zárás:</h3>

        <span className="text-base font-light">
          {new Date(competition.endDate).toLocaleString()}
        </span>
      </div>

      <br />

      <h3 className="mb-2">Csapatonkénti statisztika:</h3>
      <div className="flex flex-col gap-2">
        {teams.map((team, index) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle className="mb-2">
                {index + 1}. {team.name}
                <Separator />
              </CardTitle>
              <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm">Összes próbálkozás:</span>
                  <span className="text-sm">Helyes próbálkozások:</span>
                  <span className="text-sm">Átlagos idő:</span>
                  <span className="text-sm font-bold">Pontszám:</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm">
                    {teamAttempts[team.id]?.totalAttempts}
                  </span>
                  <span className="text-sm">
                    {teamAttempts[team.id]?.correctAttempts}
                  </span>
                  <span className="text-sm">
                    {teamAttempts[team.id]?.averageTimeTaken}
                  </span>
                  <span className="text-sm">
                    {teamAttempts[team.id]?.points}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
