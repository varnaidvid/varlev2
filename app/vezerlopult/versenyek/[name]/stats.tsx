import { useContext, useEffect, useState } from 'react';
import { VezerloContext } from '../../layout';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Coin, Hash, Trophy } from '@phosphor-icons/react';
import {
  getAttemptsByTeamId,
  getCompetitionData,
  getCompetitionsTeamCount,
  getEveryTeamMembersStatsSeperatelyByTeamId,
  getTeamStatsById,
} from '@/lib/actions';
import { Attempt, Competitor, Team, User } from '@prisma/client';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart, Flex, ProgressBar, Text } from '@tremor/react';
import { Metric, CategoryBar, Grid } from '@tremor/react';
import { BrainCog, LucideBrainCog } from 'lucide-react';

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
          <div className="space-y-1 w-full">
            <p className="font-bold text-tremor-content-emphasis">
              {category.payload.name}
            </p>
            <Separator className="w-full" />
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

  const [teamAttempts, setTeamAttempts] = useState<any>([]);
  const [teamMembers, setTeamMembers] = useState<any>([]);
  const [avgPoints, setAvgPoints] = useState<number>(0);

  const [points, setPoints] = useState<number>(0);
  const [memberCounts, setMemberCounts] = useState<number>(0);

  const [avgPointsByTeams, setAvgPointsByTeams] = useState<number>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamCount, setTeamCount] = useState<number>();

  useEffect(() => {
    async function getData() {
      setIsLoading(true);

      let temp = await getCompetitionData(competition?.name!);

      setTeams(temp.teams);
      setJurys(temp.jurys);
      setCompetitors(temp.teams.map((team) => team.competitors).flat());

      await temp.teams.forEach(async (team) => {
        let temp = await getTeamStatsById(team.id, competition?.id!);
        let memberAttempts = await getEveryTeamMembersStatsSeperatelyByTeamId(
          team.id
        );

        memberAttempts.forEach((member: any) => {
          setPoints((prev: number) => prev + member.points);
          setMemberCounts((prev: number) => prev + 1);
        });

        setTeamMembers((prev: any) => ({
          ...prev,
          [team.id]: memberAttempts,
        }));

        if (temp !== undefined) {
          setTeamAttempts((prev: any) => [
            ...prev,
            {
              ...temp,
              memberAttempts,
            },
          ]);
        }
      });

      setIsLoading(false);
    }

    async function getTeamCount() {
      let count = await getCompetitionsTeamCount(competition!.name);
      setTeamCount(count);
    }

    if (competition) getTeamCount();
    if (teamCount) getData();
  }, [competition, teamCount]);

  useEffect(() => {
    if (competitors.length !== 0 && teamCount == teamAttempts.length) {
      setAvgPoints((points / memberCounts).toFixed(2) as any);
      setAvgPointsByTeams((points / teamCount!).toFixed(2) as any);
    }
  }, [points, memberCounts]);

  useEffect(() => {
    if (!isLoading && teamAttempts.length !== 0) {
      setTeams((prev) => {
        return prev.sort((a, b) => {
          return (
            (teamAttempts[b.id]?.points || 0) -
            (teamAttempts[a.id]?.points || 0)
          );
        });
      });
    }
  }, [isLoading]);

  return (
    <>
      <h3 className="text-xl mb-4">{competition.name}</h3>

      {isLoading ||
        teamAttempts == undefined ||
        teamCount == undefined ||
        (teamAttempts.length != teamCount && (
          <h2 className="p-6 animate-pulse">Adatok betöltése folyamatban...</h2>
        ))}

      {!isLoading &&
        teamAttempts != undefined &&
        teamCount != undefined &&
        teamAttempts.length == teamCount && (
          <>
            <div className="flex gap-4 mb-2">
              <Button
                variant="outline"
                type="button"
                size="sm"
                className="hidden h-8 lg:flex mb-4 hover:cursor-default"
              >
                <Hash color="blue" className="mr-2 h-4 w-4" />
                {competitors.length} versenyző töltötte ki
              </Button>

              <Button
                variant="outline"
                type="button"
                size="sm"
                className="hidden h-8 lg:flex mb-4 hover:cursor-default"
              >
                <Brain color="green" className="mr-2 h-4 w-4" />
                {avgPoints} pont versenyzőnként
              </Button>

              <Button
                variant="outline"
                type="button"
                size="sm"
                className="hidden h-8 lg:flex mb-4 hover:cursor-default"
              >
                <LucideBrainCog color="orange" className="mr-2 h-4 w-4" />
                {avgPointsByTeams} pont csapatonként
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-base">Rövid leírása:</h3>

              <span className="text-base font-light">
                {competition.description}
              </span>
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

            <div className="flex flex-col gap-2 mt-4">
              {teamAttempts.map((team: any, index: any) => (
                <Card key={team.id} className="relative mt-4">
                  <CardHeader>
                    <div className="flex justify-start items-center gap-3">
                      {index === 0 && (
                        <Trophy
                          color="#facc15"
                          weight="bold"
                          className="h-[60px] w-[60px] -mt-4"
                        />
                      )}
                      <div>
                        <CardTitle>
                          {index + 1}. helyezet: {team.team.name}
                        </CardTitle>
                        <CardDescription className="mb-3">
                          {team.team.description}
                        </CardDescription>
                      </div>
                    </div>

                    <br />
                    <div className="flex gap-4 my-5">
                      <Button
                        variant="outline"
                        type="button"
                        size="sm"
                        className="hidden h-8 lg:flex mb-4 hover:cursor-default"
                      >
                        <Clock color="purple" className="mr-2 h-4 w-4" />
                        {(team.averageTimeTaken / 3).toFixed(2)} mp. átlagos idő
                      </Button>

                      <Button
                        variant="outline"
                        type="button"
                        size="sm"
                        className="hidden h-8 lg:flex mb-4 hover:cursor-default"
                      >
                        <Coin color="yellow" className="mr-2 h-4 w-4" />
                        {team.points} elért pontszám
                      </Button>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                          Csapattagok pontszámai
                        </CardTitle>
                        <CardDescription>
                          Csapattagok részletesebb statisztikáit a megfelelő
                          felhasználó kiválasztásával tekintheted meg.
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        {teamMembers && teamMembers.length !== 0 && (
                          <BarChart
                            data={team.memberAttempts.map((member: any) => ({
                              name: member.username,
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
                      </CardContent>
                    </Card>

                    <br />

                    <Card>
                      <CardHeader>
                        <div className="w-full flex justify-between items-start">
                          <div className="flex-grow">
                            <CardTitle className="text-xl font-semibold w-full">
                              Helyes válaszok
                            </CardTitle>
                            <CardDescription>
                              Helyes válaszok száma / Összes válaszok száma
                            </CardDescription>
                          </div>
                          <Flex
                            justifyContent="end"
                            alignItems="baseline"
                            className="space-x-1 w-max"
                          >
                            {teamMembers.length !== 0 && (
                              <>
                                <Metric>{team.correctAttempts}</Metric>
                                <Text>/ {team.totalAttempts}</Text>
                              </>
                            )}
                          </Flex>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CategoryBar
                          values={[25, 25, 35, 15]}
                          colors={['rose', 'orange', 'yellow', 'emerald']}
                          markerValue={
                            (team.correctAttempts / team.totalAttempts) * 100
                          }
                          tooltip={`Helyes válaszok: ${team.correctAttempts}`}
                          showLabels={false}
                          className="mt-5"
                        />
                      </CardContent>
                    </Card>
                  </CardHeader>
                </Card>
              ))}
              <br />
            </div>
          </>
        )}
    </>
  );
}
