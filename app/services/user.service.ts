import { Session } from "@supabase/supabase-js"
import { type AppUser, type LoginFormData, type UserFormData } from "@/app/lib/definitions"
import { createClient } from "@/app/lib/supabase/client"

const supabase = createClient()

export const UserService = {
  signUp: async ({ email, password, full_name, is_admin = true }: UserFormData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          is_admin,
        }
      }
    })
    if (error) throw error
    return data.user as AppUser | undefined
  },
  login: async ({ email, password }: LoginFormData) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) throw error
    return session
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  },
  isAdmin: (session: Session | null) => session?.user?.user_metadata?.is_admin === true
}