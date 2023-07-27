import s from './UserMenu.module.scss'

import { ReactComponent as BeakTopIcon } from '@/assets/svg/beakTop.svg'
import { ReactComponent as LogoutIcon } from '@/assets/svg/logoutIcon.svg'
import { ReactComponent as PersonIcon } from '@/assets/svg/person.svg'
import { Avatar, Button, Typography, TypographyVariant } from '@/components/ui'

interface UserDropdownMenuProps {
  userData?: {
    name: string
    email: string
  }
}

export const UserMenu = ({ userData }: UserDropdownMenuProps) => {
  return (
    <div className={s.userMenu}>
      <BeakTopIcon className={s.beakTopIcon} />
      <div className={s.info}>
        <Avatar avatarFallback="JD" />
        <div className={s.name}>
          <Typography variant={TypographyVariant.Subtitle2}>{userData?.name}</Typography>
          <Typography variant={TypographyVariant.Caption} className={s.email}>
            {userData?.email}
          </Typography>
        </div>
      </div>
      <div className={s.hr} />
      <Button variant="link" className={s.btn}>
        <PersonIcon />
        <Typography variant={TypographyVariant.Caption}>My Profile</Typography>
      </Button>
      <div className={s.hr} />
      <Button variant="link" className={s.btn}>
        <LogoutIcon />
        <Typography variant={TypographyVariant.Caption}>Sign Out</Typography>
      </Button>
    </div>
  )
}