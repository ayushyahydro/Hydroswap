import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import { useDerivedSwapInfo, useSwapActionHandlers } from 'lib/hooks/swap'
import { Field } from 'lib/state/swap'
import styled, { ThemedText } from 'lib/theme'

import Column from '../Column'
import Row from '../Row'
import TokenImg from '../TokenImg'
import TokenInput from './TokenInput'

const InputColumn = styled(Column)<{ approved?: boolean }>`
  margin: 0.75em;
  position: relative;

  ${TokenImg} {
    filter: ${({ approved }) => (approved ? undefined : 'saturate(0) opacity(0.4)')};
    transition: filter 0.25s;
  }
`

interface InputProps {
  disabled?: boolean
}

export default function Input({ disabled }: InputProps) {
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const {
    currencies: { [Field.INPUT]: inputCurrency },
    currencyBalances: { [Field.INPUT]: balance },
    parsedAmounts: { [Field.INPUT]: inputAmount },
  } = useDerivedSwapInfo()

  const inputUSDC = useUSDCValue(inputAmount)
  //TODO(ianlapham): mimic logic from app swap page
  const mockApproved = true

  return (
    <InputColumn gap={0.5} approved={mockApproved}>
      <Row>
        <ThemedText.Subhead2 color="secondary">
          <Trans>Trading</Trans>
        </ThemedText.Subhead2>
      </Row>
      <TokenInput
        currency={inputCurrency}
        amount={inputAmount}
        disabled={disabled}
        onMax={balance ? () => onUserInput(Field.INPUT, balance.toExact()) : undefined}
        onChangeInput={(val) => onUserInput(Field.INPUT, val ?? '')}
        onChangeCurrency={(currency: Currency) => onCurrencySelection(Field.INPUT, currency)}
      >
        <ThemedText.Body2 color="secondary">
          <Row>
            {inputUSDC ? `~ $${inputUSDC.toFixed(2)}` : '-'}
            {balance && (
              <ThemedText.Body2 color={inputAmount && inputAmount.greaterThan(balance) ? 'error' : undefined}>
                Balance: <span style={{ userSelect: 'text' }}>{balance}</span>
              </ThemedText.Body2>
            )}
          </Row>
        </ThemedText.Body2>
      </TokenInput>
      <Row />
    </InputColumn>
  )
}
