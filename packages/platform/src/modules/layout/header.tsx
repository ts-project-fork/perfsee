/*
Copyright 2022 ByteDance and/or its affiliates.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { useTheme } from '@emotion/react'
import { FC } from 'react'

import { HeaderLogo } from './header-logo'
import { HeaderContainer } from './header.style'
import { Operations } from './operations'

interface HeaderProps {
  narrow: boolean
}

export const Header: FC<HeaderProps> = ({ narrow }) => {
  const theme = useTheme()
  return (
    <div css={{ height: theme.layout.headerHeight }}>
      <HeaderContainer narrow={narrow}>
        <HeaderLogo />
        <Operations />
      </HeaderContainer>
    </div>
  )
}
