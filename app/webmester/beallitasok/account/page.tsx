import { Separator } from '@/components/ui/separator';
import { AccountForm } from '@/app/webmester/beallitasok/account/account-form';

export default function SettingsAccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Fiók</h3>
        <p className="text-sm text-muted-foreground">
          Frissítsd a profilodat, változtasd meg a jelszavadat, vagy töröld a
          fiókodat.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
