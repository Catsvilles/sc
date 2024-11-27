<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import SettingsModule from "./settings_module.svelte"

  let adminSection: Writable<string> = getContext("adminSection")
  adminSection.set("settings")

  export let data
  let { session, profile } = data
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<div class="flex items-center justify-between w-full p-2">
  <h1 class="text-lg">Settings</h1>
</div>

<SettingsModule
  title="Profile"
  editable={false}
  icon={`
    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
    </svg>
  `}
  fields={[
    { id: "fullName", label: "Name", initialValue: profile?.full_name ?? "" },
    // {
    //   id: "companyName",
    //   label: "Company Name",
    //   initialValue: profile?.company_name ?? "",
    // },
    // {
    //   id: "website",
    //   label: "Company Website",
    //   initialValue: profile?.website ?? "",
    // },
  ]}
  editButtonTitle="Edit Profile"
  editLink="/account/settings/edit_profile"
/>

<SettingsModule
  title="Email"
  icon={`
    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
    </svg>
  `}
  editable={false}
  fields={[{ id: "email", initialValue: session?.user?.email || "" }]}
  editButtonTitle="Change Email"
  editLink="/account/settings/change_email"
/>

<SettingsModule
  title="Password"
  icon={`
    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 17v4" />
      <path d="M10 20l4 -2" />
      <path d="M10 18l4 2" />
      <path d="M5 17v4" />
      <path d="M3 20l4 -2" />
      <path d="M3 18l4 2" />
      <path d="M19 17v4" />
      <path d="M17 20l4 -2" />
      <path d="M17 18l4 2" />
      <path d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M7 14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2" />
    </svg>
  `}
  editable={false}
  fields={[{ id: "password", initialValue: "••••••••••••••••" }]}
  editButtonTitle="Change Password"
  editLink="/account/settings/change_password"
/>

<SettingsModule
  title="Danger Zone"
  icon={`
  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
    <path d="M12 16h.01" />
  </svg>
  `}
  editable={false}
  dangerous={true}
  fields={[]}
  editButtonTitle="Delete Account"
  editLink="/account/settings/delete_account"
/>
