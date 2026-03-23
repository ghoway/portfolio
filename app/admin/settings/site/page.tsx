import { getSiteSettings } from "@/actions/settings";
import { SiteSettingsForm } from "../settings-form";

export default async function AdminSiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-sm text-neutral-500">
          Configure your site metadata, social links, contact forwarding, and AI model.
        </p>
      </div>
      <SiteSettingsForm settings={settings} />
    </div>
  );
}
