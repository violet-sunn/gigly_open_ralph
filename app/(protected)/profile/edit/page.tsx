import { redirect } from 'next/navigation'

// The prototype has NO standalone profile-edit screen — editing is done through the in-place modals on /profile
// (bio / stack / categories / company requisites, wired to updateProfile + setFavoriteCategories). This route is
// retired: it permanently redirects to /profile. The old kit form (ProfileEditForm / ProfileEditHeader) is kept on
// disk but unreferenced, pending confirmation to delete it.
export default async function ProfileEditPage() {
  redirect('/profile')
}
