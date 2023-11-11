import { useContext } from 'react';
import DashboardCard from '../dashboardCard';
import { Question, UserCirclePlus, UserList } from '@phosphor-icons/react';

export default function MainTasksCards() {
  return (
    <>
      <div className="grid md:grid-cols-2 md:space-x-6 space-x-0 space-y-6 md:space-y-0">
        <DashboardCard
          Icon={Question}
          title="Feladat létrehozása"
          description="A kártyára kattintva megtalálja a feladatok regisztrációs felületét"
          buttonText="01. létrehozás"
          link="/vezerlopult/feladatok/letrehozas"
        />

        <DashboardCard
          Icon={Question}
          title="Fiókok kezelése"
          description="A kártyára kattintva megtalálja a feladatok kezelői felületet"
          buttonText="02. kezelés"
          link="/vezerlopult/feladatok/"
        />
      </div>
    </>
  );
}
