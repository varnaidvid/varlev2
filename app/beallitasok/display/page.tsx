import { Separator } from '@/components/ui/separator';
import { DisplayForm } from '@/app/beallitasok/display/display-form';

export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Egyéb</h3>
        <p className="text-sm text-muted-foreground">Kapcsolgass kedvedre.</p>
      </div>
      <Separator />
      <DisplayForm />
    </div>
  );
}
