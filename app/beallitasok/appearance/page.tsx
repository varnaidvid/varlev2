import { Separator } from '@/components/ui/separator';
import { AppearanceForm } from '@/app/beallitasok/appearance/appearance-form';

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Megjelenés</h3>
        <p className="text-sm text-muted-foreground">
          Szabd testre a megjelenést. Válaszd ki a színsémát, amelyik a
          legjobban tetszik neked.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  );
}
