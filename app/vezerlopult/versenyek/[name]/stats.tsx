import { useContext, useEffect, useState } from 'react';
import { VezerloContext } from '../../layout';
import { Button } from '@/components/ui/button';
import { Hash } from '@phosphor-icons/react';
import {
  getAttemptsByTeamId,
  getCompetitionData,
  getEveryTeamMembersStatsSeperatelyByTeamId,
  getTeamStatsById,
} from '@/lib/actions';
import { Attempt, Competitor, Team, User } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Flex, ProgressBar, Text } from '@tremor/react';

type TeamAttemptCount = {
  teamId: string;
  totalAttempts: number;
  correctAttempts: number;
  averageTimeTaken: number;
};

const customTooltip = ({ payload, active }: any) => {
  if (!active || !payload) return null;

  // {
  //   competitor: competitors[0],
  //   username: competitors[0].user.username,
  //   totalAttempts: competitor1_totalAttempts,
  //   correctAttempts: competitor1_correctAttempts,
  //   averageTimeTaken: competitor1_averageTimeTaken,
  //   points: competitor1_points,
  // },

  return (
    <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background p-2 shadow-tremor-dropdown border border-tremor-border">
      {payload.map((category: any, idx: any) => (
        <div key={idx} className="flex flex-1 space-x-2.5">
          <div className="space-y-1">
            <p className="font-bold text-tremor-content-emphasis">
              {category.payload.name}
            </p>
            <Separator
              className={`h-[3px] rounded-full bg-${category.color}-500`}
            />
            <p className="font-medium text-tremor-content-emphasis">
              {category.payload.totalAttempts} próbálkozás
            </p>
            <p className="font-medium text-tremor-content-emphasis">
              {category.payload.correctAttempts} helyes mo.
            </p>
            <p className="font-medium text-tremor-content-emphasis">
              {category.payload.averageTimeTaken.toFixed(2)} átlagos idő
            </p>
            <p className="font-bold pt-2 text-tremor-content-emphasis">
              {category.value} pont
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Stats() {
  const { competition } = useContext(VezerloContext);

  if (competition == undefined) return null;

  const [teams, setTeams] = useState<Team[]>([]);
  const [jurys, setJurys] = useState<User[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const [teamAttempts, setTeamAttempts] = useState<any>({});
  const [teamMembers, setTeamMembers] = useState<any>({});

  useEffect(() => {
    async function getData() {
      let temp = await getCompetitionData(competition?.name!);

      setTeams(temp.teams);
      setJurys(temp.jurys);
      setCompetitors(temp.teams.map((team) => team.competitors).flat());

      temp.teams.forEach(async (team) => {
        let temp = await getTeamStatsById(team.id, competition?.id!);
        let memberAttempts = await getEveryTeamMembersStatsSeperatelyByTeamId(
          team.id
        );

        setTeamMembers((prev: any) => ({
          ...prev,
          [team.id]: memberAttempts,
        }));

        if (temp !== undefined) {
          setTeamAttempts((prev: any) => ({
            ...prev,
            [team.id]: temp,
            memberAttempts,
          }));
        }
      });
    }

    if (competition) getData();
  }, [competition]);

  useEffect(() => {
    console.log(teamMembers);
  }, [teamMembers]);

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
                {index + 1}. helyezet: {team.name}
              </CardTitle>
              <Separator />
              <h2 className="text-lg text-gray-800">Csapattagok pontszámai</h2>

              {teamMembers && teamMembers.length !== 0 && (
                <BarChart
                  data={teamMembers[team.id].map((member: any) => ({
                    name: member.competitor.user.username,
                    Pontok: member.points,
                    totalAttempts: member.totalAttempts,
                    correctAttempts: member.correctAttempts,
                    averageTimeTaken: member.averageTimeTaken,
                  }))}
                  index="name"
                  categories={['Pontok']}
                  colors={['blue']}
                  yAxisWidth={48}
                  className="mt-2"
                  customTooltip={customTooltip}
                />
              )}

              <Separator />

              <Card className="w-full">
                <Flex>
                  <Text>
                    {teamAttempts[team.id]?.correctAttempts} helyes válasz
                  </Text>
                  <Text>{teamAttempts[team.id]?.totalAttempts}-ből</Text>
                </Flex>
                <ProgressBar value={45} color="blue" className="mt-3" />
              </Card>

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
