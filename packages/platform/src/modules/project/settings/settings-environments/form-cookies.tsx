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

import { IconButton, Stack, DefaultButton, TextField, Label, Checkbox, IIconProps, DatePicker } from '@fluentui/react'
import { FormEvent, forwardRef, useMemo, useState, useCallback, useImperativeHandle } from 'react'

import { RequiredTextField } from '@perfsee/components'
import { lighten, SharedColors } from '@perfsee/dls'
import { CookieType } from '@perfsee/shared'

import { PartialCookie } from '../helper'
import { NormalToken, TextFieldStyles } from '../style'

type CookieProps = {
  cookie: PartialCookie
  index: number
  onCookieChange: (value: PartialCookie, index: number) => void
  onCookieRemove: (index: number) => void
}

const removeIconProps: IIconProps = { iconName: 'delete' }

const CheckboxStyles = {
  root: {
    backgroundColor: lighten(SharedColors.blue10, 0.5),
    border: `1px solid ${SharedColors.blue10}`,
    padding: '4px',
    margin: '8px 0',
  },
}

const FormCookie = (props: CookieProps) => {
  const { cookie, index, onCookieRemove, onCookieChange } = props
  const onRemove = useCallback(() => {
    onCookieRemove(index)
  }, [index, onCookieRemove])

  const onSelectDate = useCallback(
    (date?: Date | null) => {
      if (date) {
        onCookieChange({ ...cookie, expire: date.toISOString() }, index)
      }
    },
    [cookie, index, onCookieChange],
  )

  const onRemoveDate = useCallback(() => {
    onCookieChange({ ...cookie, expire: undefined }, index)
  }, [cookie, index, onCookieChange])

  const onChange = useCallback(
    (e?: FormEvent<HTMLElement | HTMLInputElement>, value?: string | boolean) => {
      if (!e || value === undefined) {
        return
      }
      const type = (e.target as HTMLInputElement).dataset.type!
      onCookieChange(
        { ...cookie, [type]: typeof value === 'string' ? value.trim() : type === 'secure' ? !value : value },
        index,
      )
    },
    [cookie, index, onCookieChange],
  )
  return (
    <div>
      <Stack horizontal horizontalAlign="space-between" tokens={{ padding: '8px 0 0 0' }}>
        Cookie #{index + 1}
        <IconButton
          iconProps={removeIconProps}
          styles={{ root: { color: SharedColors.red10 }, rootHovered: { color: SharedColors.red10 } }}
          onClick={onRemove}
        />
      </Stack>
      <Stack horizontal tokens={NormalToken}>
        <RequiredTextField
          value={cookie.name}
          styles={TextFieldStyles}
          placeholder="Name"
          onChange={onChange}
          data-type="name"
        />
        <TextField
          data-type="value"
          value={cookie.value}
          styles={TextFieldStyles}
          placeholder="Value"
          onChange={onChange}
        />
      </Stack>
      <Stack horizontal tokens={NormalToken}>
        <RequiredTextField
          value={cookie.domain}
          onChange={onChange}
          styles={TextFieldStyles}
          placeholder="Domain"
          data-type="domain"
        />
        <RequiredTextField
          value={cookie.path}
          onChange={onChange}
          styles={TextFieldStyles}
          placeholder="Path: e.g / "
          data-type="path"
        />
      </Stack>
      <Stack horizontal verticalAlign="center" tokens={NormalToken}>
        <span>Expire time:</span>
        <DatePicker
          styles={{ root: { flex: 1 }, textField: { '> span': { display: 'none' } } }}
          value={cookie.expire ? new Date(cookie.expire) : undefined}
          showMonthPickerAsOverlay={true}
          placeholder="We will notify you on this date."
          minDate={new Date()}
          onSelectDate={onSelectDate}
        />
        <IconButton
          iconProps={removeIconProps}
          styles={{ root: { color: SharedColors.gray30 } }}
          onClick={onRemoveDate}
        />
      </Stack>
      <Checkbox
        styles={CheckboxStyles}
        inputProps={{ 'data-type': 'httpOnly' } as any}
        onChange={onChange}
        label="Share this cookie with `document.cookie`"
        checked={cookie.httpOnly}
      />
      <Checkbox
        styles={CheckboxStyles}
        inputProps={{ 'data-type': 'secure' } as any}
        onChange={onChange}
        label="Share this cookie with Non-SSL servers"
        checked={!cookie.secure}
      />
    </div>
  )
}

export const FormCookies = forwardRef((props: { defaultCookies: CookieType[] }, ref) => {
  const [cookies, setCookies] = useState<PartialCookie[]>(props.defaultCookies)
  useImperativeHandle(
    ref,
    () => ({
      getCookies: () => {
        return cookies
      },
    }),
    [cookies],
  )

  const onCookieRemove = useCallback(
    (index: number) => {
      const newCookies = cookies.filter((_, i) => i !== index)
      setCookies(newCookies)
    },
    [cookies],
  )

  const onCookieChange = useCallback(
    (value: PartialCookie, index: number) => {
      const newCookies = [...cookies]
      newCookies[index] = value
      setCookies(newCookies)
    },
    [cookies],
  )

  const onAddCookie = useCallback(() => {
    setCookies([...cookies, { httpOnly: true, secure: false }])
  }, [cookies])

  const newCookies = useMemo(() => {
    return cookies.map((_, i) => {
      return (
        <FormCookie
          onCookieChange={onCookieChange}
          onCookieRemove={onCookieRemove}
          cookie={cookies[i]}
          index={i}
          key={i}
        />
      )
    })
  }, [cookies, onCookieChange, onCookieRemove])

  return (
    <>
      <Stack horizontal horizontalAlign="space-between" tokens={{ padding: '8px 0 0 0' }}>
        <Label htmlFor="cookies">Cookies</Label>
        <DefaultButton onClick={onAddCookie}>add Cookies</DefaultButton>
      </Stack>
      {newCookies}
    </>
  )
})
